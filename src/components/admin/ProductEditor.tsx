'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductEditorRecord } from '@/lib/admin-products';
import AdminShell from '@/components/admin/AdminShell';
import SidebarCard from '@/components/admin/SidebarCard';

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
  const coverUploadInputRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<ProductEditorRecord>(initialProduct);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: NoticeType; text: string } | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const handleChange = <K extends keyof ProductEditorRecord>(field: K, value: ProductEditorRecord[K]) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    handleChange(
      'tags',
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    );
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
    if (!textarea) {
      return;
    }

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
    if (!file) {
      return;
    }

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
    if (saving) {
      return;
    }

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

  const noticeClassName =
    notice?.type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : notice?.type === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return (
    <AdminShell
        title={isNew ? '新建产品' : '编辑产品'}
        description="维护产品内容、价格、展示信息，以及当前阶段的手动收款配置。"
        hideSidebar={isFocusMode}
        actions={(
            <>
                <button
                    type="button"
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className={`btn ${isFocusMode ? 'btn-tonal text-indigo-700 bg-indigo-50 border-indigo-200' : 'btn-text'} flex items-center gap-1.5`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isFocusMode ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
                        )}
                    </svg>
                    {isFocusMode ? '退出专注' : '专注模式'}
                </button>
                <button type="button" onClick={() => router.push('/admin/products')} className="btn btn-tonal">
                    返回列表
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary disabled:opacity-50"
                >
                    {saving ? '保存中...' : '保存产品'}
                </button>
            </>
        )}
    >
        {notice && (
            <div className={`mb-6 rounded-google-lg border px-4 py-3 text-sm ${noticeClassName}`}>
                {notice.text}
            </div>
        )}

        <div className={`grid grid-cols-1 ${isFocusMode ? 'xl:grid-cols-1' : 'xl:grid-cols-4'} gap-8 transition-all duration-500 ease-in-out`}>
            {/* 左侧主要协作区 */}
            <div className={`${isFocusMode ? 'xl:col-span-1 max-w-5xl mx-auto w-full' : 'xl:col-span-3'} space-y-6 transition-all duration-500`}>
                <div className="admin-card overflow-hidden p-0 shadow-sm border border-surface-200 flex flex-col min-h-[800px]">
                    
                    {/* 顶部工具栏 */}
                    <div className="border-b border-surface-200 px-5 py-4 sm:px-8 bg-surface-50/50">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-sm font-medium text-surface-700">
                                <div className="h-5 w-1.5 rounded-full bg-primary-500"></div>
                                产品详情区
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => insertText('**粗体**')}
                                    className="btn btn-text !px-3 !py-1.5 text-xs text-surface-600 hover:text-surface-900"
                                >
                                    加粗
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertText('*斜体*')}
                                    className="btn btn-text !px-3 !py-1.5 text-xs text-surface-600 hover:text-surface-900"
                                >
                                    斜体
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertText('[链接描述](url)')}
                                    className="btn btn-text !px-3 !py-1.5 text-xs text-surface-600 hover:text-surface-900"
                                >
                                    链接
                                </button>
                                <label className="btn btn-tonal cursor-pointer !px-3 !py-1.5 text-xs">
                                    上传图片
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 大标题输入区 */}
                    <div className="border-b border-surface-100 bg-white px-5 py-6 sm:px-8">
                        <input
                            type="text"
                            value={product.title}
                            onChange={(event) => handleChange('title', event.target.value)}
                            className="w-full border-0 bg-transparent text-3xl md:text-4xl font-bold tracking-tight text-surface-900 placeholder:text-surface-300 focus:outline-none focus:ring-0"
                            placeholder="输入产品名称..."
                        />
                    </div>

                    {/* 价格与摘要栏 (作为编辑器头部的一部分) */}
                    <div className="border-b border-surface-100 bg-surface-50/30 px-5 py-5 sm:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">一句话摘要</label>
                                <textarea
                                    rows={3}
                                    value={product.summary}
                                    onChange={(event) => handleChange('summary', event.target.value)}
                                    className="w-full border-0 bg-transparent p-0 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-0 resize-none leading-relaxed"
                                    placeholder="简短概括产品的核心价值（建议 20-50 字）..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">展示现价文本</label>
                                    <input
                                        type="text"
                                        value={product.priceDisplay}
                                        onChange={(event) => handleChange('priceDisplay', event.target.value)}
                                        className="w-full border-0 bg-transparent p-0 text-lg font-medium text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-0"
                                        placeholder="如: ￥199"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">实际支付金额(分)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={product.priceAmount}
                                        onChange={(event) => handleChange('priceAmount', Number(event.target.value) || 0)}
                                        className="w-full border-0 bg-transparent p-0 text-lg font-medium text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-0"
                                        placeholder="19900"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 正文 Markdown 区 */}
                    <div className="flex-1 bg-white">
                        <textarea
                            ref={textareaRef}
                            value={product.content}
                            onChange={(event) => handleChange('content', event.target.value)}
                            className="h-full min-h-[600px] w-full resize-none border-0 bg-transparent px-5 py-6 font-mono text-[15px] leading-8 text-surface-800 outline-none sm:px-8 focus:ring-0"
                            placeholder={"从这里开始编写产品详情...\n\n支持 Markdown 语法、表格、列表。\n可用顶部【上传图片】按钮插入视觉素材。"}
                        />
                    </div>

                </div>
            </div>

            {/* 右侧边栏 - 属性与设置 */}
            <div className={`space-y-6 xl:col-span-1 transition-all duration-500 ${isFocusMode ? 'opacity-0 hidden' : 'opacity-100'}`}>
                
                {/* 卡片 1：路由与归属 */}
                <SidebarCard title="基础路由" defaultExpanded={true}>
                    <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1.5">URL Slug</label>
                        <div className="flex overflow-hidden rounded-md border border-surface-300 bg-white">
                            <span className="inline-flex items-center border-r border-surface-200 bg-surface-50 px-2 text-xs text-surface-500">
                                /products/
                            </span>
                            <input
                                type="text"
                                value={product.slug}
                                onChange={(event) => handleChange('slug', event.target.value)}
                                disabled={!isNew}
                                className={`min-w-0 flex-1 px-3 py-1.5 text-xs text-surface-900 focus:outline-none ${!isNew ? 'bg-surface-100 text-surface-500' : ''}`}
                                placeholder="your-product-slug"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1.5">展示语言</label>
                        <select
                            value={product.lang}
                            onChange={(event) => handleChange('lang', event.target.value as 'zh' | 'ja')}
                            className="admin-select !py-1.5 !text-xs !rounded-md"
                        >
                            <option value="zh">中文环境 (zh)</option>
                            <option value="ja">日本语环境 (ja)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1.5">标签 (逗号分隔)</label>
                        <input
                            type="text"
                            value={product.tags.join(', ')}
                            onChange={(event) => handleTagsChange(event.target.value)}
                            className="admin-input !py-1.5 !text-xs !rounded-md"
                            placeholder="如: template, notion"
                        />
                    </div>
                </SidebarCard>

                {/* 卡片 2：发布与状态 */}
                <SidebarCard
                    title="发布设定"
                    defaultExpanded={true}
                    extra={
                        <span className={`admin-badge !py-0.5 !px-2 !text-[10px] ${product.published ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-surface-200 bg-surface-100 text-surface-600'}`}>
                            {product.published ? '已上架' : '未上架'}
                        </span>
                    }
                >
                    <label className="flex items-center gap-2 text-sm text-surface-700 cursor-pointer pt-1">
                        <input
                            type="checkbox"
                            checked={product.published}
                            onChange={(event) => handleChange('published', event.target.checked)}
                            className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span>对外公开发布</span>
                    </label>

                    <label className="flex items-center gap-2 text-sm text-surface-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={product.featured}
                            onChange={(event) => handleChange('featured', event.target.checked)}
                            className="rounded border-surface-300 text-amber-500 focus:ring-amber-500"
                        />
                        <span>设为首页推荐</span>
                    </label>
                </SidebarCard>

                {/* 卡片 3：支付与交付 */}
                <SidebarCard title="支付配置" defaultExpanded={false}>
                    <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1.5">支持的支付渠道</label>
                        <div className="space-y-2 mt-2">
                            {PAYMENT_OPTIONS.map((option) => (
                                <label key={option.value} className="flex items-center gap-2 text-xs text-surface-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={product.paymentMethods.includes(option.value)}
                                        onChange={() => handlePaymentMethodToggle(option.value)}
                                        className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1.5">交付资源 URL</label>
                        <input
                            type="text"
                            value={product.fulfillmentUrl}
                            onChange={(event) => handleChange('fulfillmentUrl', event.target.value)}
                            className="admin-input !py-1.5 !text-xs !rounded-md"
                            placeholder="如网盘链接或授权码获取地址"
                        />
                    </div>
                </SidebarCard>

                {/* 卡片 4：视觉与 SEO */}
                <SidebarCard
                    title="视觉与 SEO"
                    defaultExpanded={false}
                    extra={
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                coverUploadInputRef.current?.click();
                            }}
                            className="text-[11px] font-medium text-primary-600 hover:text-primary-800"
                        >
                            上传图
                        </button>
                    }
                >
                    <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1.5">产品封面缩略图</label>
                        <input
                            type="text"
                            value={product.coverImage}
                            onChange={(event) => handleChange('coverImage', event.target.value)}
                            className="admin-input !py-1.5 !text-xs !rounded-md"
                            placeholder="https://..."
                        />
                        <input
                            ref={coverUploadInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('folder', 'products/covers');
                                setNotice({ type: 'info', text: '正在上传封面...' });
                                try {
                                    const res = await fetch('/api/admin/upload', {
                                        method: 'POST',
                                        body: formData,
                                    });
                                    const data = await res.json();
                                    if (res.ok && data.url) {
                                        handleChange('coverImage', data.url);
                                        setNotice({ type: 'success', text: '封面上传成功' });
                                    } else {
                                        throw new Error(data.error || '上传失败');
                                    }
                                } catch (error) {
                                    setNotice({ type: 'error', text: error instanceof Error ? error.message : '上传失败' });
                                }
                                e.target.value = '';
                            }}
                        />
                    </div>

                    {product.coverImage && (
                        <div className="overflow-hidden rounded-md border border-surface-200 bg-surface-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.coverImage}
                                alt="Product Cover"
                                className="h-28 w-full object-cover"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1.5">SEO 标签 (Title)</label>
                        <input
                            type="text"
                            value={product.seoTitle}
                            onChange={(event) => handleChange('seoTitle', event.target.value)}
                            className="admin-input !py-1.5 !text-xs !rounded-md"
                            placeholder="搜索结果显示的标题"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1.5">SEO 描述 (Description)</label>
                        <textarea
                            rows={3}
                            value={product.seoDescription}
                            onChange={(event) => handleChange('seoDescription', event.target.value)}
                            className="admin-textarea !text-xs !rounded-md !p-3"
                            placeholder="引流用的简短说明文字"
                        />
                    </div>
                </SidebarCard>

            </div>
        </div>
    </AdminShell>
  );
}
