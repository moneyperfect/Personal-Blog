import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { queryNotes, getPageContent, NotionNote } from './notion';

const contentDir = path.join(process.cwd(), 'content', 'notes');

export async function syncNotionNotes(): Promise<void> {
    console.log('Starting Notion notes sync...');

    // Ensure content directory exists
    if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
    }

    // Sync for both languages
    for (const language of ['zh', 'ja'] as const) {
        console.log(`\nSyncing ${language} notes...`);
        
        try {
            const notes = await queryNotes(language);
            console.log(`Found ${notes.length} published notes for ${language}`);
            
            for (const note of notes) {
                await syncNote(note, language);
            }
            
            // Remove old files that no longer exist in Notion
            cleanupOldFiles(notes, language);
            
        } catch (error) {
            console.error(`Error syncing ${language} notes:`, error);
        }
    }
    
    console.log('\nSync completed!');
}

async function syncNote(note: NotionNote, language: 'zh' | 'ja'): Promise<void> {
    const filename = `${note.slug}.${language}.mdx`;
    const filepath = path.join(contentDir, filename);
    
    // Check if file already exists and is up to date
    if (fs.existsSync(filepath)) {
        const fileContent = fs.readFileSync(filepath, 'utf8');
        const { data: frontmatter } = matter(fileContent);
        const fileDate = frontmatter.updatedAt || frontmatter.date;
        
        // If note hasn't been updated, skip
        if (fileDate === note.date) {
            console.log(`  ✓ ${note.slug}.${language}.mdx is up to date`);
            return;
        }
    }
    
    console.log(`  ↻ ${note.slug}.${language}.mdx`);
    
    // Fetch content from Notion
    const markdownContent = await getPageContent(note.id);
    
    // Prepare frontmatter
    const frontmatter: Record<string, unknown> = {
        title: note.title,
        summary: note.summary,
        tags: note.tags,
        updatedAt: note.date,
        language: note.language,
        category: note.category,
        type: note.type,
    };
    
    // Remove undefined values
    Object.keys(frontmatter).forEach(key => {
        if (frontmatter[key] === undefined) {
            delete frontmatter[key];
        }
    });
    
    // Write MDX file
    const content = `---\n${Object.entries(frontmatter)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${key}: ${JSON.stringify(value)}`;
            }
            return `${key}: "${String(value).replace(/"/g, '\\"')}"`;
        })
        .join('\n')}\n---\n\n${markdownContent}`;
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`    → ${filename} saved`);
}

function cleanupOldFiles(currentNotes: NotionNote[], language: 'zh' | 'ja'): void {
    const expectedFiles = new Set(currentNotes.map(note => `${note.slug}.${language}.mdx`));
    
    if (!fs.existsSync(contentDir)) return;
    
    const files = fs.readdirSync(contentDir);
    for (const file of files) {
        if (file.endsWith(`.${language}.mdx`) && !expectedFiles.has(file)) {
            const filepath = path.join(contentDir, file);
            console.log(`  ✗ Removing ${file} (no longer in Notion)`);
            fs.unlinkSync(filepath);
        }
    }
}