import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Please provide email address' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return success for security to avoid email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
      });
    }

    // In production, send email with reset token.
    return NextResponse.json({
      success: true,
      message: 'Password reset link has been dispatched to your email address.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error processing request' },
      { status: 500 }
    );
  }
}
