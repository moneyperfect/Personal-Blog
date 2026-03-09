import { protectAdminRoute } from '@/lib/admin-auth';
import { createEmptyProduct } from '@/lib/admin-products';
import ProductEditor from '@/components/admin/ProductEditor';

export default async function NewProductPage() {
  await protectAdminRoute();

  return <ProductEditor initialProduct={createEmptyProduct('zh')} isNew />;
}
