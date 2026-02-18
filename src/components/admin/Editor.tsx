'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Note {
    id?: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    tags: string[];
    excerpt: string;
    coverImage: string;
    seoTitle: string;
    seoDescription: string;
    published: boolean;
    lang: 'zh' | 'ja';
}

interface EditorProps {
    initialNote?: Note;
    isNew?: boolean;
}

interface ApiResponse {
    success?: boolean;
    error?: string;
    code?: string;
    slug?: string;
}

interface SaveAttemptResult {
    ok: boolean;
    message: string;
    shouldRetry: boolean;
    slug?: string;
}

interface DraftPayload {
    note: Note;
    savedAt: number;
}

type NoticeType = 'success' | 'error' | 'info';

const RETRYABLE_ERROR_CODES = new Set(['DB_NETWORK_ERROR', 'DB_WRITE_FAILED']);
const MAX_SAVE_RETRY = 2;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDraftStorageKey(isNew: boolean, initialNote?: Note) {
    if (isNew) return 'admin-note-draft:new';
    return `admin-note-draft:${initialNote?.slug || 'existing'}`;
}

export default function Editor({ initialNote, isNew = false }: EditorProps) {
    const router = useRouter();
    const [note, setNote] = useState<Note>(initialNote || {
        title: '',
        slug: '',
        category: '',
        content: '',
        tags: [],
        excerpt: '',
        coverImage: '',
        seoTitle: '',
        seoDescription: '',
        published: false,
        lang: 'zh',
    });
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState<{ type: NoticeType; text: string } | null>(null);
    const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const draftKeyRef = useRef<string>(getDraftStorageKey(isNew, initialNote));
    const hydratedRef = useRef(false);

    const publishChecklist = [
        { label: '标题长度 >= 8', ok: note.title.trim().length >= 8 },
        { label: '摘要长度 >= 40', ok: note.excerpt.trim().length >= 40 },
        { label: '正文长度 >= 300', ok: note.content.trim().length >= 300 },
        { label: '至少 2 个标签', ok: note.tags.length >= 2 },
        { label: '设置 SEO 标题', ok: note.seoTitle.trim().length > 0 },
        { label: '设置 SEO 描述', ok: note.seoDescription.trim().length > 0 },
    ];

    const checklistPassed = publishChecklist.filter((item) => item.ok).length;

    const handleChange = (field: keyof Note, value: string | boolean | string[]) => {
        setNote((prev) => ({ ...prev, [field]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
        setNote((prev) => ({ ...prev, tags }));
    };

    useEffect(() => {
        const draftKey = draftKeyRef.current;
        const raw = window.localStorage.getItem(draftKey);
        if (!raw) {
            hydratedRef.current = true;
            return;
        }

        try {
            const payload = JSON.parse(raw) as DraftPayload;
            if (!payload?.note) {
                hydratedRef.current = true;
                return;
            }

            if (!isNew && initialNote && payload.note.slug !== initialNote.slug) {
                hydratedRef.current = true;
                return;
            }

            setNote(payload.note);
            setDraftSavedAt(payload.savedAt ?? null);
            setNotice({ type: 'info', text: '已恢复上次未保存草稿。' });
        } catch {
            window.localStorage.removeItem(draftKey);
        } finally {
            hydratedRef.current = true;
        }
    }, [initialNote, isNew]);

    useEffect(() => {
        if (!hydratedRef.current) return;

        const timer = window.setTimeout(() => {
            const payload: DraftPayload = {
                note,
                savedAt: Date.now(),
            };
            window.localStorage.setItem(draftKeyRef.current, JSON.stringify(payload));
            setDraftSavedAt(payload.savedAt);
        }, 800);

        return () => window.clearTimeout(timer);
    }, [note]);

    const formatTime = (timestamp: number | null) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        setNotice({ type: 'info', text: '图片上传中...' });

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = (await res.json()) as ApiResponse & { url?: string };

            if (!res.ok || !data.success || !data.url) {
                setNotice({ type: 'error', text: data.error || '图片上传失败，请稍后重试。' });
                return;
            }

            insertText(`\n![${file.name}](${data.url})\n`);
            setNotice({ type: 'success', text: '图片上传成功。' });
        } catch (err) {
            console.error(err);
            setNotice({ type: 'error', text: '图片上传失败，请检查网络后重试。' });
        }
    };

    const insertText = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const newValue = value.substring(0, start) + text + value.substring(end);
        handleChange('content', newValue);

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const saveOnce = async (): Promise<SaveAttemptResult> => {
        try {
            const res = await fetch('/api/admin/notes/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note, isNew }),
            });
            const data = (await res.json()) as ApiResponse;

            if (res.ok && data.success) {
                return {
                    ok: true,
                    message: '保存成功。',
                    shouldRetry: false,
                    slug: data.slug,
                };
            }

            const message = data.error || '保存失败，请稍后重试。';
            const shouldRetry = res.status >= 500 || RETRYABLE_ERROR_CODES.has(data.code || '');

            return {
                ok: false,
                message,
                shouldRetry,
            };
        } catch (error) {
            console.error('Save request failed:', error);
            return {
                ok: false,
                message: '保存失败：请求未完成，请检查网络后重试。',
                shouldRetry: true,
            };
        }
    };

    const handleSave = async () => {
        if (saving) return;

        if (!note.title.trim() || !note.slug.trim()) {
            setNotice({ type: 'error', text: '标题和 Slug 必填。' });
            return;
        }

        setSaving(true);
        setNotice({ type: 'info', text: '保存中...' });

        let result: SaveAttemptResult = {
            ok: false,
            message: '保存失败，请稍后重试。',
            shouldRetry: false,
        };

        for (let attempt = 0; attempt <= MAX_SAVE_RETRY; attempt += 1) {
            result = await saveOnce();
            if (result.ok) break;

            const canRetry = result.shouldRetry && attempt < MAX_SAVE_RETRY;
            if (!canRetry) break;

            setNotice({
                type: 'info',
                text: `保存失败，正在第 ${attempt + 1} 次重试...`,
            });
            await sleep(500 * (attempt + 1));
        }

        if (result.ok) {
            window.localStorage.removeItem(draftKeyRef.current);
            setDraftSavedAt(null);
            setLastSavedAt(Date.now());
            setNotice({ type: 'success', text: result.message });

            if (isNew && result.slug) {
                router.push(`/admin/editor/${result.slug}`);
            }
        } else {
            setNotice({ type: 'error', text: result.message });
        }

        setSaving(false);
    };

    const noticeClassName = notice?.type === 'error'
        ? 'border-red-200 bg-red-50 text-red-700'
        : notice?.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-blue-200 bg-blue-50 text-blue-700';

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{isNew ? '新建笔记' : '编辑笔记'}</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                    >
                        {saving ? '保存中...' : '保存'}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
                <span>
                    草稿{draftSavedAt ? `已自动保存于 ${formatTime(draftSavedAt)}` : '尚未保存'}
                </span>
                <span>
                    {lastSavedAt ? `最后成功保存：${formatTime(lastSavedAt)}` : ''}
                </span>
            </div>

            {notice && (
                <div className={`mb-6 rounded-md border px-3 py-2 text-sm ${noticeClassName}`}>
                    {notice.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">标题</label>
                        <input
                            type="text"
                            value={note.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="输入文章标题"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                /notes/
                            </span>
                            <input
                                type="text"
                                value={note.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                disabled={!isNew}
                                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 ${!isNew ? 'bg-gray-100' : ''}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">摘要 (Excerpt)</label>
                        <textarea
                            rows={3}
                            value={note.excerpt}
                            onChange={(e) => handleChange('excerpt', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="简短的摘要..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">封面图 URL</label>
                            <input
                                type="text"
                                value={note.coverImage}
                                onChange={(e) => handleChange('coverImage', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SEO 标题</label>
                            <input
                                type="text"
                                value={note.seoTitle}
                                onChange={(e) => handleChange('seoTitle', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="搜索结果显示标题（建议 25-60 字）"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">SEO 描述</label>
                        <textarea
                            rows={2}
                            value={note.seoDescription}
                            onChange={(e) => handleChange('seoDescription', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="搜索结果摘要（建议 70-160 字）"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">正文 (Markdown)</label>
                            <div className="space-x-2">
                                <button type="button" onClick={() => insertText('**粗体**')} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">B</button>
                                <button type="button" onClick={() => insertText('*斜体*')} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">I</button>
                                <button type="button" onClick={() => insertText('[链接](url)')} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">Link</button>
                                <label className="px-2 py-1 text-xs border rounded hover:bg-gray-50 cursor-pointer inline-block">
                                    Image
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                        <textarea
                            ref={textareaRef}
                            rows={20}
                            value={note.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono"
                            placeholder="# Hello World"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">发布设置</h3>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="published"
                                        type="checkbox"
                                        checked={note.published}
                                        onChange={(e) => handleChange('published', e.target.checked)}
                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="published" className="font-medium text-gray-700">已发布</label>
                                    <p className="text-gray-500">勾选后将公开显示。</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">语言</label>
                                <select
                                    value={note.lang}
                                    onChange={(e) => handleChange('lang', e.target.value as 'zh' | 'ja')}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                >
                                    <option value="zh">中文</option>
                                    <option value="ja">日语</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">分类</label>
                                <select
                                    value={note.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                >
                                    <option value="">未分类</option>
                                    <option value="AI">AI</option>
                                    <option value="开发">开发</option>
                                    <option value="随笔">随笔</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">标签 (逗号分隔)</label>
                                <input
                                    type="text"
                                    value={note.tags.join(', ')}
                                    onChange={handleTagsChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="nextjs, supabase, blog"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3">发布检查清单</h3>
                        <p className="text-xs text-gray-500 mb-3">
                            {`完成 ${checklistPassed}/${publishChecklist.length} 项`}
                        </p>
                        <ul className="space-y-2">
                            {publishChecklist.map((item) => (
                                <li key={item.label} className="flex items-center justify-between text-sm">
                                    <span className={item.ok ? 'text-emerald-700' : 'text-gray-600'}>
                                        {item.label}
                                    </span>
                                    <span className={item.ok ? 'text-emerald-600' : 'text-gray-400'}>
                                        {item.ok ? '已完成' : '待完成'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
