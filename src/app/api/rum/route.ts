import { NextRequest, NextResponse } from 'next/server';

interface RumPayload {
    name?: string;
    value?: number;
    rating?: string;
    id?: string;
    path?: string;
    timestamp?: number;
    [key: string]: unknown;
}

export async function POST(request: NextRequest) {
    try {
        const payload = (await request.json()) as RumPayload;

        if (!payload?.name || typeof payload.value !== 'number') {
            return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
        }

        // Keep this lightweight. In production you can replace with DB or analytics ingestion.
        console.log('[RUM]', {
            metric: payload.name,
            value: payload.value,
            rating: payload.rating,
            path: payload.path,
            id: payload.id,
            timestamp: payload.timestamp,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('RUM ingest error:', error);
        return NextResponse.json({ ok: false, error: 'ingest_failed' }, { status: 500 });
    }
}
