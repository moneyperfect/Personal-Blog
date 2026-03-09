'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductEditorRecord } from '@/lib/admin-products';

interface ProductEditorProps {
  initialProduct: ProductEditorRecord;
  isNew?: boolean;
}

interface SaveResponse {
  success?: boolean;
  error?: string;
  slug?: string;
  lang?: string;
  url?: string;
}

type NoticeType = 'success' | 'error' | 'info';

const PAYMENT_OPTIONS = [
  { value: 'wechat', label: '微信支付' },
  { value: 'alipay', label: '支付宝' },
];

export default function ProductEditor({ initialProduct, isNew = false }: ProductEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [product, setProduct] = useState<ProductEditorRecord>(initialProduct);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: NoticeType; text: string } | null>(null);

  const handleChange = <K extends keyof ProductEditorRecord>(field: K, value: ProductEditorRecord[K]) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    handleChange('tags', value.split(',').map((tag) => tag.trim()).filter(Boolean));
  };

  const handlePaymentMethodToggle = (method: string) => {
    const current = new Set(product.paymentMethods);
    if (current.has(method)) {
      current.delete(method);
    } else {
      current.add(method);
    }

    handleChange('paymentMethods', Array.from(current));
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = textarea.value.slice(0, start) + text + textarea.value.slice(end);
    handleChange('content', nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setNotice({ type: 'info', text: '图片上传中...' });

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json()) as SaveResponse;

      if (!response.ok || !data.url) {
        setNotice({ type: 'error', text: data.error || '图片上传失败。' });
        return;
      }

      insertText(`\n![${file.name}](${data.url})\n`);
      setNotice({ type: 'success', text: '图片上传成功。' });
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: '图片上传失败。' });
    }
  };

  const handleSave = async () => {
    if (saving) return;

    if (!product.title.trim() || !product.slug.trim()) {
      setNotice({ type: 'error', text: '标题和 Slug 为必填项。' });
      return;
    }

    setSaving(true);
    setNotice({ type: 'info', text: '保存中...' });

    try {
      const response = await fetch('/api/admin/products/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, isNew }),
      });
      const data = (await response.json()) as SaveResponse;

      if (!response.ok || !data.success || !data.slug || !data.lang) {
        setNotice({ type: 'error', text: data.error || '保存产品失败。' });
        return;
      }

      setNotice({ type: 'success', text: '产品保存成功。' });
      router.push(`/admin/products/editor/${data.slug}?lang=${data.lang}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setNotice({ type: 'error', text: '保存产品失败，请稍后重试。' });
    } finally {
      setSaving(false);
    }
  };

  const noticeClassName = notice?.type === 'error'
    ? 'border-red-200 bg-red-50 text-red-700'
    : notice?.type === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-blue-200 bg-blue-50 text-blue-700';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? '新建产品' : '编辑产品'}</h1>
          <p className="text-sm text-gray-500 mt-1">支持中日双语、支付方式配置与交付链接管理。</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white"
          >
            返回列表
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存产品'}
          </button>
        </div>
      </div>

      {notice && (
        <div className={`mb-6 rounded-md border px-3 py-2 text-sm ${noticeClassName}`}>
          {notice.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">标题</label>
              <input
                type="text"
                value={product.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                placeholder="输入产品标题"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  value={product.slug}
                  onChange={(event) => handleChange('slug', event.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  placeholder="product-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">语言</label>
                <select
                  value={product.lang}
                  onChange={(event) => handleChange('lang', event.target.value as 'zh' | 'ja')}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                >
                  <option value="zh">中文</option>
                  <option value="ja">日语</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">摘要</label>
              <textarea
                rows={3}
                value={product.summary}
                onChange={(event) => handleChange('summary', event.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                placeholder="一句话介绍产品价值"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">价格展示文案</label>
                <input
                  type="text"
                  value={product.priceDisplay}
                  onChange={(event) => handleChange('priceDisplay', event.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  placeholder="¥199"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">价格金额（分）</label>
                <input
                  type="number"
                  min={0}
                  value={product.priceAmount}
                  onChange={(event) => handleChange('priceAmount', Number(event.target.value) || 0)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  placeholder="19900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">正文（Markdown）</label>
              <div className="flex flex-wrap gap-2 my-2">
                <button type="button" onClick={() => insertText('**粗体**')} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">B</button>
                <button type="button" onClick={() => insertText('*斜体*')} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">I</button>
                <button type="button" onClick={() => insertText('[链接](url)')} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Link</button>
                <label className="px-2 py-1 text-xs border rounded hover:bg-gray-50 cursor-pointer">
                  Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <textarea
                ref={textareaRef}
                rows={20}
                value={product.content}
                onChange={(event) => handleChange('content', event.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm font-mono"
                placeholder="# 产品内容"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">发布与支付</h3>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={product.published}
                onChange={(event) => handleChange('published', event.target.checked)}
              />
              发布到前台
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={product.featured}
                onChange={(event) => handleChange('featured', event.target.checked)}
              />
              设为首页推荐
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700">支付方式</label>
              <div className="mt-2 space-y-2">
                {PAYMENT_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={product.paymentMethods.includes(option.value)}
                      onChange={() => handlePaymentMethodToggle(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">交付链接</label>
              <input
                type="text"
                value={product.fulfillmentUrl}
                onChange={(event) => handleChange('fulfillmentUrl', event.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                placeholder="支付成功后展示的下载或交付地址"
              />
            </div>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">SEO 与展示</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">封面图</label>
              <input
                type="text"
                value={product.coverImage}
                onChange={(event) => handleChange('coverImage', event.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SEO 标题</label>
              <input
                type="text"
                value={product.seoTitle}
                onChange={(event) => handleChange('seoTitle', event.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                placeholder="搜索结果标题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SEO 描述</label>
              <textarea
                rows={3}
                value={product.seoDescription}
                onChange={(event) => handleChange('seoDescription', event.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                placeholder="搜索结果描述"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">标签（逗号分隔）</label>
              <input
                type="text"
                value={product.tags.join(', ')}
                onChange={(event) => handleTagsChange(event.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                placeholder="prompt, ai, template"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
