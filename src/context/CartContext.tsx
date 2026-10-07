'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IProduct, ICartItem } from '@/types';
import { useToast } from './ToastContext';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST, TAX_RATE } from '@/lib/constants';

interface ICartContext {
  cart: ICartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  addToCart: (product: IProduct, quantity?: number, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  appliedCoupon: string | null;
  removeCoupon: () => void;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<{
    type: 'percentage' | 'fixed';
    value: number;
    amount: number;
  } | null>(null);
  const { success, info, error } = useToast();

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('srirama_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage ONLY after initial load completes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('srirama_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback(
    (product: IProduct, quantity = 1, size = '', color = '') => {
      let message = `Added ${product.name} to cart`;
      let isLimit = false;

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex(
          (item) =>
            item.product._id === product._id &&
            item.selectedSize === size &&
            item.selectedColor === color
        );

        if (existingIndex > -1) {
          const updated = [...prevCart];
          const newQty = updated[existingIndex].quantity + quantity;
          if (product.stock && newQty > product.stock) {
            isLimit = true;
            updated[existingIndex].quantity = product.stock;
          } else {
            message = `Updated quantity of ${product.name} in cart`;
            updated[existingIndex].quantity = newQty;
          }
          return updated;
        } else {
          return [
            ...prevCart,
            {
              product,
              quantity: Math.min(quantity, product.stock || 99),
              selectedSize: size,
              selectedColor: color,
            },
          ];
        }
      });

      if (isLimit) {
        info(`Stock limit reached for ${product.name}`);
      } else {
        success(message);
      }
    },
    [info, success]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size = '', color = '') => {
      if (quantity <= 0) {
        removeFromCart(productId, size, color);
        return;
      }
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (
            item.product._id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          ) {
            const finalQty = item.product.stock ? Math.min(quantity, item.product.stock) : quantity;
            return { ...item, quantity: finalQty };
          }
          return item;
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const removeFromCart = useCallback((productId: string, size = '', color = '') => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(null);
  }, []);

  // Calculate Subtotal for coupon validation
  const currentSubtotal = cart.reduce((acc, item) => {
    const unitPrice =
      item.product.salePrice && item.product.salePrice > 0
        ? item.product.salePrice
        : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      const cleanCode = code.trim().toUpperCase();
      if (!cleanCode) return false;

      try {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: cleanCode, cartSubtotal: currentSubtotal }),
        });

        const data = await res.json();
        if (data.success && data.coupon) {
          setAppliedCoupon(data.coupon.code);
          setCouponDiscount({
            type: data.coupon.discountType,
            value: data.coupon.discountValue,
            amount: data.coupon.discountAmount,
          });
          success(data.message || `Coupon ${data.coupon.code} applied!`);
          return true;
        } else {
          error(data.message || 'Invalid coupon code');
          return false;
        }
      } catch (err) {
        // Fallback for offline/instant check
        if (cleanCode === 'RIDE10') {
          setAppliedCoupon('RIDE10');
          setCouponDiscount({
            type: 'percentage',
            value: 10,
            amount: Math.round((currentSubtotal * 10) / 100),
          });
          success('Coupon RIDE10 applied: 10% Off!');
          return true;
        }
        error('Failed to validate coupon code');
        return false;
      }
    },
    [currentSubtotal, error, success]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponDiscount(null);
    info('Coupon removed');
  }, [info]);

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = currentSubtotal;

  let discount = 0;
  if (couponDiscount) {
    if (couponDiscount.type === 'percentage') {
      discount = Math.round((subtotal * couponDiscount.value) / 100);
    } else {
      discount = Math.min(couponDiscount.value, subtotal);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = 0; // 100% Free delivery on all orders
  const tax = 0; // Prices are inclusive of GST
  const total = discountedSubtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        appliedCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
