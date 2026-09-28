import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import User from '@/models/User';
import Banner from '@/models/Banner';
import { hashPassword } from '@/lib/auth';

export async function GET(req: Request) {
  return handleSeed(req);
}

export async function POST(req: Request) {
  return handleSeed(req);
}

async function handleSeed(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    // Reset categories & products if force=true or to ensure updated category schema
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});

    // 1. Seed Admin
    const hashedPassword = await hashPassword('Admin@123456');
    await User.findOneAndUpdate(
      { email: 'admin@sriramacycles.com' },
      {
        name: 'Srirama Admin',
        email: 'admin@sriramacycles.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+91 98765 43210',
        isActive: true,
      },
      { upsert: true, new: true }
    );

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'Road Bikes',
        slug: 'road-bikes',
        description: 'Aerodynamic speed machines with ultra-light carbon & alloy frames.',
        image: '/images/categories/road-bikes.jpg',
        order: 1,
      },
      {
        name: 'Mountain Bikes',
        slug: 'mountain-bikes',
        description: 'Heavy-duty suspension, rugged grip tires, and hydraulic discs.',
        image: '/images/categories/mountain-bikes.jpg',
        order: 2,
      },
      {
        name: 'Ladies Cycle',
        slug: 'ladies-bicycles',
        description: 'Ergonomic step-through frames, comfortable posture, and stylish city basket designs.',
        image: '/images/categories/ladies-bicycles.jpg',
        order: 3,
      },
      {
        name: 'Disc Brake Cycles',
        slug: 'disc-brake-cycles',
        description: 'Precision mechanical & hydraulic disc braking systems for all-weather stopping power.',
        image: '/images/categories/disc-brake-cycles.jpg',
        order: 4,
      },
      {
        name: 'Standard Cycles',
        slug: 'standard-cycles',
        description: 'Heavy-duty classic single-speed & multi-speed utility cycles built for lifetime durability.',
        image: '/images/categories/standard-cycles.jpg',
        order: 5,
      },
      {
        name: 'Junior Bikes',
        slug: 'junior-bikes',
        description: 'Lightweight, ergonomic 20" to 24" bicycles designed for growing youths.',
        image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
        order: 6,
      },
      {
        name: 'Kids Cycle',
        slug: 'kids-bikes',
        description: 'Safe, durable starter cycles with training wheels for young children.',
        image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
        order: 7,
      },
      {
        name: 'All Spare Items Available',
        slug: 'cycling-accessories',
        description: '100% genuine auto spare parts, cycling helmets, lights, and tools.',
        image: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&q=80',
        order: 8,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap: Record<string, any> = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c;
    });

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
        images: [
          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&q=80',
        ],
        shortDescription:
          'Hydroformed 6061-T6 alloy frame with RockShox 120mm air lockout suspension and Shimano Deore 1x12.',
        description:
          'Tackle rough descents and steep switchbacks effortlessly. Features progressive trail geometry, Shimano hydraulic disc brakes, and Maxxis knobby tires.',
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
        categoryName: 'Ladies Bicycles',
        price: 18999,
        salePrice: 14999,
        stock: 15,
        sku: 'SRC-LD-003',
        images: [
          'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1000&q=80',
        ],
        shortDescription:
          'Low step-through alloy frame, cushioned spring saddle, front wicker basket, and Shimano 7-speed gearing.',
        description:
          'Designed specifically for women riders seeking comfort, elegance, and effortless city commuting. Features upright handlebars and dress guard.',
        specifications: [
          { key: 'Frame', value: 'Step-Through Aluminum Alloy 6061' },
          { key: 'Gears', value: 'Shimano Tourney 7-Speed' },
          { key: 'Basket', value: 'Front Mounted Heavy-Duty Basket Included' },
        ],
        variants: [{ size: '26" Wheel (Standard)', stock: 15 }],
        isFeatured: true,
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
        ],
        shortDescription:
          'Precision dual hydraulic disc brakes (160mm rotors), 21-speed EZ-Fire shifters, and zoom front suspension fork.',
        description:
          'Built for maximum stopping safety on wet or dry roads. Features high-tensile alloy frame and double-wall alloy rims.',
        specifications: [
          { key: 'Frame', value: 'Lightweight 6061 Double-Butted Alloy' },
          { key: 'Brakes', value: 'Logan Hydraulic Dual Disc (160mm Rotors)' },
          { key: 'Shifters', value: 'Shimano EF500 21-Speed' },
          { key: 'Weight', value: '13.5 kg' },
        ],
        variants: [
          { size: '18" Frame', stock: 12 },
          { size: '20" Frame', stock: 8 },
        ],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.7,
        numReviews: 35,
        tags: ['hybrid', 'city', 'commute'],
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
          'In-mold EPS foam with polycarbonate shell, magnetic detachable visor, and rear safety LED.',
        description:
          'Maximum safety meets aerodynamic airflow. CE & CPSC certified protection with dial-fit adjustment.',
        specifications: [
          { key: 'Material', value: 'High-Density EPS + Polycarbonate In-Mold' },
          { key: 'Ventilation', value: '22 Aerodynamic Vents' },
          { key: 'Weight', value: '260 grams' },
        ],
        variants: [{ size: 'Medium / Large (56-62cm)', stock: 45 }],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.9,
        numReviews: 64,
        tags: ['helmet', 'safety', 'gear'],
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
        images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=1000&q=80'],
        shortDescription:
          'Heavy-gauge tubular steel frame, full chain cover, heavy rear carrier, and traditional rod brakes.',
        description:
          'The legendary Indian roadster built for utility and ultimate durability. Engineered with reinforced steel, wide leather sprung saddle, and heavy luggage carrier.',
        specifications: [
          { key: 'Frame', value: 'Heavy Duty Reinforced Tubular Steel' },
          { key: 'Brakes', value: 'Traditional Steel Rod Brakes' },
        ],
        variants: [{ size: '28" Frame (Standard)', stock: 25 }],
        isFeatured: true,
        isBestSeller: true,
        ratings: 4.9,
        numReviews: 87,
        tags: ['standard', 'roadster', 'utility', 'heavy duty'],
      },
    ];

    await Product.insertMany(productsData);

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
    ];

    await Banner.insertMany(bannersData);

    return NextResponse.json({
      success: true,
      message: 'Seeded database successfully with admin, categories, products, and banners.',
    });
  } catch (error: any) {
    console.error('API Seed error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
