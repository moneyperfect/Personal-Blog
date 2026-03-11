'use client';

import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import SidebarCard from '@/components/admin/SidebarCard';
import MarkdownRenderer from '@/components/notes/MarkdownRenderer';

export type LifecycleStatus = 'draft' | 'review' | 'published';

export interface Note {
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
    lifecycleStatus: LifecycleStatus;
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
    url?: string;
    path?: string;
    requestId?: string;
    ok?: boolean;
    message?: string;
    checks?: {
        config?: boolean;
        database?: boolean;
        storage?: boolean;
        schema?: boolean;
    };
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

interface HealthState {
    ok: boolean;
    message: string;
    requestId?: string;
    checks?: {
        config?: boolean;
        database?: boolean;
        storage?: boolean;
        schema?: boolean;
    };
}

type NoticeType = 'success' | 'error' | 'info';
type EditorViewMode = 'split' | 'write' | 'preview';

const RETRYABLE_ERROR_CODES = new Set(['DB_NETWORK_ERROR', 'DB_WRITE_FAILED']);
const MAX_SAVE_RETRY = 2;
const HEALTH_ROUTE = '/api/admin/health';
const CATEGORY_OPTIONS = ['AI', '开发', '产品', '增长', '自动化', '随笔'];
const QUICK_INSERTS = [
    { label: 'H2', value: '\n## 小节标题\n' },
    { label: '引用', value: '\n> 输入你的观点\n' },
    { label: '清单', value: '\n- [ ] 待办事项\n- [ ] 下一步动作\n' },
    { label: '表格', value: '\n| 模块 | 要点 |\n| --- | --- |\n| 示例 | 内容 |\n' },
    { label: '代码块', value: '\n```ts\nconsole.log("hello world");\n```\n' },
];

const EMPTY_NOTE: Note = {
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
    lifecycleStatus: 'draft',
    lang: 'zh',
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeNote(input?: Partial<Note>): Note {
    const lifecycleStatus = input?.lifecycleStatus || (input?.published ? 'published' : 'draft');
    return {
        ...EMPTY_NOTE,
        ...input,
        lifecycleStatus,
        published: lifecycleStatus === 'published',
    };
}

function getDraftStorageKey(isNew: boolean, initialNote?: Note) {
    if (isNew) return 'admin-note-draft:new';
    return `admin-note-draft:${initialNote?.slug || 'existing'}`;
}

export default function Editor({ initialNote, isNew = false }: EditorProps) {
    const router = useRouter();
    const [note, setNote] = useState<Note>(normalizeNote(initialNote));
    const [originalNote, setOriginalNote] = useState<Note>(normalizeNote(initialNote));
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState<{ type: NoticeType; text: string } | null>(null);
    const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
    const [health, setHealth] = useState<HealthState | null>(null);
    const [healthLoading, setHealthLoading] = useState(false);
    const [viewMode, setViewMode] = useState<EditorViewMode>('split');
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isDraggingFiles, setIsDraggingFiles] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const coverUploadInputRef = useRef<HTMLInputElement>(null);
    const draftKeyRef = useRef<string>(getDraftStorageKey(isNew, initialNote));
    const hydratedRef = useRef(false);
    const deferredContent = useDeferredValue(note.content);

    const publishChecklist = [
        { label: '标题长度 >= 8', ok: note.title.trim().length >= 8 },
        { label: '摘要长度 >= 40', ok: note.excerpt.trim().length >= 40 },
        { label: '正文长度 >= 300', ok: note.content.trim().length >= 300 },
        { label: '至少 2 个标签', ok: note.tags.length >= 2 },
        { label: '设置 SEO 标题', ok: note.seoTitle.trim().length > 0 },
        { label: '设置 SEO 描述', ok: note.seoDescription.trim().length > 0 },
    ];

    const checklistPassed = publishChecklist.filter((item) => item.ok).length;
    const checklistComplete = checklistPassed === publishChecklist.length;
    const isPublishing = note.lifecycleStatus === 'published';
    const publishChecklistHint = isPublishing && !checklistComplete
        ? '提示：发布清单未全部完成，仍可继续发布。'
        : null;
    const saveDisabled = saving;
    const wordCount = note.content
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`[^`]*`/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;
    const headingCount = (note.content.match(/^#{1,6}\s+/gm) || []).length;

    const handleChange = (field: keyof Note, value: string | boolean | string[]) => {
        setNote((prev) => {
            if (field === 'lifecycleStatus') {
                const lifecycleStatus = value as LifecycleStatus;
                return {
                    ...prev,
                    lifecycleStatus,
                    published: lifecycleStatus === 'published',
                };
            }

            if (field === 'published') {
                const published = Boolean(value);
                return {
                    ...prev,
                    published,
                    lifecycleStatus: published ? 'published' : 'draft',
                };
            }

            return { ...prev, [field]: value };
        });
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

            setNote(normalizeNote(payload.note));
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

    const fetchHealth = async () => {
        setHealthLoading(true);
        try {
            const res = await fetch(HEALTH_ROUTE);
            const data = (await res.json()) as ApiResponse;
            setHealth({
                ok: Boolean(res.ok && data.ok),
                message: data.message || data.error || '健康检查失败',
                requestId: data.requestId,
                checks: data.checks,
            });
        } catch {
            setHealth({
                ok: false,
                message: '无法连接健康检查接口',
            });
        } finally {
            setHealthLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    const formatTime = (timestamp: number | null) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString();
    };

    const insertText = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const newValue = value.substring(0, start) + text + value.substring(end);
        handleChange('content', newValue);

        requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        });
    };

    const wrapSelection = (before: string, after = '', fallback = '') => {
        const textarea = textareaRef.current;
        if (!textarea) {
            insertText(`${before}${fallback}${after}`);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const selectedText = value.slice(start, end) || fallback;
        const replacement = `${before}${selectedText}${after}`;
        const nextValue = value.slice(0, start) + replacement + value.slice(end);

        handleChange('content', nextValue);

        requestAnimationFrame(() => {
            textarea.focus();
            textarea.selectionStart = start + before.length;
            textarea.selectionEnd = start + before.length + selectedText.length;
        });
    };

    const buildUploadSnippet = (file: File, url: string) => {
        if (file.type.startsWith('image/')) {
            return `\n![${file.name}](${url})\n`;
        }

        return `\n[${file.name}](${url})\n`;
    };

    const uploadFiles = async (files: File[], target: 'content' | 'cover') => {
        if (files.length === 0) return;

        setUploading(true);
        setNotice({
            type: 'info',
            text: target === 'cover'
                ? '正在上传封面素材...'
                : `正在上传 ${files.length} 个素材...`,
        });

        try {
            const uploadedUrls: string[] = [];

            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', target === 'cover' ? 'notes/covers' : 'notes/content');

                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = (await res.json()) as ApiResponse;

                if (!res.ok || !data.success || !data.url) {
                    const requestIdSuffix = data.requestId ? `（请求ID: ${data.requestId}）` : '';
                    throw new Error(`${data.error || '上传失败，请稍后重试。'}${requestIdSuffix}`);
                }

                uploadedUrls.push(data.url);
            }

            if (target === 'cover') {
                handleChange('coverImage', uploadedUrls[0]);
                setNotice({ type: 'success', text: '封面上传成功。' });
                return;
            }

            const snippets = files
                .map((file, index) => buildUploadSnippet(file, uploadedUrls[index]))
                .join('');
            insertText(snippets);
            setNotice({
                type: 'success',
                text: files.length > 1 ? `已插入 ${files.length} 个素材链接。` : '素材上传成功。'
            });
        } catch (error) {
            console.error(error);
            setNotice({
                type: 'error',
                text: error instanceof Error ? error.message : '上传失败，请检查网络后重试。',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleAssetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        await uploadFiles(files, 'content');
        event.target.value = '';
    };

    const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        await uploadFiles(files.slice(0, 1), 'cover');
        event.target.value = '';
    };

    const handleEditorPaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const files = Array.from(event.clipboardData.files || []);
        if (files.length === 0) return;

        event.preventDefault();
        await uploadFiles(files, 'content');
    };

    const handleEditorDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDraggingFiles(false);
        const files = Array.from(event.dataTransfer.files || []);
        await uploadFiles(files, 'content');
    };

    const handleEditorDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isDraggingFiles) {
            setIsDraggingFiles(true);
        }
    };

    const handleEditorDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return;
        }
        setIsDraggingFiles(false);
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
                const requestIdSuffix = data.requestId ? `（请求ID: ${data.requestId}）` : '';
                return {
                    ok: true,
                    message: `保存成功。${requestIdSuffix}`,
                    shouldRetry: false,
                    slug: data.slug,
                };
            }

            const message = `${data.error || '保存失败，请稍后重试。'}${data.requestId ? `（请求ID: ${data.requestId}）` : ''}`;
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
    const showEditorPane = viewMode !== 'preview';
    const showPreviewPane = viewMode !== 'write';

    return (
        <AdminShell
            title={isNew ? '新建笔记' : '编辑笔记'}
            description="把写作、排版、预览和发布检查整合到同一个工作台，减少来回切页。"
            hideSidebar={isFocusMode}
            actions={(
                <div className="flex items-center gap-2">
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
                    <button type="button" onClick={() => router.back()} className="btn btn-tonal">
                        返回
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saveDisabled}
                        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? '保存中...' : note.lifecycleStatus === 'published' ? '保存并发布' : '保存'}
                    </button>
                </div>
            )}
        >
            <input
                ref={uploadInputRef}
                type="file"
                accept="image/*,video/*,audio/*,.pdf,.zip,.md,.txt,.csv,.doc,.docx,.ppt,.pptx"
                multiple
                className="hidden"
                onChange={handleAssetUpload}
            />
            <input
                ref={coverUploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
            />

            <section className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="overflow-hidden rounded-[28px] border border-primary-100 bg-[linear-gradient(135deg,rgba(26,115,232,0.08),rgba(52,168,83,0.06),rgba(255,255,255,0.95))] p-6 shadow-card">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-3">
                            <span className="admin-badge border-primary-100 bg-white/80 text-primary-700">
                                Note Studio
                            </span>
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-surface-900">
                                    更顺手的 Markdown 写作台
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm leading-7 text-surface-700">
                                    支持 GFM、内嵌 HTML、拖拽上传、粘贴图片和实时预览，让后台写作体验更接近现代博客平台。
                                </p>
                            </div>
                        </div>
                        <div className="grid min-w-[220px] grid-cols-2 gap-3 text-sm">
                            <div className="rounded-google-lg border border-white/70 bg-white/80 p-4">
                                <div className="text-xs uppercase tracking-[0.12em] text-surface-500">草稿状态</div>
                                <div className="mt-2 font-semibold text-surface-900">
                                    {draftSavedAt ? `自动保存于 ${formatTime(draftSavedAt)}` : '尚未生成本地草稿'}
                                </div>
                            </div>
                            <div className="rounded-google-lg border border-white/70 bg-white/80 p-4">
                                <div className="text-xs uppercase tracking-[0.12em] text-surface-500">最近保存</div>
                                <div className="mt-2 font-semibold text-surface-900">
                                    {lastSavedAt ? formatTime(lastSavedAt) : '还没有成功保存'}
                                </div>
                            </div>
                            <div className="rounded-google-lg border border-white/70 bg-white/80 p-4">
                                <div className="text-xs uppercase tracking-[0.12em] text-surface-500">正文词数</div>
                                <div className="mt-2 font-semibold text-surface-900">{wordCount}</div>
                            </div>
                            <div className="rounded-google-lg border border-white/70 bg-white/80 p-4">
                                <div className="text-xs uppercase tracking-[0.12em] text-surface-500">结构层级</div>
                                <div className="mt-2 font-semibold text-surface-900">{headingCount} 个标题</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-card space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-surface-900">视图模式</p>
                        <p className="mt-1 text-xs text-surface-500">根据当前工作切换编辑、预览或双栏。</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: 'split', label: '分栏' },
                            { value: 'write', label: '专注写作' },
                            { value: 'preview', label: '专注预览' },
                        ].map((mode) => (
                            <button
                                key={mode.value}
                                type="button"
                                onClick={() => setViewMode(mode.value as EditorViewMode)}
                                className={`rounded-google border px-3 py-2 text-sm font-medium transition-colors ${
                                    viewMode === mode.value
                                        ? 'border-primary-200 bg-primary-50 text-primary-700'
                                        : 'border-surface-200 bg-white text-surface-600 hover:border-primary-100 hover:text-primary-700'
                                }`}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>
                    <div className="rounded-google-lg border border-dashed border-surface-300 bg-surface-50/70 p-4 text-xs leading-6 text-surface-600">
                        小提示：把图片直接拖进编辑区，或者截图后直接粘贴，系统会自动上传并插入 Markdown。
                    </div>
                </div>
            </section>

            {notice && (
                <div className={`mb-6 rounded-google-lg border px-4 py-3 text-sm ${noticeClassName}`}>
                    {notice.text}
                </div>
            )}

            <div className={`grid grid-cols-1 ${isFocusMode ? 'xl:grid-cols-1' : 'xl:grid-cols-4'} gap-8 transition-all duration-500 ease-in-out`}>
                {/* 左侧主栏 - 沉浸式写作区 */}
                <div className={`${isFocusMode ? 'xl:col-span-1 max-w-6xl mx-auto w-full' : 'xl:col-span-3'} space-y-6 transition-all duration-500`}>
                    <div className="admin-card overflow-hidden p-0 shadow-sm border border-surface-200 flex flex-col min-h-[800px]">
                        {/* 顶部工具栏 */}
                        <div className="border-b border-surface-200 px-5 py-4 sm:px-8 bg-surface-50/50">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-sm font-medium text-surface-700">
                                    <div className="h-5 w-1.5 rounded-full bg-primary-500"></div>
                                    Markdown 工作台
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => wrapSelection('**', '**', '加粗内容')}
                                        className="btn btn-text !px-3 !py-1.5 text-xs text-surface-600 hover:text-surface-900"
                                    >
                                        加粗
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => wrapSelection('*', '*', '强调内容')}
                                        className="btn btn-text !px-3 !py-1.5 text-xs text-surface-600 hover:text-surface-900"
                                    >
                                        斜体
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => wrapSelection('[', '](https://example.com)', '链接标题')}
                                        className="btn btn-text !px-3 !py-1.5 text-xs text-surface-600 hover:text-surface-900"
                                    >
                                        链接
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => uploadInputRef.current?.click()}
                                        className="btn btn-tonal !px-3 !py-1.5 text-xs"
                                    >
                                        上传素材
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {QUICK_INSERTS.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => insertText(item.value)}
                                        className="chip !py-1 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 大标题输入区 */}
                        <div className="border-b border-surface-100 bg-white px-5 py-6 sm:px-8">
                            <input
                                type="text"
                                value={note.title}
                                onChange={(event) => handleChange('title', event.target.value)}
                                className="w-full border-0 bg-transparent text-3xl md:text-4xl font-bold tracking-tight text-surface-900 placeholder:text-surface-300 focus:outline-none focus:ring-0"
                                placeholder="输入引人入胜的文章标题..."
                            />
                        </div>

                        {/* 编辑与预览区 (支持拖拽上传) */}
                        <div
                            className={`relative flex-1 ${showEditorPane && showPreviewPane ? 'grid xl:grid-cols-2' : ''}`}
                            onDrop={handleEditorDrop}
                            onDragOver={handleEditorDragOver}
                            onDragLeave={handleEditorDragLeave}
                        >
                            {isDraggingFiles && (
                                <div className="pointer-events-none absolute inset-4 z-10 rounded-[28px] border-2 border-dashed border-primary-300 bg-primary-50/85 flex items-center justify-center">
                                    <span className="text-lg font-medium text-primary-700">松开鼠标上传图片/附件</span>
                                </div>
                            )}

                            {showEditorPane && (
                                <div className="bg-white xl:border-r border-surface-200">
                                    {showEditorPane && showPreviewPane && (
                                        <div className="flex items-center justify-between border-b border-surface-100 px-5 py-2 text-xs text-surface-400 bg-surface-50/50 sm:px-8">
                                            <span>Markdown 编辑区</span>
                                            <span>支持拖拽粘贴图片</span>
                                        </div>
                                    )}
                                    <textarea
                                        ref={textareaRef}
                                        value={note.content}
                                        onChange={(event) => handleChange('content', event.target.value)}
                                        onPaste={handleEditorPaste}
                                        className="h-full min-h-[600px] w-full resize-none border-0 bg-transparent px-5 py-6 font-mono text-[15px] leading-8 text-surface-800 outline-none sm:px-8 focus:ring-0"
                                        placeholder={'从这里开始写作...\n\n支持 Markdown 语法、表格、代码块。\n您可以直接粘贴截图或拖拽图片到这里上传。'}
                                    />
                                </div>
                            )}

                            {showPreviewPane && (
                                <div className="bg-surface-50/30">
                                    {showEditorPane && showPreviewPane && (
                                        <div className="flex items-center justify-between border-b border-surface-100 px-5 py-2 text-xs text-surface-400 bg-surface-50/50 sm:px-8">
                                            <span>实时预览</span>
                                        </div>
                                    )}
                                    <div className="h-full min-h-[600px] px-5 py-6 sm:px-8">
                                        {deferredContent.trim() ? (
                                            <MarkdownRenderer content={deferredContent} />
                                        ) : (
                                            <div className="flex h-full min-h-[300px] items-center justify-center rounded-[24px] border border-dashed border-surface-200 bg-surface-50/50 px-6 text-center text-sm leading-7 text-surface-400">
                                                实时预览区
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 右侧边栏 - 属性与设置 */}
                <div className={`space-y-6 xl:col-span-1 transition-all duration-500 ${isFocusMode ? 'opacity-0 hidden' : 'opacity-100'}`}>
                    {/* 卡片 1：基础设置 */}
                    <SidebarCard title="基本信息" defaultExpanded={true}>
                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">URL Slug</label>
                            <div className="flex overflow-hidden rounded-md border border-surface-300 bg-white">
                                <span className="inline-flex items-center border-r border-surface-200 bg-surface-50 px-2 text-xs text-surface-500">
                                    /notes/
                                </span>
                                <input
                                    type="text"
                                    value={note.slug}
                                    onChange={(event) => handleChange('slug', event.target.value)}
                                    disabled={!isNew}
                                    className={`min-w-0 flex-1 px-3 py-1.5 text-xs text-surface-900 focus:outline-none ${!isNew ? 'bg-surface-100 text-surface-500' : ''}`}
                                    placeholder="your-slug"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">分类</label>
                                <select
                                    value={note.category}
                                    onChange={(event) => handleChange('category', event.target.value)}
                                    className="admin-select !py-1.5 !text-xs !rounded-md"
                                >
                                    <option value="">未分类</option>
                                    {CATEGORY_OPTIONS.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-surface-600 mb-1.5">语言</label>
                                <select
                                    value={note.lang}
                                    onChange={(event) => handleChange('lang', event.target.value as 'zh' | 'ja')}
                                    className="admin-select !py-1.5 !text-xs !rounded-md"
                                >
                                    <option value="zh">中文</option>
                                    <option value="ja">日语</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">核心摘要</label>
                            <textarea
                                rows={4}
                                value={note.excerpt}
                                onChange={(event) => handleChange('excerpt', event.target.value)}
                                className="admin-textarea !text-xs !rounded-md !p-3"
                                placeholder="输入几句话概括笔记核心..."
                            />
                        </div>
                    </SidebarCard>

                    {/* 卡片 2：发布与状态 */}
                    <SidebarCard
                        title="发布状态"
                        defaultExpanded={true}
                        extra={
                            <span className={`admin-badge !py-0.5 !px-2 !text-[10px] ${note.lifecycleStatus === 'published' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}`}>
                                {note.lifecycleStatus === 'published' ? '公开' : note.lifecycleStatus === 'review' ? '待审' : '草稿'}
                            </span>
                        }
                    >
                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">状态设定</label>
                            <select
                                value={note.lifecycleStatus}
                                onChange={(event) => handleChange('lifecycleStatus', event.target.value as LifecycleStatus)}
                                className="admin-select !py-1.5 !text-xs !rounded-md"
                            >
                                <option value="draft">草稿（仅后台可见）</option>
                                <option value="review">待审核（仅后台可见）</option>
                                <option value="published">已发布（对外公开）</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">标签 (逗号分隔)</label>
                            <input
                                type="text"
                                value={note.tags.join(', ')}
                                onChange={handleTagsChange}
                                className="admin-input !py-1.5 !text-xs !rounded-md"
                                placeholder="如: AI, 效率"
                            />
                        </div>

                        <div className="pt-2">
                            <h4 className="text-[11px] font-semibold text-surface-500 mb-2 uppercase tracking-wider">发布清单 ({checklistPassed}/{publishChecklist.length})</h4>
                            <ul className="space-y-1.5">
                                {publishChecklist.map((item) => (
                                    <li key={item.label} className="flex items-center justify-between text-[11px]">
                                        <span className={item.ok ? 'text-emerald-700' : 'text-surface-500'}>{item.label}</span>
                                        <span className={item.ok ? 'text-emerald-600' : 'text-surface-300'}>
                                            {item.ok ? '✓' : '○'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </SidebarCard>

                    {/* 卡片 3：视觉与 SEO */}
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
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">封面图片 URL</label>
                            <input
                                type="text"
                                value={note.coverImage}
                                onChange={(event) => handleChange('coverImage', event.target.value)}
                                className="admin-input !py-1.5 !text-xs !rounded-md"
                                placeholder="https://..."
                            />
                        </div>

                        {note.coverImage && (
                            <div className="overflow-hidden rounded-md border border-surface-200 bg-surface-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={note.coverImage}
                                    alt="Cover"
                                    className="h-28 w-full object-cover"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">SEO 标题</label>
                            <input
                                type="text"
                                value={note.seoTitle}
                                onChange={(event) => handleChange('seoTitle', event.target.value)}
                                className="admin-input !py-1.5 !text-xs !rounded-md"
                                placeholder="搜索引擎展示标题"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-600 mb-1.5">SEO 描述</label>
                            <textarea
                                rows={3}
                                value={note.seoDescription}
                                onChange={(event) => handleChange('seoDescription', event.target.value)}
                                className="admin-textarea !text-xs !rounded-md !p-3"
                                placeholder="搜索引擎提要..."
                            />
                        </div>
                    </SidebarCard>

                    {/* 健康检查轻量化展示 */}
                    <div className="rounded-xl border border-surface-200 bg-surface-50/50 p-4 shadow-sm flex items-center justify-between">
                        <div className="text-xs">
                            <span className="font-semibold text-surface-700">系统状态</span>
                            <span className={`ml-2 ${health?.ok ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {healthLoading ? '检测中...' : health?.ok ? '正常通行' : '可能异常'}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={fetchHealth}
                            disabled={healthLoading}
                            className="text-surface-400 hover:text-surface-700 disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
