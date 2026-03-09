import { protectAdminRoute } from '@/lib/admin-auth';
import Editor from '@/components/admin/Editor';

export default async function NewNotePage() {
    await protectAdminRoute();
    return <Editor isNew={true} />;
}
