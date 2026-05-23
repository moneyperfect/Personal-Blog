import { protectAdminRoute } from '@/lib/admin-auth';
import BlogListClient from './BlogListClient';

export default async function BlogListPage() {
  await protectAdminRoute();
  return <BlogListClient />;
}
