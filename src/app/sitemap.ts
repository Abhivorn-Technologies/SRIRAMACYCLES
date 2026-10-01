import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sriramacycles.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/track-order`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  try {
    await connectToDatabase();
    const [products, categories] = await Promise.all([
      Product.find({ isActive: true }).select('slug updatedAt').lean(),
      Category.find({ isActive: true }).select('slug updatedAt').lean(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p: any) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: any) => ({
      url: `${baseUrl}/shop?category=${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (err) {
    return staticRoutes;
  }
}
