import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import OfflineSale from '@/models/OfflineSale';
import { extractAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search')?.trim();
    const paymentMode = searchParams.get('paymentMode');
    const brand = searchParams.get('brand')?.trim();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const exportAll = searchParams.get('export') === 'true';

    const query: any = {};

    if (paymentMode && paymentMode !== 'ALL') {
      query.paymentMode = paymentMode;
    }

    if (brand && brand !== 'ALL') {
      query.brand = brand;
    }

    if (startDate || endDate) {
      query.purchaseDate = {};
      if (startDate) {
        query.purchaseDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.purchaseDate.$lte = end;
      }
    }

    if (search) {
      const regex = { $regex: search, $options: 'i' };
      query.$or = [
        { customerName: regex },
        { phone: regex },
        { cycleModel: regex },
        { brand: regex },
        { cycleSize: regex },
        { srNo: regex },
        { feedback: regex },
      ];
    }

    // If exporting all filtered results
    if (exportAll) {
      const records = await OfflineSale.find(query).sort({ purchaseDate: -1, createdAt: -1 }).lean();
      return NextResponse.json({
        success: true,
        records,
      });
    }

    const skip = (page - 1) * limit;

    const [records, total, statsAggregation] = await Promise.all([
      OfflineSale.find(query).sort({ purchaseDate: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      OfflineSale.countDocuments(query),
      OfflineSale.aggregate([
        {
          $group: {
            _id: null,
            totalRecords: { $sum: 1 },
            totalAmount: { $sum: '$price' },
            cashCount: {
              $sum: { $cond: [{ $eq: ['$paymentMode', 'Cash'] }, 1, 0] },
            },
            onlineCount: {
              $sum: {
                $cond: [{ $in: ['$paymentMode', ['Online', 'UPI', 'Card']] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const stats = statsAggregation[0] || {
      totalRecords: 0,
      totalAmount: 0,
      cashCount: 0,
      onlineCount: 0,
    };

    return NextResponse.json({
      success: true,
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching offline sales:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch offline sales' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = extractAuthUser(req, 'admin');
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    // Check if bulk insert
    if (body.records && Array.isArray(body.records)) {
      if (body.records.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No records provided in array' },
          { status: 400 }
        );
      }

      const formattedRecords = body.records.map((r: any) => {
        let parsedDate: Date;
        if (r.purchaseDate) {
          const d = new Date(r.purchaseDate);
          parsedDate = isNaN(d.getTime()) ? new Date() : d;
        } else {
          parsedDate = new Date();
        }

        return {
          srNo: String(r.srNo || '').trim(),
          customerName: String(r.customerName || 'Walk-in Customer').trim(),
          phone: String(r.phone || '').trim(),
          brand: String(r.brand || '').trim(),
          cycleModel: String(r.cycleModel || 'Unspecified').trim(),
          cycleSize: String(r.cycleSize || '').trim(),
          purchaseDate: parsedDate,
          purchaseDateRaw: r.purchaseDateRaw || String(r.purchaseDate || ''),
          price: Number(r.price) || 0,
          paymentMode: ['Cash', 'Online', 'UPI', 'Card'].includes(r.paymentMode)
            ? r.paymentMode
            : 'Cash',
          feedback: String(r.feedback || '').trim(),
          notes: String(r.notes || '').trim(),
        };
      });

      const inserted = await OfflineSale.insertMany(formattedRecords, { ordered: false });

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${inserted.length} offline records`,
        count: inserted.length,
      });
    }

    // Single record creation
    const {
      srNo,
      customerName,
      phone,
      brand,
      cycleModel,
      cycleSize,
      purchaseDate,
      price,
      paymentMode,
      feedback,
      notes,
    } = body;

    if (!customerName || !phone || !cycleModel) {
      return NextResponse.json(
        { success: false, message: 'Customer Name, Phone, and Cycle Model are required' },
        { status: 400 }
      );
    }

    let parsedDate = purchaseDate ? new Date(purchaseDate) : new Date();
    if (isNaN(parsedDate.getTime())) {
      parsedDate = new Date();
    }

    const newRecord = await OfflineSale.create({
      srNo: String(srNo || '').trim(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      brand: String(brand || '').trim(),
      cycleModel: cycleModel.trim(),
      cycleSize: String(cycleSize || '').trim(),
      purchaseDate: parsedDate,
      purchaseDateRaw: String(purchaseDate || ''),
      price: Number(price) || 0,
      paymentMode: ['Cash', 'Online', 'UPI', 'Card'].includes(paymentMode) ? paymentMode : 'Cash',
      feedback: String(feedback || '').trim(),
      notes: String(notes || '').trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Offline record added successfully',
      record: newRecord,
    });
  } catch (error: any) {
    console.error('Error creating offline record:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create offline record' },
      { status: 500 }
    );
  }
}
