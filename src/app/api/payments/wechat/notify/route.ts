import { NextRequest, NextResponse } from 'next/server';
import { markOrderPaid } from '@/lib/orders';
import { parseAndVerifyWechatNotification } from '@/lib/payments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const payload = await parseAndVerifyWechatNotification(body, request.headers);

    if (payload.trade_state === 'SUCCESS') {
      await markOrderPaid(payload.out_trade_no, {
        externalTradeNo: payload.transaction_id,
      });
    }

    return NextResponse.json({ code: 'SUCCESS', message: '成功' });
  } catch (error) {
    console.error('wechat notify failed', error);
    return NextResponse.json({ code: 'FAIL', message: '失败' }, { status: 401 });
  }
}
