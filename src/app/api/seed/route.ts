import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import User from '@/models/User';
import Banner from '@/models/Banner';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    await connectToDatabase();

    // Check if products exist
    const count = await Product.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already has data. Seeding skipped.',
        count,
      });
    }

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
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
        order: 1,
      },
      {
        name: 'Mountain Bikes',
        slug: 'mountain-bikes',
        description: 'Heavy-duty suspension, rugged grip tires, and hydraulic discs.',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
        order: 2,
      },
      {
        name: 'Hybrid & City Bikes',
        slug: 'hybrid-city-bikes',
        description: 'Comfortable upright ergonomics built for modern urban commutes.',
        image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
        order: 3,
      },
      {
        name: 'Electric Bikes',
        slug: 'electric-bikes',
        description: 'Smart pedal-assist bikes with removable lithium power packs.',
        image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
        order: 4,
      },
      {
        name: 'Kids & Junior Bikes',
        slug: 'kids-bikes',
        description: 'Safe, lightweight, ergonomic bicycles designed for young riders.',
        image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80',
        order: 5,
      },
      {
        name: 'Cycling Accessories & Gear',
        slug: 'cycling-accessories',
        description: 'Aerodynamic helmets, high-lumen safety LED lights, and pro repair tools.',
        image: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&q=80',
        order: 6,
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
        ],
        shortDescription:
          '250W High-Torque BLDC Hub Motor with detachable 36V 10.4Ah Samsung Lithium battery.',
        description:
          'The ultimate daily city commuter. Delivers effortless pedalling with 5 levels of smart assist, backlit LCD display, and 60km pedal assist range.',
        specifications: [
          { key: 'Motor', value: '250W High Efficiency Brushless Hub Motor' },
          { key: 'Battery', value: '36V 10.4Ah Detachable Samsung Cell Li-ion' },
          { key: 'Range', value: '45-65 km on Pedal Assist' },
          { key: 'Top Speed', value: '25 km/h' },
        ],
        variants: [{ size: 'Standard (Unisex)', stock: 15 }],
        isFeatured: true,
        isNewArrival: true,
        ratings: 4.9,
        numReviews: 18,
        tags: ['electric', 'ebike', 'commuter'],
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
        ],
        shortDescription:
          'Ultra-light 6061 alloy commuter with Shimano Altus 21-speed gears and dual disc brakes.',
        description:
          'Designed for navigating bustling Indian city streets with ease. Equipped with puncture-resistant 700x35C tires and ergonomic memory foam saddle.',
        specifications: [
          { key: 'Frame', value: 'Lightweight 6061 Alloy' },
          { key: 'Shifters', value: 'Shimano EF500 3x7 Speed EZ Fire' },
          { key: 'Brakes', value: 'Dual Mechanical Disc 160mm' },
          { key: 'Weight', value: '11.8 kg' },
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
