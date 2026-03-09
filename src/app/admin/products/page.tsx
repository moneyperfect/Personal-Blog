import { protectAdminRoute } from '@/lib/admin-auth';
import ProductDashboardClient from './ProductDashboardClient';

export default async function AdminProductsPage() {
  await protectAdminRoute();

  return <ProductDashboardClient />;
}
