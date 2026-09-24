import { NextRequest, NextResponse } from 'next/server';

// Known common pincodes cache for instant zero-latency lookup
const COMMON_PINCODES: Record<string, { city: string; state: string }> = {
  '506003': { city: 'Kazipet, Hanumakonda', state: 'Telangana' },
  '506001': { city: 'Warangal', state: 'Telangana' },
  '506002': { city: 'Warangal', state: 'Telangana' },
  '505001': { city: 'Karimnagar', state: 'Telangana' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '500081': { city: 'Hitec City, Hyderabad', state: 'Telangana' },
  '500034': { city: 'Banjara Hills, Hyderabad', state: 'Telangana' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '110001': { city: 'New Delhi', state: 'Delhi' },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const pincode = params.code?.trim();

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { success: false, message: 'Invalid 6-digit Indian PIN code' },
        { status: 400 }
      );
    }

    // Check fast local cache first
    if (COMMON_PINCODES[pincode]) {
      return NextResponse.json({
        success: true,
        pincode,
        city: COMMON_PINCODES[pincode].city,
        state: COMMON_PINCODES[pincode].state,
      });
    }

    // Call India Post public API
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      next: { revalidate: 86400 }, // Cache 24h
    });

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        message: 'Could not fetch pincode details',
      });
    }

    const data = await res.json();

    if (
      Array.isArray(data) &&
      data[0]?.Status === 'Success' &&
      data[0]?.PostOffice?.length > 0
    ) {
      const office = data[0].PostOffice[0];
      const city = office.District || office.Block || office.Division || office.Name;
      const state = office.State;

      return NextResponse.json({
        success: true,
        pincode,
        city,
        state,
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Pincode not found',
    });
  } catch (error: any) {
    console.error('Pincode lookup error:', error);
    return NextResponse.json(
      { success: false, message: 'Error looking up pincode' },
      { status: 500 }
    );
  }
}
