import { protectAdminRoute } from '@/lib/admin-auth';
import ProjectEditorClient from './ProjectEditorClient';

export default async function ProjectEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  await protectAdminRoute();
  const { slug } = await params;
  const { tab } = await searchParams;
  return <ProjectEditorClient slug={slug} initialTab={tab} />;
}
