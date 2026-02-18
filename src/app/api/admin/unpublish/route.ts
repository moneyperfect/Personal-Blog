import { NextResponse } from 'next/server';
import { addToIgnoreList } from '@/lib/github';

export async function POST(req: Request) {
    try {
        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        await addToIgnoreList(slug);

        return NextResponse.json({ success: true, message: 'Note unpublished successfully. Changes will manifest after the next build.' });
    } catch (error: any) {
        console.error('Unpublish error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to unpublish note' },
            { status: 500 }
        );
    }
}
