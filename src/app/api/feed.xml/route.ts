import { getAllPosts } from '@/lib/posts';
import { getAllNotes } from '@/lib/mdx';
import { getSiteUrl } from '@/lib/seo';

export const revalidate = 60;

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    const baseUrl = getSiteUrl();
    const locale = 'zh';

    const posts = getAllPosts(locale).map((post) => ({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        link: `${baseUrl}/${locale}/posts/${post.slug}`,
        date: new Date(post.frontmatter.date).toUTCString(),
        guid: `${baseUrl}/${locale}/posts/${post.slug}`,
    }));

    const allNotes = await getAllNotes(locale);
    const notes = allNotes.map((note) => ({
        title: note.frontmatter.title,
        description: note.frontmatter.summary || '',
        link: `${baseUrl}/${locale}/notes/${note.slug}`,
        date: new Date(note.frontmatter.updatedAt).toUTCString(),
        guid: `${baseUrl}/${locale}/notes/${note.slug}`,
    }));

    const items = [...posts, ...notes]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20);

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NAS Build</title>
    <link>${baseUrl}</link>
    <description>NAS Build 的个人博客、数字产品和 AI 自动化资源。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/feed.xml" rel="self" type="application/rss+xml"/>
${items
    .map(
        (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.date}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
    </item>`
    )
    .join('\n')}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
