import { setRequestLocale } from 'next-intl/server';
import AboutExperience from '@/components/about/AboutExperience';
import type { AboutPageContent } from '@/components/about/types';

type Props = { params: Promise<{ locale: string }> };

const zhContent: AboutPageContent = {
    hero: {
        pageTitle: '关于 NAS',
        floatingPills: ['Vibe Coder', '系统构建者', '元认知践行者', 'AI 杠杆驱动', '商业逻辑探索', '极简与效率至上'],
        aboutKicker: '寻找杠杆，构建系统。',
        aboutTitle: 'NAS | 段枫',
        aboutSubtitle: '致力于将模糊的商业需求，转化为高交付标准的技术系统。',
        idealLabel: '行动准则',
        idealLines: ['认知', '决定边界，', 'AI 放大效能。'],
    },
    skills: {
        label: 'Tech & Leverage',
        title: '技术与杠杆',
        categories: ['AI 工作流', '前端系统', '自动化执行', '商业落地'],
        careerLabel: '生涯',
        careerTitle: '无限进步',
        careerItems: ['EDU, 计算机安全专业', 'EDU, APP 开发工程专业', 'EDU, 网络市场营销专业'],
        careerLegend: 'EDU',
        careerStart: '2017',
        careerEnd: '现在',
    },
    personality: {
        label: '性格',
        title: '建筑师',
        code: 'INTJ',
        notePrefix: '在 ',
        noteLinkLabel: '16personalities',
        noteLinkHref: 'https://www.16personalities.com/',
        noteSuffix: ' 了解更多关于 建筑师',
        photoLabel: '照片',
        photoSrc: '/about/portrait-demo.svg',
        photoAlt: '个人照片',
    },
    worksTitle: '我的作品',
    works: [
        {
            title: 'Personal Brand Site',
            summary: '把个人主页、内容系统和产品承接做成统一的品牌体验。',
            imageSrc: '/about/work-launch.svg',
            imageAlt: '作品占位图 1',
            meta: 'Brand / Web',
        },
        {
            title: 'Growth Console',
            summary: '围绕内容发布、后台编辑与作品展示，搭建更适合长期积累的系统。',
            imageSrc: '/about/work-systems.svg',
            imageAlt: '作品占位图 2',
            meta: 'System / Content',
        },
        {
            title: 'Visual Studio',
            summary: '持续试验页面节奏、交互动效和视觉模块，把网站做成长期实验场。',
            imageSrc: '/about/work-studio.svg',
            imageAlt: '作品占位图 3',
            meta: 'Motion / Layout',
        },
    ],
    gamesTitle: '游戏爱好',
    games: [
        {
            label: '游戏爱好',
            imageSrc: '/about/game-odyssey.svg',
            imageAlt: '游戏占位图 1',
        },
        {
            label: '游戏爱好',
            imageSrc: '/about/game-myth.svg',
            imageAlt: '游戏占位图 2',
        },
    ],
    preferencesTitle: '爱好与偏好',
    preferences: [
        {
            label: '喜欢的动漫',
            title: 'Steins;Gate / 夏日重现',
            subtitle: '偏好严密逻辑与时空闭环的系统性叙事。',
            imageSrc: '/about/anime-circuit.svg',
            imageAlt: '动漫占位图',
        },
        {
            label: '音乐偏好',
            title: 'AKASAKI / AI Music',
            subtitle: '偏好有情绪张力，也带有生成感与实验性的声音纹理。',
            imageSrc: '/about/media-music.svg',
            imageAlt: '音乐占位图',
        },
        {
            label: '关注点',
            title: '元认知与高理性状态',
            subtitle: '持续关注如何用更高层次的认知框架管理决策、状态与执行。',
            imageSrc: '/about/media-focus.svg',
            imageAlt: '关注偏好占位图',
        },
        {
            label: '第四栏待补充',
            title: 'Coming Soon',
            subtitle: '这一栏预留给后续新增的图片、链接或新的长期偏好。',
            imageSrc: '/about/preference-future.svg',
            imageAlt: '占位图',
        },
    ],
    info: {
        statsTitle: '网站统计',
        stats: [
            { label: '文章数量', value: '24+' },
            { label: '页面迭代', value: 'V5' },
            { label: '创作方向', value: 'Brand' },
            { label: '长期目标', value: 'Compound' },
        ],
        aboutTitle: '关于我',
        aboutBody:
            '“我不仅是一名信息系统领域的探索者，更倾向于将自己定义为‘系统构建者’。在这里，我不从零造轮子，而是习惯将 AI 作为杠杆，跨越传统代码的壁垒，直接解决现实世界的问题。\n\n无论是主导校园商业项目的落地，还是跨越维吾尔语、汉语到日语（N2）的语言解码，亦或是在健身房推进精确到公斤的增肌计划，我始终坚信：生活与工作中的一切复杂问题，都可以被拆解、量化并优化。”',
        educationTitle: '教育经历',
        educationItems: ['计算机安全专业', 'APP 开发工程专业', '网络市场营销专业'],
        currentTitle: '当前状态',
        currentItems: ['持续优化个人博客', '整理作品与表达体系', '探索更长期的品牌站结构'],
    },
    narrative: {
        routeTitle: '系列路程',
        routeIntro: '把表达升级成系统，把系统继续推向可复用、可自动化、可承接商业结果的闭环。',
        routeItems: ['建立数字分身', '探索 AI 杠杆', '构建自动化商业闭环'],
    },
};

const jaContent: AboutPageContent = {
    hero: {
        pageTitle: 'NAS について',
        floatingPills: [
            'Vibe Coder',
            'システムビルダー',
            'メタ認知の実践者',
            'AIレバレッジ駆動',
            'ビジネスロジック探究',
            'ミニマルと効率重視',
        ],
        aboutKicker: 'レバレッジを見つけ、仕組みをつくる。',
        aboutTitle: 'NAS | 段枫',
        aboutSubtitle: '曖昧なビジネス要求を、高い実装品質の技術システムへ変換することに取り組んでいます。',
        idealLabel: '行動原則',
        idealLines: ['認知が', '境界を決め、', 'AI が効率を増幅する。'],
    },
    skills: {
        label: 'テック & レバレッジ',
        title: '技術とレバレッジ',
        categories: ['AIワークフロー', 'フロントエンド設計', '自動化実行', 'ビジネス実装'],
        careerLabel: '歩み',
        careerTitle: '進化し続ける',
        careerItems: ['EDU, 情報セキュリティ専攻', 'EDU, アプリ開発工学専攻', 'EDU, ネットワークマーケティング専攻'],
        careerLegend: 'EDU',
        careerStart: '2017',
        careerEnd: '現在',
    },
    personality: {
        label: '性格',
        title: '建築家',
        code: 'INTJ',
        notePrefix: '',
        noteLinkLabel: '16personalities',
        noteLinkHref: 'https://www.16personalities.com/',
        noteSuffix: ' で建築家タイプを詳しく見る',
        photoLabel: '写真',
        photoSrc: '/about/portrait-demo.svg',
        photoAlt: 'ポートレート写真',
    },
    worksTitle: '私の作品',
    works: [
        {
            title: 'Personal Brand Site',
            summary: 'プロフィール、コンテンツ運用、プロダクト導線をひとつのブランド体験としてまとめた個人サイトです。',
            imageSrc: '/about/work-launch.svg',
            imageAlt: '作品イメージ 1',
            meta: 'ブランド / Web',
        },
        {
            title: 'Growth Console',
            summary: 'コンテンツ公開、管理画面での編集、作品展示を長期運用向けに整理したシステムです。',
            imageSrc: '/about/work-systems.svg',
            imageAlt: '作品イメージ 2',
            meta: 'システム / コンテンツ',
        },
        {
            title: 'Visual Studio',
            summary: 'レイアウトのリズム、インタラクション、見せ方を継続的に実験し磨き込むための制作フィールドです。',
            imageSrc: '/about/work-studio.svg',
            imageAlt: '作品イメージ 3',
            meta: 'モーション / レイアウト',
        },
    ],
    gamesTitle: 'ゲームの好み',
    games: [
        {
            label: 'ゲームの好み',
            imageSrc: '/about/game-odyssey.svg',
            imageAlt: 'ゲームイメージ 1',
        },
        {
            label: 'ゲームの好み',
            imageSrc: '/about/game-myth.svg',
            imageAlt: 'ゲームイメージ 2',
        },
    ],
    preferencesTitle: '趣味と嗜好',
    preferences: [
        {
            label: '好きなアニメ',
            title: 'Steins;Gate / サマータイムレンダ',
            subtitle: '緻密な論理、時間ループ、閉じた構造を持つ物語に強く惹かれます。',
            imageSrc: '/about/anime-circuit.svg',
            imageAlt: 'アニメイメージ',
        },
        {
            label: '音楽の好み',
            title: 'AKASAKI / AI Music',
            subtitle: '感情の張力があり、生成的で実験的な質感を持つサウンドを好みます。',
            imageSrc: '/about/media-music.svg',
            imageAlt: '音楽イメージ',
        },
        {
            label: '関心テーマ',
            title: 'メタ認知と高い合理性',
            subtitle: 'より高次の認知フレームで意思決定、状態管理、実行を整えることに長く関心があります。',
            imageSrc: '/about/media-focus.svg',
            imageAlt: '関心テーマイメージ',
        },
        {
            label: '4つ目のスロット',
            title: '準備中',
            subtitle: '今後追加する画像やリンク、あるいは新しい長期的な嗜好のために残している枠です。',
            imageSrc: '/about/preference-future.svg',
            imageAlt: 'プレースホルダー画像',
        },
    ],
    info: {
        statsTitle: 'サイト統計',
        stats: [
            { label: '記事数', value: '24+' },
            { label: 'ページ更新', value: 'V5' },
            { label: '制作方向', value: 'ブランド' },
            { label: '長期目標', value: '複利' },
        ],
        aboutTitle: '私について',
        aboutBody:
            '私は単なる情報システム領域の探求者ではなく、むしろ自分を「システムビルダー」と定義しています。ここではゼロから何もかも作ることに固執せず、AI をレバレッジとして使い、従来のコードの壁を越えて現実の課題を直接解決することを重視しています。\n\n学内ビジネスプロジェクトの推進、ウイグル語・中国語・日本語（N2）をまたぐ言語理解、そしてジムでのキロ単位の増量計画まで。私は、生活と仕事にある複雑な問題はすべて分解し、計測し、最適化できると信じています。',
        educationTitle: '学習歴',
        educationItems: ['情報セキュリティ専攻', 'アプリ開発工学専攻', 'ネットワークマーケティング専攻'],
        currentTitle: '現在の状態',
        currentItems: ['個人ブログを継続改善中', '作品と表現システムを整理中', 'より長期的なブランドサイト構造を探究中'],
    },
    narrative: {
        routeTitle: 'シリーズの軌跡',
        routeIntro: '表現をシステムへと引き上げ、そのシステムを再利用可能で自動化されたビジネスループへ育てていきます。',
        routeItems: ['デジタル分身をつくる', 'AIレバレッジを探究する', '自動化された事業ループを構築する'],
    },
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;

    return {
        title: locale === 'zh' ? '关于我' : '私について',
        description:
            locale === 'zh'
                ? '围绕头像、创造力引擎、性格、照片与兴趣偏好构建的 About 页面。'
                : 'アバター、創造力、性格、写真、趣味と嗜好で構成したプロフィールページです。',
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <AboutExperience locale={locale} content={locale === 'zh' ? zhContent : jaContent} />;
}
