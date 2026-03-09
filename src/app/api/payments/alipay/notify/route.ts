import { parseAndVerifyAlipayNotification } from '@/lib/payments';
import { markOrderPaid } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const payload = await parseAndVerifyAlipayNotification(body);

    if (payload.trade_status === 'TRADE_SUCCESS' || payload.trade_status === 'TRADE_FINISHED') {
      await markOrderPaid(payload.out_trade_no, {
        externalTradeNo: payload.trade_no,
      });
    }

    return new Response('success', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('alipay notify failed', error);
    return new Response('failure', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
