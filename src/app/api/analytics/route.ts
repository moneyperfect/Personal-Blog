import { NextRequest, NextResponse } from 'next/server';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';
import { createRequestContext, logError, logInfo } from '@/lib/server-observability';

interface AnalyticsPayload {
    sessionId?: unknown;
    eventName?: unknown;
    eventCategory?: unknown;
    eventLabel?: unknown;
    path?: unknown;
    value?: unknown;
    metadata?: unknown;
}

function toBoundedString(input: unknown, max = 160): string | null {
    if (typeof input !== 'string') return null;
    const value = input.trim();
    if (!value) return null;
    return value.slice(0, max);
}

function toOptionalNumber(input: unknown): number | null {
    if (typeof input !== 'number' || Number.isNaN(input)) return null;
    return Number.isFinite(input) ? input : null;
}

function toMetadata(input: unknown): Record<string, unknown> {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return {};
    }
    return input as Record<string, unknown>;
}

export async function POST(request: NextRequest) {
    const ctx = createRequestContext(request, '/api/analytics');

    try {
        if (!hasSupabaseConfig) {
            logError(ctx, 'config_missing', 'supabase_config_missing');
            return NextResponse.json(
                { ok: false, code: 'ANALYTICS_CONFIG_MISSING', message: 'Analytics backend not configured.' },
                { status: 503 }
            );
        }

        const payload = (await request.json()) as AnalyticsPayload;
        const eventName = toBoundedString(payload.eventName, 64);

        if (!eventName) {
            return NextResponse.json(
                { ok: false, code: 'INVALID_EVENT_NAME', message: 'eventName is required.' },
                { status: 400 }
            );
        }

        const sessionId = toBoundedString(payload.sessionId, 120);
        const eventCategory = toBoundedString(payload.eventCategory, 80);
        const eventLabel = toBoundedString(payload.eventLabel, 160);
        const path = toBoundedString(payload.path, 240);
        const value = toOptionalNumber(payload.value);
        const metadata = toMetadata(payload.metadata);

        const { error } = await supabase.from('analytics_events').insert([
            {
                session_id: sessionId,
                event_name: eventName,
                event_category: eventCategory,
                event_label: eventLabel,
                path,
                value,
                metadata,
            },
        ]);

        if (error) {
            logError(ctx, 'analytics_insert_failed', error, { eventName });
            return NextResponse.json(
                { ok: false, code: 'ANALYTICS_INSERT_FAILED', message: 'Analytics insert failed.' },
                { status: 500 }
            );
        }

        logInfo(ctx, 'analytics_event_ingested', { eventName });
        return NextResponse.json({ ok: true });
    } catch (error) {
        logError(ctx, 'analytics_exception', error);
        return NextResponse.json(
            { ok: false, code: 'ANALYTICS_EXCEPTION', message: 'Analytics ingest failed.' },
            { status: 500 }
        );
    }
}
