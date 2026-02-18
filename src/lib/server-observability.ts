import { NextRequest } from 'next/server';

export interface RequestContext {
    requestId: string;
    runtime: 'cloud' | 'local';
    route: string;
}

export function createRequestContext(request: NextRequest, route: string): RequestContext {
    const headerId = request.headers.get('x-request-id');
    const requestId = headerId || crypto.randomUUID();
    const isCloud = process.env.VERCEL === '1' || Boolean(request.headers.get('x-vercel-id'));

    return {
        requestId,
        runtime: isCloud ? 'cloud' : 'local',
        route,
    };
}

export function logInfo(ctx: RequestContext, event: string, payload?: Record<string, unknown>) {
    console.log(JSON.stringify({
        level: 'info',
        requestId: ctx.requestId,
        route: ctx.route,
        runtime: ctx.runtime,
        event,
        ...payload,
    }));
}

export function logError(
    ctx: RequestContext,
    event: string,
    error: unknown,
    payload?: Record<string, unknown>
) {
    const details = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { raw: String(error) };

    console.error(JSON.stringify({
        level: 'error',
        requestId: ctx.requestId,
        route: ctx.route,
        runtime: ctx.runtime,
        event,
        ...payload,
        error: details,
    }));
}
