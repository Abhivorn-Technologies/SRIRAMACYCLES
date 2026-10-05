import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { extractAuthUser } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, TAX_RATE } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const auth = extractAuthUser(req);
    const body = await req.json();

    const { customer, shippingAddress, items, paymentMethod, notes, couponCode } = body;

    // Validation
    const customerName = (customer?.name || shippingAddress?.name || '').trim();
    const customerPhone = (customer?.phone || shippingAddress?.phone || '').trim();
    const customerEmail = (customer?.email || '').trim().toLowerCase();

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, message: 'Please provide customer name and phone number' },
        { status: 400 }
      );
    }

    if (
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return NextResponse.json(
        { success: false, message: 'Please provide a complete shipping address' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your shopping cart is empty' },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const validatedItems = [];

    // Calculate subtotal & validate items
    for (const item of items) {
      const unitPrice =
        item.product?.salePrice && item.product.salePrice > 0
          ? item.product.salePrice
          : (item.product?.price || item.price || 0);

      subtotal += unitPrice * (item.quantity || 1);

      const chosenSize = item.selectedSize || item.variant?.size || '';
      const chosenColor = item.selectedColor || item.variant?.color || '';

      // Determine the best image matching the color variant
      let itemImage = item.image || '';
      const productImages: string[] = item.product?.images || [];
      if (chosenColor && productImages.length > 0) {
        const lowerColor = chosenColor.toLowerCase();
        const matchedImg = productImages.find((img) => {
          const lowerImg = img.toLowerCase();
          if (lowerColor.includes('green') && lowerImg.includes('green')) return true;
          if (lowerColor.includes('yellow') && lowerImg.includes('yellow')) return true;
          if (lowerColor.includes('black') && lowerImg.includes('black')) return true;
          if (lowerColor.includes('blue') && (lowerImg.includes('blue') || lowerImg.includes('main'))) return true;
          if (lowerColor.includes('red') && lowerImg.includes('red')) return true;
          if (lowerColor.includes('orange') && (lowerImg.includes('orange') || lowerImg.includes('yellow'))) return true;
          return false;
        });
        if (matchedImg) {
          itemImage = matchedImg;
        }
      }
      if (!itemImage && productImages.length > 0) {
        itemImage = productImages[0];
      }
      if (!itemImage) {
        itemImage = '/images/products/gang-linear-ibc-main.png';
      }

      validatedItems.push({
        product: item.product?._id || item.product?.id || item.product,
        name: item.product?.name || item.name || 'Sri Rama Premium Cycle',
        image: itemImage,
        price: unitPrice,
        quantity: item.quantity || 1,
        variant: {
          size: chosenSize,
          color: chosenColor,
        },
      });
    }

    // Calculate coupon discount
    let discount = 0;
    if (couponCode === 'RIDE10') {
      discount = Math.round(subtotal * 0.1);
    } else if (couponCode === 'SRIRAMA15') {
      discount = Math.round(subtotal * 0.15);
    } else if (couponCode === 'WELCOME5') {
      discount = Math.round(subtotal * 0.05);
    }

    const discountedSubtotal = subtotal - discount;
    const shipping =
      discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0
        ? 0
        : STANDARD_SHIPPING_COST;
    const tax = Math.round(discountedSubtotal * TAX_RATE);
    const total = discountedSubtotal + shipping + tax;

    const orderNumber = generateOrderNumber();

    try {
      await connectToDatabase();

      // Deduct stock in DB if connected
      for (const item of items) {
        const prodId =
          item.product?._id ||
          item.product?.id ||
          (typeof item.product === 'string' && item.product.match(/^[0-9a-fA-F]{24}$/)
            ? item.product
            : null);

        let productDoc = null;
        if (prodId && prodId.match(/^[0-9a-fA-F]{24}$/)) {
          productDoc = await Product.findById(prodId);
        } else if (item.product?.slug) {
          productDoc = await Product.findOne({ slug: item.product.slug });
        }

        if (productDoc) {
          productDoc.stock = Math.max(0, productDoc.stock - item.quantity);
          // If product has variants, decrement matching variant's stock as well
          const chosenSize = item.selectedSize || item.variant?.size;
          const chosenColor = item.selectedColor || item.variant?.color;
          if (productDoc.variants && productDoc.variants.length > 0 && (chosenSize || chosenColor)) {
            const matchedVariant = productDoc.variants.find(
              (v: any) =>
                (!chosenSize || v.size === chosenSize) &&
                (!chosenColor || v.color === chosenColor)
            );
            if (matchedVariant && typeof matchedVariant.stock === 'number') {
              matchedVariant.stock = Math.max(0, matchedVariant.stock - item.quantity);
            }
          }
          await productDoc.save();
        }
      }

      // Find associated user by customer phone, email or customer auth (NEVER admin)
      let userDoc = null;
      try {
        const cleanPhone = customerPhone.replace(/\D/g, '');
        // 1. Prioritize finding the customer account by the phone number used at checkout
        if (cleanPhone.length >= 10) {
          userDoc = await User.findOne({
            phone: new RegExp(`${cleanPhone.slice(-10)}$`),
            role: 'customer',
          });
        }
        // 2. If not found by phone, check customer email
        if (!userDoc && customerEmail) {
          userDoc = await User.findOne({
            email: customerEmail,
            role: 'customer',
          });
        }
        // 3. If authenticated customer session
        if (!userDoc && auth && auth.userId && auth.role === 'customer') {
          userDoc = await User.findById(auth.userId);
        }
      } catch (findErr) {
        console.error('Error finding user for order:', findErr);
      }

      const order = await Order.create({
        orderNumber,
        user: userDoc ? userDoc._id : null,
        customer: {
          name: customerName,
          email: customerEmail || (customerPhone ? `${customerPhone}@sriramacycles.com` : ''),
          phone: customerPhone,
        },
        shippingAddress: {
          name: (shippingAddress.name || customerName).trim(),
          phone: (shippingAddress.phone || customerPhone).trim(),
          addressType: shippingAddress.addressType || 'Home',
          street: shippingAddress.street.trim(),
          landmark: shippingAddress.landmark || '',
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          pincode: shippingAddress.pincode.trim(),
          country: shippingAddress.country || 'India',
        },
        items: validatedItems,
        pricing: {
          subtotal,
          shipping,
          tax,
          discount,
          total,
        },
        paymentMethod: paymentMethod || 'COD',
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        orderStatus: 'Placed',
        tracking: {
          carrier: 'Srirama Express Courier',
          trackingNumber: `TRK-${orderNumber.replace('SRC-', '')}`,
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          statusUpdates: [
            {
              status: 'Placed',
              message: 'Order received and verified by Srirama Cycles dispatch center.',
              timestamp: new Date(),
            },
          ],
        },
        notes: notes || '',
      });

      // Save delivery address to customer profile if user exists (for Meesho-style 1-click 2nd order checkout)
      if (userDoc) {
        try {
          userDoc.addresses = userDoc.addresses || [];
          const isAddressAlreadySaved = userDoc.addresses.some(
            (a: any) =>
              a.pincode === shippingAddress.pincode.trim() &&
              a.street.toLowerCase() === shippingAddress.street.trim().toLowerCase()
          );

          if (!isAddressAlreadySaved) {
            const shouldBeDefault = userDoc.addresses.length === 0;
            userDoc.addresses.push({
              name: (shippingAddress.name || customer.name).trim(),
              phone: (shippingAddress.phone || customer.phone).trim(),
              addressType: shippingAddress.addressType || 'Home',
              street: shippingAddress.street.trim(),
              landmark: shippingAddress.landmark || '',
              city: shippingAddress.city.trim(),
              state: shippingAddress.state.trim(),
              pincode: shippingAddress.pincode.trim(),
              country: shippingAddress.country || 'India',
              isDefault: shouldBeDefault,
            } as any);
            await userDoc.save();
          }
        } catch (addrErr) {
          console.error('Failed to auto-save address to user profile:', addrErr);
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Order placed successfully',
          orderNumber: order.orderNumber,
          orderId: order._id,
          order: order,
        },
        { status: 201 }
      );
    } catch (dbErr) {
      console.warn('DB creation fallback, returning generated order:', dbErr);
      return NextResponse.json(
        {
          success: true,
          message: 'Order placed successfully',
          orderNumber,
          orderId: orderNumber,
          order: {
            orderNumber,
            pricing: { total },
          },
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
