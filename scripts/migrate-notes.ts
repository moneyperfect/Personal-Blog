import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// Load env vars from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');
const DEFAULT_CATEGORY = 'uncategorized';

function normalizeDate(input: unknown): string {
    if (input instanceof Date && !Number.isNaN(input.getTime())) {
        return input.toISOString();
    }

    if (typeof input !== 'string') {
        return new Date().toISOString();
    }

    const trimmed = input.trim();
    if (!trimmed) {
        return new Date().toISOString();
    }

    const direct = new Date(trimmed);
    if (!Number.isNaN(direct.getTime())) {
        return direct.toISOString();
    }

    // Remove locale timezone labels like "(中国标准时间)" / "（中国标准时间）".
    const cleaned = trimmed.replace(/\(.*?\)|（.*?）/g, '').trim();
    const cleanedDate = new Date(cleaned);
    if (!Number.isNaN(cleanedDate.getTime())) {
        return cleanedDate.toISOString();
    }

    return new Date().toISOString();
}

async function migrate() {
    const logFile = path.join(process.cwd(), 'migration.log');
    fs.writeFileSync(logFile, 'Starting migration...\n');

    const log = (msg: string) => {
        console.log(msg);
        try {
            fs.appendFileSync(logFile, `${msg}\n`);
        } catch (e) {
            console.error('Error writing to log file:', e);
        }
    };

    log('Starting migration...');

    if (!fs.existsSync(NOTES_DIR)) {
        log(`Notes directory not found: ${NOTES_DIR}`);
        return;
    }

    const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith('.mdx'));
    log(`Found ${files.length} notes.`);

    let successCount = 0;
    let failedCount = 0;

    for (const file of files) {
        const filePath = path.join(NOTES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);

        // filename format: slug.locale.mdx
        const filenameParts = file.split('.');
        const slug = filenameParts[0];
        const lang = filenameParts.length > 2 ? filenameParts[1] : 'zh';

        log(`Processing: ${slug} (${lang})`);

        const normalizedDate = normalizeDate(frontmatter.updatedAt || frontmatter.date);

        const post = {
            slug,
            title: frontmatter.title || slug,
            content,
            excerpt: frontmatter.summary || '',
            category: frontmatter.category || DEFAULT_CATEGORY,
            tags: frontmatter.tags || [],
            lang,
            date: normalizedDate,
            updated_at: new Date().toISOString(),
            published: true,
            source: 'supabase',
        };

        const { error } = await supabase.from('posts').upsert(post, { onConflict: 'slug' });

        if (error) {
            failedCount += 1;
            log(`Failed to migrate ${slug}: ${JSON.stringify(error)}`);
        } else {
            successCount += 1;
            log(`Successfully migrated ${slug}`);
        }
    }

    log(`Migration complete. success=${successCount}, failed=${failedCount}`);

    if (failedCount > 0) {
        process.exitCode = 1;
    }
}

migrate();
