import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import mongoose from 'mongoose';
import path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    if (!rawId) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Strip extension if present (e.g., 672f...jpg -> 672f...)
    const cleanId = rawId.split('.')[0];

    // 1. Check MongoDB Atlas if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      try {
        await connectToDatabase();
        const media = await Media.findById(cleanId).lean();

        if (media && media.data) {
          const buffer = Buffer.from(media.data, 'base64');
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': media.contentType || 'image/jpeg',
              'Content-Length': buffer.length.toString(),
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } catch (dbErr) {
        console.error('MongoDB media lookup error:', dbErr);
      }
    }

    // 2. Check local disk in public/uploads (for local dev / legacy filenames)
    try {
      const localFilePath = path.join(process.cwd(), 'public', 'uploads', rawId);
      if (existsSync(localFilePath)) {
        const fileBuffer = await readFile(localFilePath);
        const ext = path.extname(rawId).toLowerCase();
        const contentTypes: Record<string, string> = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
          '.gif': 'image/gif',
        };
        const contentType = contentTypes[ext] || 'image/jpeg';

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
    } catch {
      // Ignore local disk errors
    }

    // 3. Fallback: serve placeholder image if available
    try {
      const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder-bike.png');
      if (existsSync(placeholderPath)) {
        const buffer = await readFile(placeholderPath);
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    } catch {
      // Ignore
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (error: any) {
    console.error('Upload serving error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

