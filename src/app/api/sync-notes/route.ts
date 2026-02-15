import { NextRequest, NextResponse } from 'next/server';
import { syncNotionNotes } from '@/lib/sync-notion';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    // Simple authentication - check for a secret token in request header
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.SYNC_SECRET;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
    
    try {
        console.log('Starting Notion notes sync via API...');
        await syncNotionNotes();
        
        return NextResponse.json({
            success: true,
            message: 'Notes synced successfully'
        });
    } catch (error) {
        console.error('Sync failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Also allow GET for easy testing (but require auth)
export async function GET(request: NextRequest) {
    // For security, only allow GET if no SYNC_SECRET is set (development only)
    if (process.env.SYNC_SECRET) {
        return NextResponse.json(
            { error: 'Use POST with Bearer token' },
            { status: 405 }
        );
    }
    
    try {
        console.log('Starting Notion notes sync via API (GET)...');
        await syncNotionNotes();
        
        return NextResponse.json({
            success: true,
            message: 'Notes synced successfully'
        });
    } catch (error) {
        console.error('Sync failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}