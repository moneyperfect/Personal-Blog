#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function runPrebuild() {
  console.log('[prebuild] start');

  const useSupabaseNotes = (process.env.USE_SUPABASE_NOTES ?? 'true').toLowerCase() !== 'false';
  if (useSupabaseNotes) {
    console.log('[prebuild] USE_SUPABASE_NOTES=true -> skip legacy Obsidian/Notion sync');
    return;
  }

  const obsidianPath = process.env.OBSIDIAN_NOTES_PATH || './obsidian-notes';
  const obsidianAbsPath = path.isAbsolute(obsidianPath)
    ? obsidianPath
    : path.join(projectRoot, obsidianPath);

  const hasObsidian = fs.existsSync(obsidianAbsPath);
  const hasNotionToken = Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID);

  console.log(`[prebuild] Obsidian path: ${obsidianAbsPath} (${hasObsidian ? 'exists' : 'missing'})`);
  console.log(`[prebuild] Notion config: ${hasNotionToken ? 'configured' : 'not configured'}`);

  if (hasObsidian) {
    console.log('[prebuild] run Obsidian conversion');
    try {
      execSync('npm run convert-obsidian', {
        stdio: 'inherit',
        cwd: projectRoot,
      });
      console.log('[prebuild] Obsidian conversion done');
      return;
    } catch (error) {
      console.error('[prebuild] Obsidian conversion failed:', error.message);
      console.log('[prebuild] fallback to Notion sync');
    }
  }

  if (hasNotionToken) {
    console.log('[prebuild] run Notion sync');
    try {
      execSync('npm run sync-notes', {
        stdio: 'inherit',
        cwd: projectRoot,
      });
      console.log('[prebuild] Notion sync done');
      return;
    } catch (error) {
      console.error('[prebuild] Notion sync failed:', error.message);
    }
  }

  console.log('[prebuild] no content source available');
  console.log('[prebuild] options:');
  console.log('  1) configure OBSIDIAN_NOTES_PATH / add obsidian-notes submodule');
  console.log('  2) configure NOTION_TOKEN + NOTION_DATABASE_ID');
  console.log('  3) create .mdx files in content/notes');

  const notesDir = path.join(projectRoot, 'content', 'notes');
  const hasExistingNotes = fs.existsSync(notesDir)
    && fs.readdirSync(notesDir).some((f) => f.endsWith('.mdx'));

  if (hasExistingNotes) {
    console.log('[prebuild] existing notes found, continue build');
  } else {
    console.log('[prebuild] no local notes found, notes pages may be empty');
  }
}

runPrebuild().catch((error) => {
  console.error('[prebuild] failed:', error);
  process.exit(1);
});
