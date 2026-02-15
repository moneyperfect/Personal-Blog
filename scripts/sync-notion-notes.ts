import { syncNotionNotes } from '../src/lib/sync-notion';

// Load environment variables
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Run sync
syncNotionNotes().catch(error => {
    console.error('Sync failed:', error);
    process.exit(1);
});