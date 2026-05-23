import { protectAdminRoute } from '@/lib/admin-auth';
import BlogEditorClient from './BlogEditorClient';

export default async function BlogEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await protectAdminRoute();
  const { slug } = await params;
  return <BlogEditorClient slug={slug} />;
}
