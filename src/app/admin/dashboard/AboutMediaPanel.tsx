'use client';

import { useEffect, useMemo, useState } from 'react';

const STATIC_AVATAR_PATH = '/about/avatar-nas.jpg';
const STATIC_PORTRAIT_PATH = '/about/portrait-intj.png';

interface AboutMediaResponse {
    media?: {
        portraitUrl?: string | null;
        updatedAt?: string | null;
    };
    error?: string;
}

export default function AboutMediaPanel() {
    const [portraitUrl, setPortraitUrl] = useState('');
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/admin/about-media');
                const data = (await response.json()) as AboutMediaResponse;

                if (!response.ok) {
                    throw new Error(data.error || '读取 About 媒体配置失败。');
                }

                if (!active) {
                    return;
                }

                setPortraitUrl(data.media?.portraitUrl ?? '');
                setUpdatedAt(data.media?.updatedAt ?? null);
            } catch (loadError) {
                if (!active) {
                    return;
                }

                setError(loadError instanceof Error ? loadError.message : '读取 About 媒体配置失败。');
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, []);

    const previewSrc = useMemo(() => portraitUrl.trim() || STATIC_PORTRAIT_PATH, [portraitUrl]);
    const updatedLabel = updatedAt ? new Date(updatedAt).toLocaleString('zh-CN') : '尚未保存过覆盖链接';

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('/api/admin/about-media', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    portraitUrl,
                }),
            });

            const data = (await response.json()) as AboutMediaResponse;

            if (!response.ok) {
                throw new Error(data.error || '保存 About 媒体配置失败。');
            }

            setUpdatedAt(data.media?.updatedAt ?? null);
            setPortraitUrl(data.media?.portraitUrl ?? '');
            setMessage('人物照覆盖链接已保存。留空时会自动回退到站内静态图片。');
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : '保存 About 媒体配置失败。');
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">About 媒体覆盖</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                        头像现在固定使用站内静态资源，不再走上传同步。这里仅保留“人物照外链覆盖”的最小入口，
                        如果留空，about 页会继续使用 <span className="font-mono text-slate-700">{STATIC_PORTRAIT_PATH}</span>。
                    </p>
                </div>
                <div className="text-xs text-slate-500">最近更新：{updatedLabel}</div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                        <div className="text-sm font-semibold text-slate-900">静态头像</div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            当前头像固定读取
                            <span className="ml-1 font-mono text-slate-700">{STATIC_AVATAR_PATH}</span>，
                            后续如果要换图，直接替换同名文件即可。
                        </p>
                    </div>

                    <label className="block">
                        <div className="mb-2 text-sm font-semibold text-slate-900">人物照覆盖链接</div>
                        <textarea
                            value={portraitUrl}
                            onChange={(event) => setPortraitUrl(event.target.value)}
                            placeholder="https://example.com/about-portrait.webp"
                            rows={4}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </label>

                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm leading-6 text-slate-600">
                        建议只填写稳定的公网图片链接，格式优先使用 <strong>WebP / JPG / PNG</strong>。
                        如果暂时不想用外链，直接清空后保存即可。
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setPortraitUrl('')}
                            className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            清空覆盖
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleSave()}
                            disabled={loading || saving}
                            className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? '保存中...' : '保存链接'}
                        </button>
                    </div>

                    {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
                    {error ? <p className="text-sm text-rose-600">{error}</p> : null}
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">预览</div>
                            <div className="text-xs text-slate-500">
                                {loading ? '正在读取当前配置...' : portraitUrl.trim() ? '外链覆盖中' : '使用站内静态图片'}
                            </div>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                            {portraitUrl.trim() ? 'Override' : 'Static'}
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-[24px] border border-white bg-white shadow-sm">
                        <div className="relative aspect-[4/5] bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewSrc}
                                alt="About 人物照预览"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
