import { setRequestLocale } from 'next-intl/server';
import { getAllProducts, getAllTags } from '@/lib/mdx';
import { Locale } from '@/i18n/routing';
import { ProductsClient } from './ProductsClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return {
        title: locale === 'zh' ? '数字产品' : 'デジタル製品',
        description: locale === 'zh'
            ? '经过验证的数字产品，帮助你节省时间、提升效率'
            : '検証済みのデジタル製品で、時間を節約し効率を向上',
    };
}

export default async function ProductsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const products = getAllProducts(locale as Locale);
    const allTags = getAllTags(products);

    return <ProductsClient products={products} allTags={allTags} />;
}
