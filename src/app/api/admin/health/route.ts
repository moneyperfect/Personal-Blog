import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { hasSupabaseAdminConfig, supabaseAdmin } from '@/lib/supabase';
import { createRequestContext, logError, logInfo } from '@/lib/server-observability';

async function checkTable(query: PromiseLike<{ error: { message: string } | null }>, label: string) {
  try {
    const { error } = await query;
    return {
      ok: !error,
      detail: error ? `${label}:${error.message}` : '',
    };
  } catch (error) {
    return {
      ok: false,
      detail: `${label}:${String(error)}`,
    };
  }
}

export async function GET(request: NextRequest) {
  const ctx = createRequestContext(request, '/api/admin/health');
  const isAuthenticated = await verifyAdminAuth();

  if (!isAuthenticated) {
    logInfo(ctx, 'auth_required');
    return NextResponse.json(
      { ok: false, error: '未授权访问。', code: 'AUTH_REQUIRED', requestId: ctx.requestId },
      { status: 401 }
    );
  }

  if (!hasSupabaseAdminConfig) {
    logError(ctx, 'config_missing', 'supabase_config_missing');
    return NextResponse.json(
      {
        ok: false,
        code: 'DB_CONFIG_MISSING',
        message: 'Supabase 环境变量未配置完整。',
        requestId: ctx.requestId,
        checks: {
          config: false,
          database: false,
          storage: false,
          schema: false,
        },
      },
      { status: 500 }
    );
  }

  const [postsCheck, postsSchemaCheck, productsCheck, ordersCheck] = await Promise.all([
    checkTable(supabaseAdmin.from('posts').select('slug').limit(1), 'posts'),
    checkTable(supabaseAdmin.from('posts').select('slug,source,lifecycle_status').limit(1), 'posts_schema'),
    checkTable(supabaseAdmin.from('products').select('slug,published,featured').limit(1), 'products'),
    checkTable(supabaseAdmin.from('product_orders').select('order_no,payment_status').limit(1), 'product_orders'),
  ]);

  let storage = false;
  let storageDetail = '';

  try {
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    if (!error && Array.isArray(data) && data.some((bucket) => bucket.name === 'blog-assets')) {
      storage = true;
    } else {
      storageDetail = error ? `storage:${error.message}` : 'storage:blog-assets bucket not found';
    }
  } catch (error) {
    storageDetail = `storage:${String(error)}`;
  }

  const database = postsCheck.ok;
  const schema = postsSchemaCheck.ok && productsCheck.ok && ordersCheck.ok;
  const ok = database && storage && schema;
  const details = [
    postsCheck.detail,
    postsSchemaCheck.detail,
    productsCheck.detail,
    ordersCheck.detail,
    storageDetail,
  ].filter(Boolean).join('; ');

  if (!ok) {
    logError(ctx, 'health_failed', details || 'unknown', { database, storage, schema });
  } else {
    logInfo(ctx, 'health_ok');
  }

  return NextResponse.json(
    {
      ok,
      code: ok ? 'OK' : 'HEALTH_CHECK_FAILED',
      message: ok
        ? '服务状态正常。'
        : '服务状态异常，请检查 Supabase 配置、网络或数据库迁移。',
      requestId: ctx.requestId,
      checks: {
        config: true,
        database,
        storage,
        schema,
      },
      details,
    },
    { status: ok ? 200 : 500 }
  );
}
