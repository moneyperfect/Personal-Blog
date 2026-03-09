import crypto from 'crypto';
import { absoluteUrl } from '@/lib/seo';
import { PaymentProvider, ProductOrderRecord } from '@/lib/orders';

interface PaymentCreationResult {
  externalTradeNo: string | null;
  qrContent: string;
  providerResponse: Record<string, unknown>;
}

interface WechatPayConfig {
  appId: string;
  merchantId: string;
  certSerialNo: string;
  privateKey: string;
  apiV3Key: string;
  platformCert: string;
  notifyUrl: string;
}

interface AlipayConfig {
  appId: string;
  privateKey: string;
  publicKey: string;
  gateway: string;
  notifyUrl: string;
}

interface WechatNotificationResource {
  associated_data?: string;
  nonce: string;
  ciphertext: string;
}

interface VerifiedWechatNotification {
  out_trade_no: string;
  transaction_id: string;
  trade_state: string;
}

interface VerifiedAlipayNotification {
  out_trade_no: string;
  trade_no: string;
  trade_status: string;
}

function normalizePem(value: string | undefined) {
  return value ? value.replace(/\\n/g, '\n') : '';
}

export function isOfficialPaymentsEnabled() {
  return process.env.ENABLE_OFFICIAL_PAYMENTS === 'true';
}

function getWechatPayConfig(): WechatPayConfig | null {
  const appId = process.env.WECHAT_PAY_APP_ID;
  const merchantId = process.env.WECHAT_PAY_MCH_ID;
  const certSerialNo = process.env.WECHAT_PAY_CERT_SERIAL_NO;
  const privateKey = normalizePem(process.env.WECHAT_PAY_PRIVATE_KEY);
  const apiV3Key = process.env.WECHAT_PAY_API_V3_KEY;
  const platformCert = normalizePem(process.env.WECHAT_PAY_PLATFORM_CERT);

  if (!appId || !merchantId || !certSerialNo || !privateKey || !apiV3Key || !platformCert) {
    return null;
  }

  return {
    appId,
    merchantId,
    certSerialNo,
    privateKey,
    apiV3Key,
    platformCert,
    notifyUrl: process.env.WECHAT_PAY_NOTIFY_URL || absoluteUrl('/api/payments/wechat/notify'),
  };
}

function getAlipayConfig(): AlipayConfig | null {
  const appId = process.env.ALIPAY_APP_ID;
  const privateKey = normalizePem(process.env.ALIPAY_PRIVATE_KEY);
  const publicKey = normalizePem(process.env.ALIPAY_PUBLIC_KEY);

  if (!appId || !privateKey || !publicKey) {
    return null;
  }

  return {
    appId,
    privateKey,
    publicKey,
    gateway: process.env.ALIPAY_GATEWAY_URL || 'https://openapi.alipay.com/gateway.do',
    notifyUrl: process.env.ALIPAY_NOTIFY_URL || absoluteUrl('/api/payments/alipay/notify'),
  };
}

function formatAlipayTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function buildAlipaySignContent(params: Record<string, string>) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

function signAlipayParams(params: Record<string, string>, privateKey: string) {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(buildAlipaySignContent(params));
  sign.end();
  return sign.sign(privateKey, 'base64');
}

function verifyAlipayParams(params: URLSearchParams, publicKey: string) {
  const signature = params.get('sign');
  if (!signature) {
    return false;
  }

  const filtered: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key === 'sign' || key === 'sign_type' || value === '') {
      return;
    }
    filtered[key] = value;
  });

  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(buildAlipaySignContent(filtered));
  verify.end();
  return verify.verify(publicKey, signature, 'base64');
}

function buildWechatAuthorization(
  config: WechatPayConfig,
  method: string,
  urlPath: string,
  body: string
) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const message = `${method}\n${urlPath}\n${timestamp}\n${nonce}\n${body}\n`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(message), config.privateKey).toString('base64');

  return `WECHATPAY2-SHA256-RSA2048 mchid="${config.merchantId}",nonce_str="${nonce}",timestamp="${timestamp}",serial_no="${config.certSerialNo}",signature="${signature}"`;
}

function verifyWechatNotificationSignature(headers: Headers, body: string) {
  const config = getWechatPayConfig();
  if (!config) {
    return false;
  }

  const signature = headers.get('wechatpay-signature');
  const timestamp = headers.get('wechatpay-timestamp');
  const nonce = headers.get('wechatpay-nonce');

  if (!signature || !timestamp || !nonce) {
    return false;
  }

  const message = `${timestamp}\n${nonce}\n${body}\n`;
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(message);
  verify.end();

  return verify.verify(config.platformCert, signature, 'base64');
}

function decryptWechatNotification(resource: WechatNotificationResource, apiV3Key: string) {
  const ciphertext = Buffer.from(resource.ciphertext, 'base64');
  const authTag = ciphertext.subarray(ciphertext.length - 16);
  const encrypted = ciphertext.subarray(0, ciphertext.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(apiV3Key), Buffer.from(resource.nonce));

  if (resource.associated_data) {
    decipher.setAAD(Buffer.from(resource.associated_data));
  }

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  return JSON.parse(decrypted) as VerifiedWechatNotification;
}

export function isPaymentProviderConfigured(provider: PaymentProvider) {
  if (!isOfficialPaymentsEnabled()) {
    return false;
  }

  return provider === 'wechat' ? Boolean(getWechatPayConfig()) : Boolean(getAlipayConfig());
}

export async function createProviderCheckout(order: ProductOrderRecord): Promise<PaymentCreationResult> {
  if (order.payment_provider === 'wechat') {
    return createWechatNativePayment(order);
  }

  return createAlipayPrecreatePayment(order);
}

async function createWechatNativePayment(order: ProductOrderRecord): Promise<PaymentCreationResult> {
  const config = getWechatPayConfig();
  if (!config) {
    throw new Error('wechat_config_missing');
  }

  const urlPath = '/v3/pay/transactions/native';
  const payload = JSON.stringify({
    appid: config.appId,
    mchid: config.merchantId,
    description: order.product_title,
    out_trade_no: order.order_no,
    notify_url: config.notifyUrl,
    amount: {
      total: order.amount,
      currency: order.currency,
    },
  });

  const response = await fetch(`https://api.mch.weixin.qq.com${urlPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: buildWechatAuthorization(config, 'POST', urlPath, payload),
    },
    body: payload,
  });

  const data = await response.json();
  if (!response.ok || typeof data.code_url !== 'string') {
    throw new Error(data?.message || 'wechat_create_payment_failed');
  }

  return {
    externalTradeNo: data.prepay_id || null,
    qrContent: data.code_url,
    providerResponse: data,
  };
}

async function createAlipayPrecreatePayment(order: ProductOrderRecord): Promise<PaymentCreationResult> {
  const config = getAlipayConfig();
  if (!config) {
    throw new Error('alipay_config_missing');
  }

  const params: Record<string, string> = {
    app_id: config.appId,
    method: 'alipay.trade.precreate',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: formatAlipayTimestamp(new Date()),
    version: '1.0',
    notify_url: config.notifyUrl,
    biz_content: JSON.stringify({
      out_trade_no: order.order_no,
      total_amount: (order.amount / 100).toFixed(2),
      subject: order.product_title,
    }),
  };

  params.sign = signAlipayParams(params, config.privateKey);

  const response = await fetch(config.gateway, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams(params).toString(),
  });

  const rawText = await response.text();
  const data = JSON.parse(rawText) as Record<string, Record<string, unknown>>;
  const result = data.alipay_trade_precreate_response;

  if (!response.ok || !result || result.code !== '10000' || typeof result.qr_code !== 'string') {
    throw new Error((result?.sub_msg as string) || 'alipay_create_payment_failed');
  }

  return {
    externalTradeNo: (result.out_trade_no as string) || order.order_no,
    qrContent: result.qr_code as string,
    providerResponse: data,
  };
}

export async function parseAndVerifyWechatNotification(body: string, headers: Headers) {
  const config = getWechatPayConfig();
  if (!config) {
    throw new Error('wechat_config_missing');
  }

  if (!verifyWechatNotificationSignature(headers, body)) {
    throw new Error('wechat_signature_invalid');
  }

  const payload = JSON.parse(body) as { resource?: WechatNotificationResource };
  if (!payload.resource) {
    throw new Error('wechat_resource_missing');
  }

  return decryptWechatNotification(payload.resource, config.apiV3Key);
}

export async function parseAndVerifyAlipayNotification(body: string) {
  const config = getAlipayConfig();
  if (!config) {
    throw new Error('alipay_config_missing');
  }

  const params = new URLSearchParams(body);
  if (!verifyAlipayParams(params, config.publicKey)) {
    throw new Error('alipay_signature_invalid');
  }

  const outTradeNo = params.get('out_trade_no');
  const tradeNo = params.get('trade_no');
  const tradeStatus = params.get('trade_status');

  if (!outTradeNo || !tradeNo || !tradeStatus) {
    throw new Error('alipay_payload_invalid');
  }

  return {
    out_trade_no: outTradeNo,
    trade_no: tradeNo,
    trade_status: tradeStatus,
  } satisfies VerifiedAlipayNotification;
}
