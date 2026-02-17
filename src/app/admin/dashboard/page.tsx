import { protectAdminRoute } from '@/lib/admin-auth';
import DashboardClient from './DashboardClient';

export default async function AdminDashboardPage() {
  await protectAdminRoute();

  return <DashboardClient />;
}