'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Note {
    id?: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    tags: string[];
    excerpt: string;
    published: boolean;
    lang: 'zh' | 'ja';
}

interface EditorProps {
    initialNote?: Note;
    isNew?: boolean;
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
        published: false,
        lang: 'zh',
    });
    const [saving, setSaving] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-generate slug from title if new and slug is empty
    useEffect(() => {
        if (isNew && !note.slug && note.title) {
            // Simple slugify: replace spaces/specials with dashes, lowercase
            // For Chinese, pinyin would be better but simple ID/timestamp works too.
            // Let's just use timestamp if title is non-ascii, or slugify if ascii.
            // Or leave it empty for user to fill.
        }
    }, [note.title, isNew, note.slug]);

    const handleChange = (field: keyof Note, value: any) => {
        setNote(prev => ({ ...prev, [field]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
        setNote(prev => ({ ...prev, tags }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                insertText(`\n![${file.name}](${data.url})\n`);
            } else {
                alert('上传失败: ' + data.error);
            }
        } catch (err) {
            console.error(err);
            alert('上传出错');
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

        // Restore selection/cursor
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/notes/save', { // We need to create this API
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note, isNew }),
            });
            const data = await res.json();
            if (data.success) {
                alert('保存成功');
                if (isNew) {
                    router.push(`/admin/editor/${data.slug}`);
                }
            } else {
                alert('保存失败: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('保存出错');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
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

                    {/* Slug */}
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
                                disabled={!isNew} // Slug shouldn't change easily for existing posts to avoid breaking links, can enable if needed
                                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 ${!isNew ? 'bg-gray-100' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Summary */}
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

                    {/* Content Editor */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">正文 (Markdown)</label>
                            <div className="space-x-2">
                                {/* Toolbar buttons */}
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
                    {/* Meta Sidebar */}
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">发布设置</h3>

                        <div className="space-y-4">
                            {/* Status */}
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

                            {/* Language */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">语言</label>
                                <select
                                    value={note.lang}
                                    onChange={(e) => handleChange('lang', e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                >
                                    <option value="zh">中文</option>
                                    <option value="ja">日语</option>
                                </select>
                            </div>

                            {/* Category */}
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
                                    {/* Add other categories */}
                                </select>
                            </div>

                            {/* Tags */}
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
                </div>
            </div>
        </div>
    );
}
