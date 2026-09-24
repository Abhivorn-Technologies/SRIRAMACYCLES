import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { extractAuthUser } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = extractAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const address = (user.addresses as any)?.id(params.id);
    if (!address) {
      return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 });
    }

    // If setting as default, unset previous defaults
    if (body.isDefault) {
      user.addresses?.forEach((addr: any) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    if (body.name !== undefined) address.name = body.name;
    if (body.phone !== undefined) address.phone = body.phone;
    if (body.addressType !== undefined) address.addressType = body.addressType;
    if (body.street !== undefined) address.street = body.street.trim();
    if (body.landmark !== undefined) address.landmark = body.landmark;
    if (body.city !== undefined) address.city = body.city.trim();
    if (body.state !== undefined) address.state = body.state.trim();
    if (body.pincode !== undefined) address.pincode = body.pincode.trim();

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error('Update address error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = extractAuthUser(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const initialLength = user.addresses?.length || 0;
    user.addresses = (user.addresses || []).filter(
      (addr: any) => addr._id.toString() !== params.id
    );

    if (user.addresses.length === initialLength) {
      return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 });
    }

    // If default was deleted and other addresses exist, make first one default
    if (user.addresses.length > 0 && !user.addresses.some((a: any) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error('Delete address error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete address' }, { status: 500 });
  }
}
