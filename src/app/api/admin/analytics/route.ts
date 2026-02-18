import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';
import { createRequestContext, logError, logInfo } from '@/lib/server-observability';

interface AnalyticsEventRow {
    event_name: string;
    event_label: string | null;
    path: string | null;
    value: number | null;
    created_at: string;
    metadata: Record<string, unknown> | null;
}

function eventHappenedAfter(isoTime: string, sinceMs: number) {
    const ts = Date.parse(isoTime);
    return Number.isFinite(ts) && ts >= sinceMs;
}

function extractSlug(event: AnalyticsEventRow): string | null {
    const metadataSlug = event.metadata && typeof event.metadata.slug === 'string'
        ? event.metadata.slug
        : null;

    if (metadataSlug) return metadataSlug;

    const path = event.path || '';
    const match = path.match(/\/notes\/([^/?#]+)/);
    if (match?.[1]) return decodeURIComponent(match[1]);

    return null;
}

export async function GET(request: NextRequest) {
    const ctx = createRequestContext(request, '/api/admin/analytics');

    try {
        const isAuthenticated = await verifyAdminAuth();
        if (!isAuthenticated) {
            return NextResponse.json({ ok: false, error: '未授权访问', code: 'AUTH_REQUIRED' }, { status: 401 });
        }

        if (!hasSupabaseConfig) {
            return NextResponse.json(
                { ok: false, error: 'Supabase 环境变量未配置完整。', code: 'DB_CONFIG_MISSING' },
                { status: 500 }
            );
        }

        const since30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const since7DaysMs = Date.now() - 7 * 24 * 60 * 60 * 1000;

        const { data, error } = await supabase
            .from('analytics_events')
            .select('event_name,event_label,path,value,created_at,metadata')
            .gte('created_at', since30Days)
            .order('created_at', { ascending: false })
            .range(0, 4999);

        if (error) {
            const raw = JSON.stringify(error).toLowerCase();
            if (raw.includes('analytics_events')) {
                return NextResponse.json(
                    {
                        ok: false,
                        code: 'ANALYTICS_TABLE_MISSING',
                        error: 'analytics_events 表不存在，请先执行最新 Supabase migration。',
                    },
                    { status: 500 }
                );
            }

            logError(ctx, 'analytics_query_failed', error);
            return NextResponse.json(
                { ok: false, code: 'ANALYTICS_QUERY_FAILED', error: '读取分析数据失败。' },
                { status: 500 }
            );
        }

        const events = (data || []) as AnalyticsEventRow[];
        const events7d = events.filter((event) => eventHappenedAfter(event.created_at, since7DaysMs));

        const pageViews7d = events7d.filter((event) => event.event_name === 'page_view').length;
        const noteViews7d = events7d.filter((event) => event.event_name === 'note_view').length;
        const ctaClicks7d = events7d.filter((event) => event.event_name === 'note_cta_click').length;
        const readDepthValues = events7d
            .filter((event) => event.event_name === 'read_progress')
            .map((event) => event.value)
            .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

        const avgReadDepth7d = readDepthValues.length > 0
            ? Number((readDepthValues.reduce((sum, value) => sum + value, 0) / readDepthValues.length).toFixed(1))
            : 0;

        const noteViewMap = new Map<string, number>();
        events7d
            .filter((event) => event.event_name === 'note_view')
            .forEach((event) => {
                const slug = extractSlug(event);
                if (!slug) return;
                noteViewMap.set(slug, (noteViewMap.get(slug) || 0) + 1);
            });

        const topNotes = Array.from(noteViewMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([slug, views]) => ({ slug, views }));

        logInfo(ctx, 'analytics_summary_success', {
            events30d: events.length,
            events7d: events7d.length,
            pageViews7d,
            noteViews7d,
        });

        return NextResponse.json({
            ok: true,
            summary: {
                pageViews7d,
                noteViews7d,
                ctaClicks7d,
                avgReadDepth7d,
                events30d: events.length,
            },
            topNotes,
            requestId: ctx.requestId,
        });
    } catch (error) {
        logError(ctx, 'analytics_summary_exception', error);
        return NextResponse.json(
            { ok: false, code: 'ANALYTICS_SUMMARY_EXCEPTION', error: '统计接口异常。' },
            { status: 500 }
        );
    }
}
