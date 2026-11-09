import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import path from 'path';
import { existsSync } from 'fs';
import { writeFile, mkdir } from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to binary buffer & base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const base64Data = buffer.toString('base64');

    // Connect to MongoDB Atlas (Cloud Database)
    await connectToDatabase();

    // Sanitize original filename
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Save image directly to MongoDB Atlas Media collection
    const media = await Media.create({
      filename: sanitizedOriginalName,
      contentType: mimeType,
      data: base64Data,
      size: buffer.length,
    });

    // Optional local cache for development (silently ignored on Vercel read-only filesystem)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      const uniqueName = `${media._id}_${sanitizedOriginalName}`;
      await writeFile(path.join(uploadsDir, uniqueName), buffer);
    } catch {
      // Intentionally ignore filesystem write errors on Vercel read-only environments
    }

    const publicUrl = `/api/uploads/${media._id}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      message: 'Image uploaded successfully to database',
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
