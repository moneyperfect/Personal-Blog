import { NextRequest, NextResponse } from 'next/server';
import { createPendingOrder, updateOrderPaymentPayload } from '@/lib/orders';
import { createProviderCheckout, isOfficialPaymentsEnabled, isPaymentProviderConfigured } from '@/lib/payments';

interface CheckoutPayload {
  slug?: unknown;
  locale?: unknown;
  provider?: unknown;
  customerEmail?: unknown;
}

function toStringValue(input: unknown) {
  return typeof input === 'string' ? input.trim() : '';
}

export async function POST(request: NextRequest) {
  try {
    if (!isOfficialPaymentsEnabled()) {
      return NextResponse.json(
        {
          ok: false,
          code: 'OFFICIAL_PAYMENTS_DISABLED',
          error: '当前站点使用人工确认收款码方案，官方直连支付入口暂未启用。',
        },
        { status: 410 }
      );
    }

    const body = (await request.json()) as CheckoutPayload;
    const slug = toStringValue(body.slug);
    const locale = toStringValue(body.locale) === 'ja' ? 'ja' : 'zh';
    const provider = toStringValue(body.provider) as 'wechat' | 'alipay';
    const customerEmail = toStringValue(body.customerEmail);

    if (!slug || (provider !== 'wechat' && provider !== 'alipay')) {
      return NextResponse.json(
        { ok: false, error: '产品或支付方式无效。' },
        { status: 400 }
      );
    }

    if (!isPaymentProviderConfigured(provider)) {
      return NextResponse.json(
        { ok: false, error: '当前支付方式尚未配置完成。' },
        { status: 503 }
      );
    }

    const createdOrder = await createPendingOrder({
      slug,
      locale,
      provider,
      customerEmail: customerEmail || null,
    });

    if (!createdOrder) {
      return NextResponse.json(
        { ok: false, error: '产品不存在或未发布。' },
        { status: 404 }
      );
    }

    const checkout = await createProviderCheckout(createdOrder.order);
    await updateOrderPaymentPayload(createdOrder.order.order_no, {
      externalTradeNo: checkout.externalTradeNo,
      providerQrContent: checkout.qrContent,
      providerResponse: checkout.providerResponse,
    });

    return NextResponse.json({
      ok: true,
      orderNo: createdOrder.order.order_no,
      status: createdOrder.order.payment_status,
      qrContent: checkout.qrContent,
    });
  } catch (error) {
    console.error('create checkout failed', error);
    const message = error instanceof Error ? error.message : 'create_checkout_failed';

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
