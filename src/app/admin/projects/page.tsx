import { protectAdminRoute } from '@/lib/admin-auth';
import ProjectListClient from './ProjectListClient';

export default async function ProjectListPage() {
  await protectAdminRoute();
  return <ProjectListClient />;
}
