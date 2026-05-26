import { verifyAdminAuth } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import AdminLoginClient from './AdminLoginClient';

export default async function AdminPage() {
  const isAuthenticated = await verifyAdminAuth();
  if (isAuthenticated) {
    redirect('/admin/dashboard');
  }
  return <AdminLoginClient />;
}
