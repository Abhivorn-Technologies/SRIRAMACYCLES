import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CustomerReviews from '@/components/home/CustomerReviews';
import ScrollReveal from '@/components/common/ScrollReveal';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Banner from '@/models/Banner';
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from '@/lib/sample-data';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  try {
    await connectToDatabase();

    const [categories, featuredProducts, bestSellers, banners] = await Promise.all([
      Category.find({ isActive: true }).sort({ order: 1 }).lean(),
      Product.find({ isFeatured: true, isActive: true })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      Product.find({ isBestSeller: true, isActive: true })
        .populate('category', 'name slug')
        .sort({ ratings: -1 })
        .limit(8)
        .lean(),
      Banner.find({ isActive: true }).sort({ order: 1 }).lean(),
    ]);

    return {
      categories:
        categories && categories.length > 0
          ? JSON.parse(JSON.stringify(categories))
          : SAMPLE_CATEGORIES,
      featuredProducts:
        featuredProducts && featuredProducts.length > 0
          ? JSON.parse(JSON.stringify(featuredProducts)).slice(0, 8)
          : SAMPLE_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8),
      bestSellers:
        bestSellers && bestSellers.length > 0
          ? JSON.parse(JSON.stringify(bestSellers)).slice(0, 8)
          : SAMPLE_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8),
      banners: banners && banners.length > 0 ? JSON.parse(JSON.stringify(banners)) : [],
    };
  } catch (error) {
    console.warn('Using rich fallback data while DB connects');
    return {
      categories: SAMPLE_CATEGORIES,
      featuredProducts: SAMPLE_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8),
      bestSellers: SAMPLE_PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8),
      banners: [],
    };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, bestSellers, banners } = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Carousel */}
      <HeroBanner banners={banners} />

      {/* 2. Featured Categories with Scroll Animation (Capped to 6 cards on Home) */}
      <ScrollReveal direction="up" delayMs={50}>
        <FeaturedCategories categories={categories} />
      </ScrollReveal>

      {/* 3. Featured Products with Scroll Animation (Capped to 8 cards on Home) */}
      <ScrollReveal direction="up" delayMs={100}>
        <FeaturedProducts
          products={featuredProducts}
          title="Featured Performance Cycles"
          subtitle="Handcrafted aerodynamics and trail-tested engineering"
          viewAllLink="/shop?featured=true"
          buttonText="View All Featured Cycles"
          limit={8}
        />
      </ScrollReveal>

      {/* 4. Best Sellers Section with Scroll Animation (Capped to 8 cards on Home) */}
      {bestSellers && bestSellers.length > 0 && (
        <ScrollReveal direction="up" delayMs={150}>
          <FeaturedProducts
            products={bestSellers}
            title="Most Popular & Best Sellers"
            subtitle="Top customer favorites trusted by cyclists across India"
            viewAllLink="/shop?bestSeller=true"
            buttonText="View All Best Sellers"
            limit={8}
          />
        </ScrollReveal>
      )}

      {/* 5. Why Choose Us with Scroll Animation */}
      <ScrollReveal direction="up" delayMs={100}>
        <WhyChooseUs />
      </ScrollReveal>

      {/* 6. Customer Reviews with Scroll Animation */}
      <ScrollReveal direction="up" delayMs={150}>
        <CustomerReviews />
      </ScrollReveal>
    </div>
  );
}
