/**
 * Syncs all local files from public/uploads/ into MongoDB Atlas Media collection,
 * and updates any Product, Category, or Banner referencing them.
 *
 * Run with: node --env-file=.env scripts/sync-uploads-to-db.js
 */

const fs = require('fs');
const path = require('fs/promises');
const fsSync = require('fs');
const pathUtil = require('path');
const mongoose = require('mongoose');
const dns = require('dns');

// Google DNS for MongoDB Atlas SRV lookup
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'sriramacycles';

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in environment.');
  process.exit(1);
}

const MediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true, default: 'image/jpeg' },
    data: { type: String, required: true },
    size: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    images: [String],
  },
  { strict: false }
);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
  },
  { strict: false }
);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const BannerSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
  },
  { strict: false }
);
const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

async function syncUploads() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log('Connected to MongoDB Atlas successfully.\n');

  const uploadsDir = pathUtil.join(process.cwd(), 'public', 'uploads');
  if (!fsSync.existsSync(uploadsDir)) {
    console.log('No public/uploads folder found. Nothing to sync.');
    process.exit(0);
  }

  const files = fsSync.readdirSync(uploadsDir);
  console.log(`Found ${files.length} files in public/uploads/:\n`);

  let syncedCount = 0;
  let updatedProducts = 0;

  for (const fileName of files) {
    const fullPath = pathUtil.join(uploadsDir, fileName);
    const stats = fsSync.statSync(fullPath);
    if (!stats.isFile()) continue;

    const ext = pathUtil.extname(fileName).toLowerCase();
    const mimeMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
    };
    const mimeType = mimeMap[ext] || 'image/jpeg';

    const fileBuffer = fsSync.readFileSync(fullPath);
    const base64Data = fileBuffer.toString('base64');

    // Check if already in Media
    let media = await Media.findOne({ filename: fileName });
    if (!media) {
      media = await Media.create({
        filename: fileName,
        contentType: mimeType,
        data: base64Data,
        size: stats.size,
      });
      syncedCount++;
      console.log(`+ Uploaded to DB: ${fileName} -> ID: ${media._id}`);
    } else {
      console.log(`= Already in DB: ${fileName} -> ID: ${media._id}`);
    }

    const oldPath1 = `/uploads/${fileName}`;
    const oldPath2 = `uploads/${fileName}`;
    const newPath = `/api/uploads/${media._id}`;

    // Update Products
    const productsToUpdate = await Product.find({
      images: { $in: [oldPath1, oldPath2, fileName] },
    });

    for (const prod of productsToUpdate) {
      const updatedImages = prod.images.map((img) =>
        img === oldPath1 || img === oldPath2 || img === fileName ? newPath : img
      );
      await Product.updateOne({ _id: prod._id }, { $set: { images: updatedImages } });
      updatedProducts++;
      console.log(`  -> Updated Product "${prod.name}" image to cloud URL`);
    }

    // Update Categories
    await Category.updateMany(
      { image: { $in: [oldPath1, oldPath2, fileName] } },
      { $set: { image: newPath } }
    );

    // Update Banners
    await Banner.updateMany(
      { image: { $in: [oldPath1, oldPath2, fileName] } },
      { $set: { image: newPath } }
    );
  }

  console.log(`\n========================================`);
  console.log(`Sync Complete!`);
  console.log(`- New files saved to Atlas: ${syncedCount}`);
  console.log(`- Products updated to cloud URLs: ${updatedProducts}`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
}

syncUploads().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});

