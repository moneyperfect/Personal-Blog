'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
    responsive?: boolean;
    className?: string;
}

/**
 * Google AdSense 广告单元组件
 * 
 * 使用方法:
 * <AdUnit slot="1234567890" format="auto" responsive />
 * 
 * 注意:
 * - 需要在 AdSense 后台创建广告单元并获取 slot ID
 * - 仅在生产环境且 NEXT_PUBLIC_ENABLE_ADSENSE=true 时显示
 */
export function AdUnit({
    slot,
    format = 'auto',
    responsive = true,
    className = ''
}: AdUnitProps) {
    const adRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    const isEnabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true';
    const isProduction = process.env.NODE_ENV === 'production';

    useEffect(() => {
        // 仅在生产环境且启用时初始化广告
        if (!isProduction || !isEnabled || !client || isInitialized.current) {
            return;
        }

        try {
            // 避免重复 push
            if (adRef.current && !isInitialized.current) {
                // @ts-expect-error - adsbygoogle is injected by Google script
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isInitialized.current = true;
            }
        } catch (error) {
            console.error('AdSense initialization error:', error);
        }
    }, [isProduction, isEnabled, client]);

    // 非生产环境或未启用时不渲染
    if (!isProduction || !isEnabled || !client) {
        return null;
    }

    return (
        <div className={`ad-container ${className}`} ref={adRef}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}

/**
 * 文章底部广告组件（预设样式）
 */
export function ArticleBottomAd({ slot }: { slot: string }) {
    return (
        <div className="mt-8 pt-8 border-t border-surface-200">
            <p className="text-xs text-surface-400 text-center mb-2">广告</p>
            <AdUnit slot={slot} format="horizontal" responsive className="min-h-[90px]" />
        </div>
    );
}
