/* eslint-disable */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const fs = require('fs');
const path = require('path');

// Manually parse .env if present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim();
      }
    }
  });
}

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  dns.setDefaultResultOrder?.('ipv4first');
} catch {
  // Ignore
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sriramacycles';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'sriramacycles';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    icon: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SpecificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const VariantSchema = new mongoose.Schema({
  size: String,
  color: String,
  sku: String,
  stock: Number,
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, default: 'Srirama Cycles' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    categorySlug: String,
    categoryName: String,
    price: { type: Number, required: true },
    salePrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true },
    images: [String],
    shortDescription: String,
    description: String,
    specifications: [SpecificationSchema],
    variants: [VariantSchema],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    tag: String,
    image: { type: String, required: true },
    ctaText: String,
    ctaLink: String,
    position: { type: String, default: 'hero' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: String,
    addresses: Array,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function syncAll() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log(`Connected to database [${MONGODB_DB_NAME}]!`);

  // Clear categories and products to re-seed cleanly
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Banner.deleteMany({}),
  ]);

  console.log('Cleaned old records for fresh sync.');

  // 1. Ensure Admin exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sriramacycles.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: 'Srirama Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      isActive: true,
    },
    { upsert: true, new: true }
  );
  console.log('Admin account ensured.');

  // 2. All Categories (Matching user site & admin management)
  const categoriesData = [
    {
      name: 'Road Cycles',
      slug: 'road-bikes',
      description: 'Aerodynamic speed machines with ultra-light carbon & alloy frames for pure asphalt performance.',
      image: '/images/categories/road-bikes.jpg',
      icon: 'Bike',
      order: 1,
    },
    {
      name: 'Mountain Cycles',
      slug: 'mountain-bikes',
      description: 'Heavy-duty suspension, rugged grip tires, and hydraulic discs engineered to conquer trails.',
      image: '/images/categories/mountain-bikes.jpg',
      icon: 'Mountain',
      order: 2,
    },
    {
      name: 'Ladies Cycles',
      slug: 'ladies-bicycles',
      description: 'Ergonomic step-through frames, comfortable posture, and stylish city basket designs.',
      image: '/images/categories/ladies-bicycles.jpg',
      icon: 'Heart',
      order: 3,
    },
    {
      name: 'Disc Brake Cycles',
      slug: 'disc-brake-cycles',
      description: 'Precision mechanical & hydraulic disc braking systems for all-weather stopping power.',
      image: '/images/categories/disc-brake-cycles.jpg',
      icon: 'Disc',
      order: 4,
    },
    {
      name: 'Standard Cycles',
      slug: 'standard-cycles',
      description: 'Heavy-duty classic single-speed & multi-speed utility cycles built for lifetime durability.',
      image: '/images/categories/standard-cycles.jpg',
      icon: 'Compass',
      order: 5,
    },
    {
      name: 'Junior Cycles',
      slug: 'junior-bikes',
      description: 'Lightweight, ergonomic 20" to 24" bicycles designed for growing youths.',
      image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
      icon: 'Smile',
      order: 6,
    },
    {
      name: 'Kids Cycles',
      slug: 'kids-bikes',
      description: 'Safe, durable starter cycles with training wheels for young children.',
      image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
      icon: 'Sparkles',
      order: 7,
    },
    {
      name: 'All Spare Items Available',
      slug: 'cycling-accessories',
      description: '100% genuine auto spare parts, cycling helmets, lights, and tools.',
      image: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&q=80',
      icon: 'Shield',
      order: 8,
    },
    {
      name: 'City & Hybrid Cycles',
      slug: 'hybrid-city-bikes',
      description: 'Comfortable upright ergonomics and smooth rolling wheels built for modern urban commutes.',
      image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
      icon: 'Navigation',
      order: 9,
    },
  ];

  const createdCategories = await Category.insertMany(categoriesData);
  const catMap = {};
  createdCategories.forEach((c) => {
    catMap[c.slug] = c;
  });
  console.log(`Created ${createdCategories.length} categories in DB.`);

  // 3. Products
  const productsData = [
    {
      name: 'Gang Linear - IBC Non Suspension Cycle',
      slug: 'gang-linear-ibc-non-suspension-cycle',
      brand: 'Gang',
      category: catMap['standard-cycles']._id,
      categorySlug: 'standard-cycles',
      categoryName: 'Standard Cycles',
      price: 6500,
      salePrice: 5525,
      stock: 24,
      sku: 'GANG-LIN-IBC-01',
      images: [
        '/images/products/gang-linear-ibc-main.png',
        '/images/products/gang-linear-ibc-brochure.png',
        '/images/products/gang-linear-ibc-yellow.png',
        '/images/products/gang-linear-ibc-black-yellow.png',
      ],
      shortDescription:
        'Available in 24*2.40 & 26*2.40 tyre sizes. MIG-welded IBC frame, caliper brakes, MTB PU saddle, PVC bottle cage, and dual-tone fenders.',
      description:
        'The Gang Linear - IBC is engineered for rugged daily commutes and all-terrain versatility with zero maintenance hassle. Featuring a uniquely designed MIG-welded IBC frame (18.5x26 and 17x24) with a 44.45mm head tube, heavy-duty 3.50mm caliper brakes, and wide 2.40" cotton/moulded tube tyres. Complete with a threaded rigid fork with butted column, colored MTB PU saddle with ED black clamp, soft rubber grips, dual-tone mudguards, luggage carrier, and complimentary PVC bottle cage.',
      specifications: [
        { key: 'Brand', value: 'Gang (SK Bikes)' },
        { key: 'Model', value: 'Linear - IBC (Non Suspension CB)' },
        { key: 'Wheel Sizes', value: '24 x 2.40" & 26 x 2.40"' },
        { key: 'Frame', value: '18.5x26 & 17x24 MIG Welded IBC Frame with 44.45mm Head Tube' },
        { key: 'Fork', value: 'Threaded Rigid Fork with Butted Column & 28.58mm Legs' },
        { key: 'Brakes', value: 'Heavy Duty Caliper Brakes (Caliper Thickness 3.50mm)' },
        { key: 'Tyres', value: '24x2.40 & 26x2.40 Cotton/Moulded Tube Wide Grip Tyres' },
        { key: 'Saddle', value: 'MTB PU Saddle (Colored) with ED Black Clamp' },
        { key: 'Mudguards', value: 'Uniquely Designed Dual Tone Plastic Fenders' },
        { key: 'Handlebar', value: '22.20mm / 585mm Black Steel Handlebar' },
        { key: 'Handle Grip', value: 'Soft Rubber Black Grips' },
        { key: 'Bottle Cage', value: 'PVC Bottle Cage Included' },
        { key: 'Available Colors', value: 'Lemon Green & Blue, Gloss Black & Yellow, Yellow & Orange' },
        { key: 'Warranty', value: '1 Year Frame Warranty by Sri Rama Cycles' },
      ],
      variants: [
        { size: '24 x 2.40 (17" Frame)', color: 'Lemon Green & Blue', sku: 'GANG-LIN-24-GB', stock: 6 },
        { size: '24 x 2.40 (17" Frame)', color: 'Gloss Black & Yellow', sku: 'GANG-LIN-24-BY', stock: 6 },
        { size: '24 x 2.40 (17" Frame)', color: 'Yellow & Orange', sku: 'GANG-LIN-24-YO', stock: 4 },
        { size: '26 x 2.40 (18.5" Frame)', color: 'Lemon Green & Blue', sku: 'GANG-LIN-26-GB', stock: 8 },
        { size: '26 x 2.40 (18.5" Frame)', color: 'Gloss Black & Yellow', sku: 'GANG-LIN-26-BY', stock: 8 },
        { size: '26 x 2.40 (18.5" Frame)', color: 'Yellow & Orange', sku: 'GANG-LIN-26-YO', stock: 6 },
      ],
      isFeatured: true,
      isBestSeller: true,
      ratings: 4.9,
      numReviews: 19,
      tags: ['gang', 'linear', 'ibc', '24 inch', '26 inch', 'non suspension', 'caliper brake', 'rigid', 'city mtb'],
      isActive: true,
    },
    {
      name: 'Gang Twenty Four - Front Suspension VB Cycle',
      slug: 'gang-twenty-four-front-suspension-vb-cycle',
      brand: 'Gang',
      category: catMap['standard-cycles']._id,
      categorySlug: 'standard-cycles',
      categoryName: 'Standard Cycles',
      price: 6500,
      salePrice: 5525,
      stock: 20,
      sku: 'GANG-TF-FS-24',
      images: [
        '/images/products/gang-twenty-four-main.png',
        '/images/products/gang-twenty-four-brochure.png',
      ],
      shortDescription:
        'Available in 24" & 26" tyre sizes with 15% discount. Features front suspension fork, friction-free V-brakes, 13x24 MIG-welded frame, and luggage carrier.',
      description:
        'The Gang Twenty Four is built with front suspension and responsive friction-free V-brakes for effortless riding on city roads and rough terrain. Engineered with a uniquely designed 13x24 MIG-welded frame, 44.45mm head tube, 24x2.40 & 26x2.40 wide-profile tyres, soft rubber grips, and an ergonomic colored MTB PU saddle. Comes complete with rear carrier, dual-tone fenders, and a complimentary food-grade PVC bottle & cage.',
      specifications: [
        { key: 'Brand', value: 'Gang (SK Bikes)' },
        { key: 'Model', value: 'Twenty Four & Twenty Six (Front Suspension VB)' },
        { key: 'Wheel Sizes', value: '24 x 2.40" & 26 x 2.40"' },
        { key: 'Frame', value: '13x24 Uniquely Designed MIG Welded Frame with 44.45mm Head Tube' },
        { key: 'Fork', value: 'Threaded Front Suspension Fork' },
        { key: 'Brakes', value: 'Friction Free Black V-Brakes' },
        { key: 'Tyres', value: '24x2.40 & 26x2.40 Cotton / Moulded Tube' },
        { key: 'Saddle', value: 'MTB PU Saddle (Colored) with ED Black Clamp' },
        { key: 'Handlebar', value: '25.40mm / 625mm / BPC Handlebar' },
        { key: 'Handle Grip', value: 'Soft Rubber Black Grips' },
        { key: 'Mudguard', value: 'Uniquely Designed Dual Tone Plastic Fender' },
        { key: 'Bottle Cage', value: 'PVC Bottle Cage with Food Grade Plastic Bottle' },
        { key: 'Carrier', value: 'Rear Luggage Carrier with Red Reflector' },
        { key: 'Warranty', value: '1 Year Frame Warranty by Sri Rama Cycles' },
      ],
      variants: [
        { size: '24 x 2.40 (13" Frame)', color: 'Cyan Blue & Black', sku: 'GANG-TF-24-CB', stock: 10 },
        { size: '26 x 2.40 (15" Frame)', color: 'Cyan Blue & Black', sku: 'GANG-TF-26-CB', stock: 10 },
      ],
      isFeatured: true,
      isBestSeller: true,
      ratings: 4.9,
      numReviews: 14,
      tags: ['gang', 'twenty four', 'front suspension', 'v-brake', '24 inch', '26 inch', 'cyan blue', 'standard cycle'],
      isActive: true,
    },
    {
      name: 'Srirama Apex Carbon Aero Road Bike',
      slug: 'srirama-apex-carbon-aero-road-bike',
      brand: 'Srirama Pro',
      category: catMap['road-bikes']._id,
      categorySlug: 'road-bikes',
      categoryName: 'Road Bikes',
      price: 68999,
      salePrice: 58999,
      stock: 12,
      sku: 'SRC-RD-001',
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1000&q=80',
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1000&q=80',
      ],
      shortDescription:
        'Toray T800 full carbon monocoque aero frame, Shimano 105 R7000 22-Speed drivetrain.',
      description:
        'Engineered for sheer velocity and endurance. Equipped with Shimano 105 dual control shifters, aerodynamic carbon wheelset, and responsive dual pivot calliper brakes.',
      specifications: [
        { key: 'Frame', value: 'Toray T800 High Modulus Carbon Fiber Aero' },
        { key: 'Fork', value: 'Full Carbon with Tapered Steerer' },
        { key: 'Drivetrain', value: 'Shimano 105 R7000 2x11 Speed' },
        { key: 'Brakes', value: 'Shimano 105 Dual-Pivot Callipers' },
        { key: 'Weight', value: '8.4 kg' },
      ],
      variants: [
        { size: '52 cm (S)', stock: 4 },
        { size: '54 cm (M)', stock: 5 },
        { size: '56 cm (L)', stock: 3 },
      ],
      isFeatured: true,
      isBestSeller: true,
      ratings: 4.9,
      numReviews: 42,
      tags: ['road bike', 'carbon', 'shimano 105', 'aero'],
    },
    {
      name: 'Srirama Terra Pro 29" Full Suspension MTB',
      slug: 'srirama-terra-pro-29-full-suspension-mtb',
      brand: 'Srirama Trail',
      category: catMap['mountain-bikes']._id,
      categorySlug: 'mountain-bikes',
      categoryName: 'Mountain Bikes',
      price: 54999,
      salePrice: 47999,
      stock: 8,
      sku: 'SRC-MTB-002',
      images: ['/images/categories/mountain-bikes.jpg'],
      shortDescription:
        'Hydroformed 6061-T6 alloy frame with RockShox 120mm air lockout suspension and Shimano Deore 1x12 speed.',
      description:
        'Tackle rough descents and steep switchbacks effortlessly. Features progressive trail geometry and Shimano hydraulic disc brakes.',
      specifications: [
        { key: 'Frame', value: 'Hydroformed 6061 Double-Butted Aluminum' },
        { key: 'Front Fork', value: 'Air Suspension 120mm Travel with Lockout' },
        { key: 'Gears', value: 'Shimano Deore M6100 1x12 Speed' },
        { key: 'Brakes', value: 'Shimano MT200 Hydraulic Disc' },
        { key: 'Weight', value: '13.2 kg' },
      ],
      variants: [
        { size: 'Medium (17")', stock: 4 },
        { size: 'Large (19")', stock: 4 },
      ],
      isFeatured: true,
      isBestSeller: true,
      ratings: 4.8,
      numReviews: 29,
      tags: ['mtb', 'mountain bike', 'suspension', 'hydraulic'],
    },
    {
      name: 'Srirama Elegance 26" Ladies City Comfort Bicycle',
      slug: 'srirama-elegance-26-ladies-city-comfort-bicycle',
      brand: 'Srirama Ladies',
      category: catMap['ladies-bicycles']._id,
      categorySlug: 'ladies-bicycles',
      categoryName: 'Ladies Cycle',
      price: 18999,
      salePrice: 14999,
      stock: 15,
      sku: 'SRC-LD-003',
      images: [
        'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1000&q=80',
        '/images/categories/ladies-bicycles.jpg',
      ],
      shortDescription:
        'Low step-through alloy frame, cushioned spring saddle, front wicker basket, and Shimano 7-speed gearing.',
      description:
        'Designed specifically for women riders seeking comfort, elegance, and effortless city commuting. Features upright handlebars and dress guard.',
      specifications: [
        { key: 'Frame', value: 'Step-Through Aluminum Alloy 6061' },
        { key: 'Gears', value: 'Shimano Tourney 7-Speed' },
        { key: 'Basket', value: 'Front Mounted Heavy-Duty Basket Included' },
        { key: 'Brakes', value: 'Power Alloy V-Brakes' },
      ],
      variants: [{ size: '26" Wheel (Standard)', stock: 15 }],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      ratings: 4.9,
      numReviews: 28,
      tags: ['ladies', 'women', 'basket', 'comfort'],
    },
    {
      name: 'Srirama Phantom Pro 27.5" Dual Disc Brake Cycle',
      slug: 'srirama-phantom-pro-275-dual-disc-brake-cycle',
      brand: 'Srirama Pro',
      category: catMap['disc-brake-cycles']._id,
      categorySlug: 'disc-brake-cycles',
      categoryName: 'Disc Brake Cycles',
      price: 26999,
      salePrice: 21999,
      stock: 20,
      sku: 'SRC-DB-004',
      images: [
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1000&q=80',
        '/images/categories/disc-brake-cycles.jpg',
      ],
      shortDescription:
        'Precision dual hydraulic disc brakes (160mm rotors), 21-speed EZ-Fire shifters, and zoom front suspension fork.',
      description:
        'Built for maximum stopping safety on wet or dry roads. Features high-tensile alloy frame and double-wall alloy rims.',
      specifications: [
        { key: 'Frame', value: 'Lightweight 6061 Double-Butted Alloy' },
        { key: 'Brakes', value: 'Logan Hydraulic Dual Disc (160mm Rotors)' },
        { key: 'Shifters', value: 'Shimano EF500 21-Speed' },
      ],
      variants: [
        { size: '18" Frame', stock: 12 },
        { size: '20" Frame', stock: 8 },
      ],
      isFeatured: true,
      isBestSeller: true,
      ratings: 4.8,
      numReviews: 39,
      tags: ['disc brake', 'hydraulic', '21 speed', 'safety'],
    },
    {
      name: 'Srirama Heavy-Duty Classic 28" Standard Roadster Cycle',
      slug: 'srirama-heavy-duty-classic-28-standard-roadster-cycle',
      brand: 'Srirama Classic',
      category: catMap['standard-cycles']._id,
      categorySlug: 'standard-cycles',
      categoryName: 'Standard Cycles',
      price: 9999,
      salePrice: 7999,
      stock: 25,
      sku: 'SRC-STD-008',
      images: [
        '/images/categories/standard-cycles.jpg',
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1000&q=80',
      ],
      shortDescription:
        'Heavy-gauge tubular steel frame, full chain cover, heavy rear carrier, and traditional rod brakes.',
      description:
        'The legendary Indian roadster built for utility and ultimate durability. Engineered with reinforced steel, wide leather sprung saddle, and heavy luggage carrier.',
      specifications: [
        { key: 'Frame', value: 'Heavy Duty Reinforced Tubular Steel' },
        { key: 'Brakes', value: 'Traditional Steel Rod Brakes' },
        { key: 'Rims', value: '28 x 1-1/2 Heavy Duty Steel Rims' },
      ],
      variants: [{ size: '28" Frame (Standard)', stock: 25 }],
      isFeatured: true,
      isBestSeller: true,
      ratings: 4.9,
      numReviews: 87,
      tags: ['standard', 'roadster', 'utility', 'heavy duty'],
    },
    {
      name: 'Srirama Blaze Junior 24" Youth Geared Bike',
      slug: 'srirama-blaze-junior-24-youth-geared-bike',
      brand: 'Srirama Junior',
      category: catMap['junior-bikes']._id,
      categorySlug: 'junior-bikes',
      categoryName: 'Junior Bikes',
      price: 14999,
      salePrice: 11999,
      stock: 14,
      sku: 'SRC-KD-005',
      images: ['https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1000&q=80'],
      shortDescription:
        'Durable hi-tensile steel frame with front suspension, Shimano 6-speed revoshift, and easy-reach child brake levers.',
      description:
        'The perfect ride for adventurous kids and youths aged 8 to 14 years. Features low standover height and safety chain guard.',
      specifications: [
        { key: 'Frame', value: 'Hi-Tensile Steel with Low Standover' },
        { key: 'Suspension', value: 'Coil Spring 50mm Travel' },
        { key: 'Gears', value: 'Shimano Revoshift 6-Speed' },
      ],
      variants: [{ size: '24" Wheel (Youth)', stock: 14 }],
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      ratings: 4.8,
      numReviews: 18,
      tags: ['junior', 'youth', 'kids'],
    },
    {
      name: 'Srirama Starlet 16" Kids Cycle with Training Wheels',
      slug: 'srirama-starlet-16-kids-cycle-with-training-wheels',
      brand: 'Srirama Junior',
      category: catMap['kids-bikes']._id,
      categorySlug: 'kids-bikes',
      categoryName: 'Kids Cycle',
      price: 8499,
      salePrice: 6499,
      stock: 16,
      sku: 'SRC-KD-006',
      images: ['https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1000&q=80'],
      shortDescription:
        'High-strength steel frame with detachable heavy-duty training wheels, full chain cover, and bell.',
      description:
        'Built for young learners aged 3 to 7 years. Ensures maximum stability, fun colors, and gentle training wheel support.',
      specifications: [
        { key: 'Wheel Size', value: '16 Inch' },
        { key: 'Training Wheels', value: 'Heavy Duty Detachable Included' },
      ],
      variants: [{ size: '16" Wheel (Ages 3-7)', stock: 16 }],
      isFeatured: false,
      isBestSeller: false,
      ratings: 4.8,
      numReviews: 12,
      tags: ['kids', 'training wheels', 'children'],
    },
    {
      name: 'Srirama Original Auto Spare Parts & Pro Toolkit Kit',
      slug: 'srirama-original-auto-spare-parts-pro-toolkit-kit',
      brand: 'Sri Rama Genuine Spares',
      category: catMap['cycling-accessories']._id,
      categorySlug: 'cycling-accessories',
      categoryName: 'All Spare Items Available',
      price: 3499,
      salePrice: 2499,
      stock: 50,
      sku: 'SRC-SPARE-001',
      images: ['https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1000&q=80'],
      shortDescription:
        '100% genuine auto parts, precision metric multitool, spare chain links, cables, and tire lever kit.',
      description:
        'Official Kazipet flagship spare parts package. Sourced directly from certified manufacturers for maximum longevity and roadside emergency tuning.',
      specifications: [
        { key: 'Compatibility', value: 'Standard Cycles, MTBs, and Auto Spares' },
        { key: 'Included', value: '16-in-1 Hex Tool, Chain Breaker, Brake Cables' },
      ],
      variants: [{ size: 'Complete Kit', stock: 50 }],
      isFeatured: true,
      isBestSeller: true,
      ratings: 5.0,
      numReviews: 64,
      tags: ['spare parts', 'auto spares', 'tools', 'genuine'],
    },
    {
      name: 'Srirama Urban Glide City Commuter 700C',
      slug: 'srirama-urban-glide-city-commuter-700c',
      brand: 'Srirama City',
      category: catMap['hybrid-city-bikes']._id,
      categorySlug: 'hybrid-city-bikes',
      categoryName: 'Hybrid & City Bikes',
      price: 24999,
      salePrice: 19999,
      stock: 10,
      sku: 'SRC-HYB-001',
      images: ['https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1000&q=80'],
      shortDescription:
        'Lightweight commuter frame with fast-rolling 700x35c tires, Shimano 21-speed, and ergonomic saddle.',
      description:
        'The ideal daily commuter between Kazipet, Hanumakonda, and Warangal. Smooth gliding on asphalt with upright ergonomic bars.',
      specifications: [
        { key: 'Frame', value: '6061 Alloy Commuter Geometry' },
        { key: 'Gears', value: 'Shimano Tourney 3x7 Speed' },
      ],
      variants: [{ size: 'Medium (18")', stock: 10 }],
      isFeatured: false,
      isBestSeller: true,
      ratings: 4.7,
      numReviews: 31,
      tags: ['hybrid', 'city bike', 'commuter'],
    },

    {
      name: 'Srirama AeroShield Pro Cycling Helmet',
      slug: 'srirama-aeroshield-pro-cycling-helmet',
      brand: 'Srirama Gear',
      category: catMap['cycling-accessories']._id,
      categorySlug: 'cycling-accessories',
      categoryName: 'All Spare Items Available',
      price: 3499,
      salePrice: 2499,
      stock: 45,
      sku: 'SRC-ACC-006',
      images: ['https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1000&q=80'],
      shortDescription:
        'In-mold EPS foam with polycarbonate shell, magnetic detachable eye visor, 22 air vents, and rear safety LED.',
      description:
        'Maximum safety meets aerodynamic airflow. CE & CPSC certified protection with dial-fit adjustment system.',
      specifications: [
        { key: 'Material', value: 'High-Density EPS + Polycarbonate In-Mold' },
        { key: 'Ventilation', value: '22 Aerodynamic Wind Tunnel Vents' },
      ],
      variants: [{ size: 'Medium / Large (56-62cm)', stock: 45 }],
      isFeatured: false,
      isBestSeller: true,
      ratings: 4.9,
      numReviews: 64,
      tags: ['helmet', 'safety', 'gear'],
    },
    {
      name: 'Srirama High-Lumen 1200LM Waterproof Bike Headlight Set',
      slug: 'srirama-high-lumen-1200lm-waterproof-bike-headlight-set',
      brand: 'Srirama Gear',
      category: catMap['cycling-accessories']._id,
      categorySlug: 'cycling-accessories',
      categoryName: 'All Spare Items Available',
      price: 2199,
      salePrice: 1599,
      stock: 30,
      sku: 'SRC-ACC-007',
      images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1000&q=80'],
      shortDescription:
        'Aircraft grade aluminum 1200 lumens dual LED front light + smart auto brake sensing tail light.',
      description:
        'Illuminate your night rides with total confidence. IPX6 waterproof rating, 5 lighting modes, fast USB-C rechargeable port.',
      specifications: [
        { key: 'Brightness', value: '1200 Lumens Max' },
        { key: 'Battery', value: '4000mAh Lithium Rechargeable' },
      ],
      variants: [{ size: 'Universal Mount', stock: 30 }],
      isFeatured: false,
      isBestSeller: true,
      ratings: 4.8,
      numReviews: 53,
      tags: ['lights', 'led', 'headlight'],
    },
  ];

  const createdProducts = await Product.insertMany(productsData);
  console.log(`Created ${createdProducts.length} products in DB.`);

  // 4. Banners
  const bannersData = [
    {
      title: 'Ride with Passion. Engineered for Pure Speed.',
      subtitle:
        'Ultra-light carbon frames, Shimano 105 gearing, and aerodynamic precision for riders who demand excellence.',
      tag: '✨ 2026 Pro Series',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=85',
      ctaText: 'Explore Bikes',
      ctaLink: '/shop?category=road-bikes',
      position: 'hero',
      order: 1,
      isActive: true,
    },
    {
      title: 'Conquer the Rough. Built for Untamed Adventures.',
      subtitle:
        'Heavy-duty RockShox suspension, hydraulic disc brakes, and rugged geometry ready for every mountain trail.',
      tag: '🏔️ Trail Dominance',
      image: '/images/categories/mountain-bikes.jpg',
      ctaText: 'Shop Mountain Bikes',
      ctaLink: '/shop?category=mountain-bikes',
      position: 'hero',
      order: 2,
      isActive: true,
    },
    {
      title: 'Zero Emission Urban Commutes. Smart Hybrid & City Mobility.',
      subtitle:
        'High-torque electric assist motors, ergonomic frames, and long-range lithium batteries for effortless riding.',
      tag: '⚡ Next-Gen Mobility',
      image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1200&q=85',
      ctaText: 'Discover Hybrid & City Bikes',
      ctaLink: '/shop?category=hybrid-city-bikes',
      position: 'hero',
      order: 3,
      isActive: true,
    },
    {
      title: 'Sri Rama Cycle & Spares. 100% Genuine Auto Parts.',
      subtitle:
        'Official store in Hanumakonda for premium bicycles, original auto spare parts, expert repair, and tuning.',
      tag: '🔧 Kazipet Flagship',
      image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1200&q=85',
      ctaText: 'Contact Store',
      ctaLink: '/contact',
      position: 'hero',
      order: 4,
      isActive: true,
    },
  ];

  const createdBanners = await Banner.insertMany(bannersData);
  console.log(`Created ${createdBanners.length} banners in DB.`);

  console.log('--- ALL DATA SYNCHRONIZED SUCCESSFULLY ---');
  await mongoose.disconnect();
}

syncAll().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
