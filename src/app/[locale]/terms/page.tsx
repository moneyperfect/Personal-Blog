import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    return { title: locale === 'zh' ? '服务条款' : '利用規約' };
}

export default async function TermsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const content = locale === 'zh' ? {
        title: '服务条款',
        lastUpdated: '最后更新：2024年1月1日',
        sections: [
            { title: '使用条款', text: '使用本网站即表示您同意遵守这些条款。我们保留随时修改条款的权利。' },
            { title: '数字产品', text: '所有数字产品均为一次性购买，不支持退款。购买后您将获得产品的使用权，但不包括转售权。' },
            { title: '知识产权', text: '网站上的所有内容（包括文本、图像、代码）均受版权保护。未经许可不得复制或分发。' },
            { title: '免责声明', text: '产品按"原样"提供，不保证适用于特定目的。使用产品的风险由用户自行承担。' },
        ],
    } : {
        title: '利用規約',
        lastUpdated: '最終更新：2024年1月1日',
        sections: [
            { title: '利用条件', text: '本ウェブサイトをご利用いただくことで、これらの規約に同意したものとみなされます。規約は予告なく変更される場合があります。' },
            { title: 'デジタル製品', text: 'すべてのデジタル製品は一回限りの購入であり、返金には対応しておりません。購入後、製品の使用権が付与されますが、再販権は含まれません。' },
            { title: '知的財産権', text: 'ウェブサイト上のすべてのコンテンツ（テキスト、画像、コード）は著作権で保護されています。許可なく複製または配布することはできません。' },
            { title: '免責事項', text: '製品は「現状のまま」提供され、特定の目的への適合性は保証されません。製品の使用に伴うリスクはユーザーが負担します。' },
        ],
    };

    return (
        <div className="py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 mb-2">{content.title}</h1>
                <p className="text-surface-500 mb-10">{content.lastUpdated}</p>
                {content.sections.map((section, i) => (
                    <section key={i} className="mb-8">
                        <h2 className="text-xl font-semibold text-surface-900 mb-3">{section.title}</h2>
                        <p className="text-surface-600">{section.text}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}
