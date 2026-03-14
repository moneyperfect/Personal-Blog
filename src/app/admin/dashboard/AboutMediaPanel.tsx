'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type MediaKind = 'avatar' | 'portrait';

interface AboutMediaResponse {
    media?: {
        avatarUrl?: string | null;
        portraitUrl?: string | null;
        updatedAt?: string | null;
    };
    error?: string;
}

const ALLOWED_MEDIA_TYPES = ['image/webp', 'image/jpeg', 'image/png'];

const SLOT_META: Record<MediaKind, { label: string; ratio: string; recommendation: string }> = {
    avatar: {
        label: '头像',
        ratio: '1:1',
        recommendation: '建议使用 WebP，最少 800 x 800，适合作为 Hero 区圆形头像。',
    },
    portrait: {
        label: '个人照片',
        ratio: '4:5',
        recommendation: '建议使用 WebP，至少 1200 x 1500，适合作为 About 照片卡展示。',
    },
};

function formatTimestamp(value: string | null | undefined) {
    if (!value) return '尚未保存';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '尚未保存';
    }

    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function AboutMediaPanel() {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const portraitInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingKind, setUploadingKind] = useState<MediaKind | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [draft, setDraft] = useState({
        avatarUrl: '',
        portraitUrl: '',
        updatedAt: null as string | null,
    });

    useEffect(() => {
        const loadMedia = async () => {
            try {
                const response = await fetch('/api/admin/about-media');
                const data = (await response.json()) as AboutMediaResponse;

                if (!response.ok) {
                    throw new Error(data.error || '读取 About 图片配置失败。');
                }

                setDraft({
                    avatarUrl: data.media?.avatarUrl || '',
                    portraitUrl: data.media?.portraitUrl || '',
                    updatedAt: data.media?.updatedAt || null,
                });
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : '读取 About 图片配置失败。');
            } finally {
                setLoading(false);
            }
        };

        void loadMedia();
    }, []);

    const handleUpload = async (kind: MediaKind, file: File | null) => {
        if (!file) {
            return;
        }

        setStatusMessage(null);
        setErrorMessage(null);

        if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
            setErrorMessage('只支持 WebP、JPEG 或 PNG。请重新选择图片。');
            return;
        }

        setUploadingKind(kind);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', 'blog-assets');
            formData.append('folder', 'about/profile');

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.url) {
                throw new Error(data.error || '上传失败，请稍后重试。');
            }

            setDraft((current) => ({
                ...current,
                avatarUrl: kind === 'avatar' ? data.url : current.avatarUrl,
                portraitUrl: kind === 'portrait' ? data.url : current.portraitUrl,
            }));
            setStatusMessage(`${SLOT_META[kind].label}已上传完成，确认无误后记得点击保存。`);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '上传失败，请稍后重试。');
        } finally {
            setUploadingKind(null);

            if (kind === 'avatar' && avatarInputRef.current) {
                avatarInputRef.current.value = '';
            }

            if (kind === 'portrait' && portraitInputRef.current) {
                portraitInputRef.current.value = '';
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatusMessage(null);
        setErrorMessage(null);

        try {
            const response = await fetch('/api/admin/about-media', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    avatarUrl: draft.avatarUrl,
                    portraitUrl: draft.portraitUrl,
                }),
            });

            const data = (await response.json()) as AboutMediaResponse;

            if (!response.ok) {
                throw new Error(data.error || '保存 About 图片配置失败。');
            }

            setDraft((current) => ({
                ...current,
                avatarUrl: data.media?.avatarUrl || '',
                portraitUrl: data.media?.portraitUrl || '',
                updatedAt: data.media?.updatedAt || null,
            }));
            setStatusMessage('About 页头像与个人照片已保存，前台刷新后会读取最新资源。');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '保存 About 图片配置失败。');
        } finally {
            setSaving(false);
        }
    };

    const renderMediaSlot = (kind: MediaKind) => {
        const slot = SLOT_META[kind];
        const url = kind === 'avatar' ? draft.avatarUrl : draft.portraitUrl;

        return (
            <div key={kind} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">{slot.label}</h3>
                        <p className="mt-1 text-xs text-slate-500">建议比例 {slot.ratio}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => (kind === 'avatar' ? avatarInputRef.current : portraitInputRef.current)?.click()}
                        className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={uploadingKind !== null || loading}
                    >
                        {uploadingKind === kind ? '上传中...' : `上传${slot.label}`}
                    </button>
                </div>

                <input
                    ref={kind === 'avatar' ? avatarInputRef : portraitInputRef}
                    type="file"
                    accept="image/webp,image/jpeg,image/png"
                    className="hidden"
                    onChange={(event) => void handleUpload(kind, event.target.files?.[0] || null)}
                />

                <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
                    {url ? (
                        <Image
                            src={url}
                            alt={`${slot.label}预览`}
                            width={kind === 'avatar' ? 800 : 1200}
                            height={kind === 'avatar' ? 800 : 1500}
                            className={`block h-auto w-full object-cover ${kind === 'avatar' ? 'aspect-square' : 'aspect-[4/5]'}`}
                            unoptimized
                        />
                    ) : (
                        <div
                            className={`flex w-full items-center justify-center bg-slate-100 text-sm text-slate-400 ${
                                kind === 'avatar' ? 'aspect-square' : 'aspect-[4/5]'
                            }`}
                        >
                            暂未上传
                        </div>
                    )}
                </div>

                <p className="mt-3 text-xs leading-6 text-slate-500">{slot.recommendation}</p>
                <button
                    type="button"
                    onClick={() =>
                        setDraft((current) => ({
                            ...current,
                            avatarUrl: kind === 'avatar' ? '' : current.avatarUrl,
                            portraitUrl: kind === 'portrait' ? '' : current.portraitUrl,
                        }))
                    }
                    className="mt-3 text-xs font-medium text-slate-500 transition hover:text-slate-900"
                >
                    清空并回退到站内默认图
                </button>
            </div>
        );
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">About 图片上传</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        这轮只接入头像和个人照片。作品图、游戏爱好、偏好图片继续走站内静态资源，避免后台改动范围过大。
                    </p>
                </div>
                <div className="text-xs text-slate-400">最近保存：{formatTimestamp(draft.updatedAt)}</div>
            </div>

            {loading ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                    正在读取 About 图片配置...
                </div>
            ) : (
                <div className="mt-6 grid gap-4 lg:grid-cols-2">{(['avatar', 'portrait'] as MediaKind[]).map(renderMediaSlot)}</div>
            )}

            {errorMessage ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                </div>
            ) : null}

            {statusMessage ? (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {statusMessage}
                </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <p className="text-xs leading-6 text-slate-500">
                    格式要求：头像建议 1:1，最少 800 x 800；个人照片建议 4:5，最少 1200 x 1500。首轮不做在线裁剪，请尽量在上传前处理好比例。
                </p>
                <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={loading || saving}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? '保存中...' : '保存 About 图片配置'}
                </button>
            </div>
        </section>
    );
}
