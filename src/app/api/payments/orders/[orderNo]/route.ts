import { NextResponse } from 'next/server';
import { getOrderByOrderNo } from '@/lib/orders';

interface PageProps {
  params: Promise<{ orderNo: string }>;
}

export async function GET(_: Request, { params }: PageProps) {
  const { orderNo } = await params;
  const order = await getOrderByOrderNo(orderNo);

  if (!order) {
    return NextResponse.json({ ok: false, error: '订单不存在。' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    orderNo: order.order_no,
    status: order.payment_status,
    provider: order.payment_provider,
    productTitle: order.product_title,
    amount: order.amount,
    currency: order.currency,
    paidAt: order.paid_at,
    fulfillmentUrl: order.payment_status === 'paid' ? order.fulfillment_url : null,
  });
}
