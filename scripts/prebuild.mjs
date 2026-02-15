#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');

async function runPrebuild() {
  console.log('🚀 开始构建前预处理...\n');

  const obsidianPath = process.env.OBSIDIAN_NOTES_PATH || './obsidian-notes';
  const obsidianAbsPath = path.isAbsolute(obsidianPath) 
    ? obsidianPath 
    : path.join(projectRoot, obsidianPath);

  const hasObsidian = fs.existsSync(obsidianAbsPath);
  const hasNotionToken = process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID;

  console.log('📊 环境检测:');
  console.log(`  Obsidian 目录: ${obsidianAbsPath} ${hasObsidian ? '✅ 存在' : '❌ 不存在'}`);
  console.log(`  Notion 配置: ${hasNotionToken ? '✅ 已配置' : '❌ 未配置'}`);

  // 优先使用 Obsidian
  if (hasObsidian) {
    console.log('\n🔄 检测到 Obsidian 目录，开始转换笔记...');
    try {
      execSync('npm run convert-obsidian', { 
        stdio: 'inherit',
        cwd: projectRoot 
      });
      console.log('✅ Obsidian 笔记转换完成');
      return;
    } catch (error) {
      console.error('❌ Obsidian 转换失败:', error.message);
      console.log('⚠️  尝试使用 Notion 同步...');
    }
  }

  // 回退到 Notion
  if (hasNotionToken) {
    console.log('\n🔄 使用 Notion 同步...');
    try {
      execSync('npm run sync-notes', { 
        stdio: 'inherit',
        cwd: projectRoot 
      });
      console.log('✅ Notion 笔记同步完成');
      return;
    } catch (error) {
      console.error('❌ Notion 同步失败:', error.message);
    }
  }

  // 两者都不可用
  console.log('\n⚠️  警告:');
  console.log('  未检测到可用的内容来源');
  console.log('  请选择以下方案之一:');
  console.log('  1. 设置 Obsidian 集成:');
  console.log('     - 添加 Git 子模块: git submodule add <repo> obsidian-notes');
  console.log('     - 或设置 OBSIDIAN_NOTES_PATH 环境变量');
  console.log('  2. 配置 Notion 同步:');
  console.log('     - 设置 NOTION_TOKEN 和 NOTION_DATABASE_ID 环境变量');
  console.log('  3. 手动管理笔记:');
  console.log('     - 直接在 content/notes/ 目录创建 .mdx 文件');
  
  const notesDir = path.join(projectRoot, 'content', 'notes');
  const hasExistingNotes = fs.existsSync(notesDir) && 
    fs.readdirSync(notesDir).filter(f => f.endsWith('.mdx')).length > 0;
  
  if (hasExistingNotes) {
    console.log('\n📝 检测到现有笔记文件，继续构建...');
  } else {
    console.log('\n📝 未找到笔记文件，网站将显示空笔记列表');
  }
}

runPrebuild().catch(error => {
  console.error('构建前预处理失败:', error);
  process.exit(1);
});