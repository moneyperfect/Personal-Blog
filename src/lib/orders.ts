import { getProductBySlug } from '@/lib/products';
import { supabaseAdmin } from '@/lib/supabase';

export type PaymentProvider = 'wechat' | 'alipay';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface ProductOrderRecord {
  id: string;
  order_no: string;
  product_slug: string;
  product_lang: string;
  product_title: string;
  amount: number;
  currency: string;
  payment_provider: PaymentProvider;
  payment_status: PaymentStatus;
  customer_email: string | null;
  external_trade_no: string | null;
  provider_qr_content: string | null;
  provider_response: Record<string, unknown> | null;
  fulfillment_url: string | null;
  paid_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  slug: string;
  locale: 'zh' | 'ja';
  provider: PaymentProvider;
  customerEmail?: string | null;
}

export interface CreatedOrderContext {
  order: ProductOrderRecord;
  productTitle: string;
}

export function generateOrderNo() {
  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PB${timestamp}${random}`;
}

export async function createPendingOrder(input: CreateOrderInput): Promise<CreatedOrderContext | null> {
  const product = await getProductBySlug(input.slug, input.locale);
  if (!product) {
    return null;
  }

  const paymentMethods = product.frontmatter.paymentMethods || ['wechat', 'alipay'];
  if (!paymentMethods.includes(input.provider)) {
    throw new Error('payment_provider_not_enabled');
  }

  const amount = product.frontmatter.priceAmount || 0;
  if (amount <= 0) {
    throw new Error('invalid_product_amount');
  }
  const orderNo = generateOrderNo();
  const fulfillmentUrl = product.frontmatter.fulfillmentUrl || product.frontmatter.purchaseUrl || null;

  const { data, error } = await supabaseAdmin
    .from('product_orders')
    .insert([
      {
        order_no: orderNo,
        product_slug: product.slug,
        product_lang: input.locale,
        product_title: product.frontmatter.title,
        amount,
        currency: product.frontmatter.currency || 'CNY',
        payment_provider: input.provider,
        payment_status: 'pending',
        customer_email: input.customerEmail?.trim() || null,
        fulfillment_url: fulfillmentUrl,
      },
    ])
    .select('*')
    .single();

  if (error || !data) {
    throw error || new Error('create_order_failed');
  }

  return {
    order: data as ProductOrderRecord,
    productTitle: product.frontmatter.title,
  };
}

export async function getOrderByOrderNo(orderNo: string): Promise<ProductOrderRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('product_orders')
    .select('*')
    .eq('order_no', orderNo)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ProductOrderRecord;
}

export async function updateOrderPaymentPayload(
  orderNo: string,
  payload: {
    externalTradeNo?: string | null;
    providerQrContent?: string | null;
    providerResponse?: Record<string, unknown>;
  }
) {
  const { error } = await supabaseAdmin
    .from('product_orders')
    .update({
      external_trade_no: payload.externalTradeNo || null,
      provider_qr_content: payload.providerQrContent || null,
      provider_response: payload.providerResponse || {},
      updated_at: new Date().toISOString(),
    })
    .eq('order_no', orderNo);

  if (error) {
    throw error;
  }
}

export async function markOrderPaid(orderNo: string, extra?: { externalTradeNo?: string | null }) {
  const { error } = await supabaseAdmin
    .from('product_orders')
    .update({
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      external_trade_no: extra?.externalTradeNo || null,
      updated_at: new Date().toISOString(),
    })
    .eq('order_no', orderNo);

  if (error) {
    throw error;
  }
}
