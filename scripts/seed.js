/* eslint-disable @typescript-eslint/no-var-requires */
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
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
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

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

async function seedDatabase() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log(`Connected to database [${MONGODB_DB_NAME}]!`);

  // Clear existing collections
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({ role: 'admin' }),
    Banner.deleteMany({}),
  ]);

  console.log('Cleaned old records.');

  // 1. Seed Admin Account
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sriramacycles.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await User.create({
    name: 'Srirama Admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    phone: '+91 98765 43210',
    isActive: true,
  });
  console.log('Created Admin:', admin.email);

  // 2. Seed Categories
  const categoriesData = [
    {
      name: 'Road Bikes',
      slug: 'road-bikes',
      description: 'Aerodynamic speed machines with ultra-light carbon & alloy frames for pure asphalt performance.',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
      icon: 'Bike',
      order: 1,
    },
    {
      name: 'Mountain Bikes',
      slug: 'mountain-bikes',
      description: 'Heavy-duty suspension, rugged grip tires, and hydraulic discs engineered to conquer trails.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
      icon: 'Mountain',
      order: 2,
    },
    {
      name: 'Hybrid & City Bikes',
      slug: 'hybrid-city-bikes',
      description: 'Comfortable upright ergonomics and smooth rolling wheels built for modern urban commutes.',
      image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
      icon: 'Navigation',
      order: 3,
    },
    {
      name: 'Electric Bikes',
      slug: 'electric-bikes',
      description: 'Zero emission smart pedal-assist bikes with removable high-density lithium power packs.',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
      icon: 'Zap',
      order: 4,
    },
    {
      name: 'Kids & Junior Bikes',
      slug: 'kids-bikes',
      description: 'Safe, lightweight, ergonomic bicycles designed for young riders with durable safety training wheels.',
      image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
      icon: 'Smile',
      order: 5,
    },
    {
      name: 'Cycling Accessories & Gear',
      slug: 'cycling-accessories',
      description: 'Aerodynamic helmets, high-lumen safety LED lights, pro repair pumps, water cages, and gloves.',
      image: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&q=80',
      icon: 'Shield',
      order: 6,
    },
  ];

  const createdCategories = await Category.insertMany(categoriesData);
  const catMap = {};
  createdCategories.forEach((c) => {
    catMap[c.slug] = c;
  });
  console.log(`Created ${createdCategories.length} categories.`);

  // 3. Seed Products
  const productsData = [
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
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1000&q=80',
      ],
      shortDescription:
        'Toray T800 full carbon monocoque aero frame, Shimano 105 R7000 22-Speed drivetrain, and integrated cable routing.',
      description:
        'Engineered for sheer velocity and endurance. The Srirama Apex Aero brings wind-tunnel tested aerodynamics into every road ride. Equipped with Shimano 105 dual control shifters, aerodynamic carbon wheelset, and responsive dual pivot calliper brakes for blistering speeds on open highways.',
      specifications: [
        { key: 'Frame', value: 'Toray T800 High Modulus Carbon Fiber Aero' },
        { key: 'Fork', value: 'Full Carbon with Tapered Steerer' },
        { key: 'Drivetrain', value: 'Shimano 105 R7000 2x11 Speed' },
        { key: 'Brakes', value: 'Shimano 105 Dual-Pivot Callipers' },
        { key: 'Tires', value: 'Continental Ultra Sport III 700x25C' },
        { key: 'Weight', value: '8.4 kg' },
      ],
      variants: [
        { size: '52 cm (S)', stock: 4 },
        { size: '54 cm (M)', stock: 5 },
        { size: '56 cm (L)', stock: 3 },
      ],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      ratings: 4.9,
      numReviews: 42,
      tags: ['road bike', 'carbon', 'shimano 105', 'aero', 'race'],
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
      images: [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&q=80',
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1000&q=80',
      ],
      shortDescription:
        'Hydroformed 6061-T6 alloy frame with RockShox 120mm air lockout suspension and Shimano Deore 1x12 speed.',
      description:
        'Tackle rough descents, rock gardens, and steep switchbacks effortlessly. The Terra Pro 29er features progressive trail geometry, Shimano hydraulic disc brakes with 180mm rotors for immense stopping power, and Maxxis Ardent high-traction knobby tires.',
      specifications: [
        { key: 'Frame', value: 'Hydroformed 6061 Double-Butted Aluminum' },
        { key: 'Front Fork', value: 'Air Suspension 120mm Travel with Hydraulic Lockout' },
        { key: 'Rear Shock', value: 'Air Dampened 45mm Stroke' },
        { key: 'Gears', value: 'Shimano Deore M6100 1x12 Speed' },
        { key: 'Brakes', value: 'Shimano MT200 Hydraulic Disc' },
        { key: 'Tires', value: 'Maxxis Ardent 29x2.25 Tubeless Ready' },
        { key: 'Weight', value: '13.2 kg' },
      ],
      variants: [
        { size: 'Medium (17")', stock: 4 },
        { size: 'Large (19")', stock: 4 },
      ],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      ratings: 4.8,
      numReviews: 29,
      tags: ['mtb', 'mountain bike', 'suspension', 'hydraulic', '29er'],
    },
    {
      name: 'Srirama Volt-X Smart Electric Hybrid Bike',
      slug: 'srirama-volt-x-smart-electric-hybrid-bike',
      brand: 'Srirama E-Motion',
      category: catMap['electric-bikes']._id,
      categorySlug: 'electric-bikes',
      categoryName: 'Electric Bikes',
      price: 49999,
      salePrice: 42999,
      stock: 15,
      sku: 'SRC-EB-003',
      images: [
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1000&q=80',
        'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1000&q=80',
      ],
      shortDescription:
        '250W High-Torque BLDC Hub Motor with detachable 36V 10.4Ah Samsung Lithium battery providing 60km pedal assist range.',
      description:
        'The ultimate daily city commuter. Srirama Volt-X delivers effortless pedalling with 5 levels of smart assist, clear backlit LCD display with USB phone charging port, integrated front LED headlight, and rear safety brake light.',
      specifications: [
        { key: 'Motor', value: '250W High Efficiency Brushless Hub Motor (32Nm Torque)' },
        { key: 'Battery', value: '36V 10.4Ah Detachable Samsung Cell Li-ion' },
        { key: 'Range', value: '45-65 km on Pedal Assist (35 km Pure Throttle)' },
        { key: 'Top Speed', value: '25 km/h (Govt. Compliant Non-RTO)' },
        { key: 'Charging Time', value: '3.5 - 4 Hours Fast Charger' },
        { key: 'Gears', value: 'Shimano Tourney 7-Speed with Thumb Shifter' },
      ],
      variants: [
        { size: 'Standard (Unisex)', stock: 15 },
      ],
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      ratings: 4.9,
      numReviews: 18,
      tags: ['electric', 'ebike', 'commuter', 'hybrid', 'smart'],
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
      stock: 20,
      sku: 'SRC-HY-004',
      images: [
        'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1000&q=80',
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1000&q=80',
      ],
      shortDescription:
        'Ultra-light 6061 alloy commuter with Shimano Altus 21-speed gears, ergonomic memory foam saddle, and dual mechanical disc brakes.',
      description:
        'Designed for navigating bustling Indian city streets with ease. Equipped with puncture-resistant 700x35C tires, front basket mount readiness, lightweight fenders, and an adjustable stem for custom upright posture.',
      specifications: [
        { key: 'Frame', value: 'Lightweight 6061 Alloy with Internal Cable Routing' },
        { key: 'Shifters', value: 'Shimano EF500 3x7 Speed EZ Fire' },
        { key: 'Derailleur', value: 'Shimano Altus M310' },
        { key: 'Brakes', value: 'JAK-7 Dual Mechanical Disc 160mm' },
        { key: 'Wheels', value: 'Double Wall Alloy Rims 700C' },
        { key: 'Weight', value: '11.8 kg' },
      ],
      variants: [
        { size: '18" Frame', stock: 12 },
        { size: '20" Frame', stock: 8 },
      ],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      ratings: 4.7,
      numReviews: 35,
      tags: ['hybrid', 'city', 'commute', 'shimano', 'comfort'],
    },
    {
      name: 'Srirama Blaze Junior 20" Kids MTB',
      slug: 'srirama-blaze-junior-20-kids-mtb',
      brand: 'Srirama Junior',
      category: catMap['kids-bikes']._id,
      categorySlug: 'kids-bikes',
      categoryName: 'Kids & Junior Bikes',
      price: 13999,
      salePrice: 10999,
      stock: 14,
      sku: 'SRC-KD-005',
      images: [
        'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1000&q=80',
      ],
      shortDescription:
        'Durable hi-tensile steel frame with front suspension, Shimano 6-speed revoshift, and easy-reach child brake levers.',
      description:
        'The perfect ride for adventurous kids aged 6 to 10 years. Features low standover height, non-toxic vibrant paint, protective chain guard, and knobby tires for park and sidewalk fun.',
      specifications: [
        { key: 'Frame', value: 'Hi-Tensile Steel with Low Standover' },
        { key: 'Suspension', value: 'Coil Spring 50mm Travel' },
        { key: 'Gears', value: 'Shimano Revoshift 6-Speed' },
        { key: 'Brakes', value: 'Front & Rear V-Brakes with Alloy Levers' },
        { key: 'Tires', value: 'Wanda 20x2.125"' },
      ],
      variants: [
        { size: '20" Wheel (Ages 6-10)', stock: 14 },
      ],
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      ratings: 4.8,
      numReviews: 12,
      tags: ['kids', 'junior', 'children', '20 inch'],
    },
    {
      name: 'Srirama AeroShield Pro Cycling Helmet',
      slug: 'srirama-aeroshield-pro-cycling-helmet',
      brand: 'Srirama Gear',
      category: catMap['cycling-accessories']._id,
      categorySlug: 'cycling-accessories',
      categoryName: 'Cycling Accessories & Gear',
      price: 3499,
      salePrice: 2499,
      stock: 45,
      sku: 'SRC-ACC-006',
      images: [
        'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1000&q=80',
      ],
      shortDescription:
        'In-mold EPS foam with polycarbonate shell, magnetic detachable eye visor, 22 air vents, and rear USB rechargeable safety LED.',
      description:
        'Maximum safety meets aerodynamic airflow. CE & CPSC certified protection with dial-fit adjustment system accommodating 56-62cm head circumferences.',
      specifications: [
        { key: 'Material', value: 'High-Density EPS + Polycarbonate In-Mold' },
        { key: 'Ventilation', value: '22 Aerodynamic Wind Tunnel Vents' },
        { key: 'Safety Light', value: '3-Mode Rechargeable Rear LED' },
        { key: 'Weight', value: '260 grams' },
      ],
      variants: [
        { size: 'Medium / Large (56-62cm)', stock: 45 },
      ],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      ratings: 4.9,
      numReviews: 64,
      tags: ['helmet', 'safety', 'gear', 'accessories'],
    },
    {
      name: 'Srirama High-Lumen 1200LM Waterproof Bike Headlight Set',
      slug: 'srirama-high-lumen-1200lm-waterproof-bike-headlight-set',
      brand: 'Srirama Gear',
      category: catMap['cycling-accessories']._id,
      categorySlug: 'cycling-accessories',
      categoryName: 'Cycling Accessories & Gear',
      price: 2199,
      salePrice: 1599,
      stock: 30,
      sku: 'SRC-ACC-007',
      images: [
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1000&q=80',
      ],
      shortDescription:
        'Aircraft grade aluminum 1200 lumens dual LED front light + smart auto brake sensing tail light with 4000mAh powerbank function.',
      description:
        'Illuminate your night rides with total confidence. IPX6 waterproof rating, 5 lighting modes, fast USB-C rechargeable port, and tool-free silicone handlebar quick release mount.',
      specifications: [
        { key: 'Brightness', value: '1200 Lumens Max' },
        { key: 'Battery', value: '4000mAh Lithium Rechargeable' },
        { key: 'Waterproof', value: 'IPX6 Submersion Proof' },
        { key: 'Runtime', value: '4 to 12 Hours depending on mode' },
      ],
      variants: [{ size: 'Universal Mount', stock: 30 }],
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      ratings: 4.8,
      numReviews: 53,
      tags: ['lights', 'led', 'headlight', 'night ride'],
    },
    {
      name: 'Srirama Carbon Cage Floor Pump with Precision Gauge',
      slug: 'srirama-carbon-cage-floor-pump-with-precision-gauge',
      brand: 'Srirama Gear',
      category: catMap['cycling-accessories']._id,
      categorySlug: 'cycling-accessories',
      categoryName: 'Cycling Accessories & Gear',
      price: 1899,
      salePrice: 1299,
      stock: 25,
      sku: 'SRC-ACC-008',
      images: [
        'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1000&q=80',
      ],
      shortDescription:
        'Heavy-duty steel barrel with 160 PSI / 11 BAR top-mount precision pressure gauge and smart Presta & Schrader auto-switch valve.',
      description:
        'Inflate tires effortlessly. Features extra-wide ergonomic handle, stable cast-iron base, and ball/inflatable adaptor needles included.',
      specifications: [
        { key: 'Max Pressure', value: '160 PSI / 11 BAR' },
        { key: 'Valve Compatibility', value: 'Presta, Schrader & Dunlop' },
        { key: 'Hose Length', value: '100 cm heavy duty rubber' },
      ],
      variants: [{ size: 'Standard', stock: 25 }],
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      ratings: 4.7,
      numReviews: 22,
      tags: ['pump', 'gauge', 'inflator', 'accessories'],
    },
  ];

  const createdProducts = await Product.insertMany(productsData);
  console.log(`Created ${createdProducts.length} products.`);

  // 4. Seed Banners
  const bannersData = [
    {
      title: 'Ride Beyond Limits with Srirama Performance Cycles',
      subtitle:
        'Engineered with aerodynamic precision, carbon composite frames, and championship-tier Shimano gearing.',
      tag: '2026 Pro Series Launch',
      image:
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1800&q=85',
      ctaText: 'Explore Bikes',
      ctaLink: '/shop',
      position: 'hero',
      order: 1,
      isActive: true,
    },
    {
      title: 'Conquer Mountain Trails & Rough Terrains',
      subtitle:
        'Full-suspension, hydraulic disc brakes, and rugged all-terrain geometry built for untamed adventures.',
      tag: 'Trail Dominance',
      image:
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1800&q=85',
      ctaText: 'Shop Mountain Bikes',
      ctaLink: '/shop?category=mountain-bikes',
      position: 'hero',
      order: 2,
      isActive: true,
    },
    {
      title: 'Zero Emission Urban Commutes with Srirama E-Bikes',
      subtitle:
        'High-torque electric motors, intelligent pedal-assist, and fast-charging 60km lithium batteries.',
      tag: 'Next-Gen Mobility',
      image:
        'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1800&q=85',
      ctaText: 'Discover E-Bikes',
      ctaLink: '/shop?category=electric-bikes',
      position: 'hero',
      order: 3,
      isActive: true,
    },
  ];

  await Banner.insertMany(bannersData);
  console.log('Created banners.');

  console.log('\n========================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('Admin Login: admin@sriramacycles.com');
  console.log('Admin Password: Admin@123456');
  console.log('========================================\n');

  await mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});
