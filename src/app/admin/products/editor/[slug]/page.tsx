import { notFound, redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { getAdminProductBySlug } from '@/lib/admin-products';
import ProductEditor from '@/components/admin/ProductEditor';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default async function EditProductPage({ params, searchParams }: PageProps) {
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    redirect('/admin');
  }

  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = lang === 'ja' ? 'ja' : 'zh';

  const product = await getAdminProductBySlug(slug, locale);
  if (!product) {
    notFound();
  }

  return <ProductEditor initialProduct={product} />;
}
