const NOTION_API_BASE = 'https://api.notion.com/v1';

export async function notionDatabaseQuery(
    databaseId: string,
    body: Record<string, any>
): Promise<any> {
    const token = process.env.NOTION_TOKEN;
    if (!token) throw new Error('Missing NOTION_TOKEN');

    const res = await fetch(`${NOTION_API_BASE}/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Notion API Error: ${res.status} ${res.statusText} - ${errorText}`;

        if (res.status === 404) {
            errorMessage += '\n[HINT] 404 "object_not_found" usually means:\n1. The NOTION_DATABASE_ID is incorrect.\n2. The Integration (Token) has NOT been connected to the database.\n   --> Go to your Notion Database page > "..." menu > "Connect to" > Select your integration.';
        }
        if (res.status === 401) {
            errorMessage += '\n[HINT] 401 "unauthorized" usually means the NOTION_TOKEN is invalid.';
        }

        throw new Error(errorMessage);
    }

    return res.json();
}

export async function getPageBlocks(pageId: string, startCursor?: string): Promise<any> {
    const token = process.env.NOTION_TOKEN;
    if (!token) throw new Error('Missing NOTION_TOKEN');

    let url = `${NOTION_API_BASE}/blocks/${pageId}/children?page_size=100`;
    if (startCursor) {
        url += `&start_cursor=${startCursor}`;
    }

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': '2022-06-28',
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Notion API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return res.json();
}

export async function getAllBlocks(pageId: string): Promise<any[]> {
    let allBlocks: any[] = [];
    let hasMore = true;
    let nextCursor: string | undefined = undefined;

    while (hasMore) {
        const res = await getPageBlocks(pageId, nextCursor);
        allBlocks = [...allBlocks, ...res.results];
        hasMore = res.has_more;
        nextCursor = res.next_cursor;
    }

    return allBlocks;
}
