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
  { params }: { params: { slug: string[] } }
) {
  try {
    const slugArray = params.slug || [];
    const filename = slugArray.join('/');

    if (!filename) {
      return new NextResponse('Not found', { status: 404 });
    }

    // 1. Try local disk first (for files present in public/uploads)
    try {
      const localFilePath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (existsSync(localFilePath)) {
        const fileBuffer = await readFile(localFilePath);
        const ext = path.extname(filename).toLowerCase();
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
      // Ignore local disk error
    }

    // 2. Try MongoDB Atlas Media collection if filename matches or contains an ObjectId
    const cleanId = filename.split('.')[0];
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
      } catch {
        // Ignore DB error
      }
    }

    // 3. Fallback: Return placeholder bike image rather than a broken 404 image
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
    console.error('Legacy uploads route error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

