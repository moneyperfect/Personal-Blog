import type { AboutPageContent } from '@/components/about/types';
import { ABOUT_PROFILE_MEDIA_DEFAULTS, type AboutProfileMedia } from '@/lib/about-profile-media';
import { localizedMetadata } from '@/lib/seo';

const zhContent: AboutPageContent = {
    hero: {
        pageTitle: '关于 NAS',
        floatingPills: ['INTJ', '一人公司', 'AI Agent', '反脆弱', '单元经济学', '日语 N2'],
        avatarSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.avatarUrl,
        avatarAlt: 'NAS 的头像',
        aboutKicker: '核心定位',
        aboutTitle: '一个人就是一个公司',
        aboutSubtitle:
            'AI Agent 是我的团队，代码和内容是无许可杠杆。目标是零员工、零边际成本，把想法直接变成能产生收入的产品',
        idealLabel: '行动准则',
        idealHeadline: '区分伪工作和真工作',
        idealBody: '只有构建产品和在此基础上增长，才算真工作',
    },
    skills: {
        label: 'Tech & Leverage',
        title: '一个人的工具栈',
        summary: '用 AI Agent 搭自动化系统，一个人跑通产品从想法到上线的全流程',
        careerLabel: '生涯',
        careerTitle: '无限进步',
        careerTimeline: [
            {
                date: '2025.05',
                title: '认知重置',
                description: '发现 AI First 一人公司模型，开始用元认知管自己的决策',
                tone: 'blue',
                progress: '12%',
            },
            {
                date: '2026 至今',
                title: '开始造东西',
                description: '上线 VibeImg，搭起个人品牌站和自动化工作流，一个人跑通产品闭环',
                tone: 'green',
                progress: '82%',
            },
        ],
        careerLegend: 'SYSTEM',
        careerStart: '2025',
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
        photoLabel: '',
        photoSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.portraitUrl,
        photoAlt: 'NAS 的人物照片',
    },
    worksTitle: '我的作品',
    works: [
        {
            title: 'VibeImg',
            summary: 'AI 图片生成工具，72 小时从想法到第一个付费用户。用 GPT Image API 搭建，一个人完成开发和上线',
            imageSrc: '/about/work-portfolio-01.png',
            imageAlt: 'VibeImg 作品预览',
            meta: 'AI Product',
        },
        {
            title: '个人品牌站',
            summary: '一人公司的数字基础设施——Next.js + Supabase，中日双语，支持博客、产品展示和自动化部署',
            imageSrc: '/about/work-systems.svg',
            imageAlt: '个人品牌站作品预览',
            meta: 'Brand / Web',
        },
        {
            title: '自动化工作流',
            summary: '用 AI Agent 自动化内容发布、博客维护和产品数据监控，一个人管理多个内容渠道',
            imageSrc: '/about/work-studio.svg',
            imageAlt: '自动化工作流作品预览',
            meta: 'Automation / AI',
        },
    ],
    gamesTitle: '游戏爱好',
    games: [
        {
            label: '',
            imageSrc: '/about/game-elden-ring.webp',
            imageAlt: '艾尔登法环游戏画面',
        },
        {
            label: '',
            imageSrc: '/about/game-sekiro.webp',
            imageAlt: '只狼游戏画面',
        },
    ],
    preferencesTitle: '爱好与偏好',
    preferences: [
        {
            label: '追番',
            title: 'Steins;Gate / 命运石之门',
            subtitle: '《命运石之门》。偏爱这种把逻辑、时空闭环和叙事诡计玩儿到极致的硬核作品，懂的都懂',
            imageSrc: '/about/anime-steins-gate.jpg',
            imageAlt: '命运石之门海报',
            imagePosition: '52% 60%',
            mobileImagePosition: '54% 56%',
        },
        {
            label: '音乐',
            title: 'AKASAKI / AI Music',
            subtitle: '喜欢带一点生成感、又不丢情绪张力的声音纹理，适合在高强度工作时反复循环',
            imageSrc: '/about/preference-music.jpg',
            imageAlt: '音乐偏好氛围图',
            imagePosition: '60% 48%',
            mobileImagePosition: '58% 46%',
        },
        {
            label: '关注点',
            title: '元认知与高理性状态',
            subtitle: '持续关注如何用更高层次的认知框架管理决策、状态与执行，让人和系统一起提效',
            imageSrc: '/about/preference-metacognition.png',
            imageAlt: '元认知主题图片',
            imagePosition: '50% 36%',
            mobileImagePosition: '50% 30%',
        },
        {
            label: '保留位',
            title: 'Coming Soon',
            subtitle: '这里先留给之后新增的图片、链接或长期偏好，留白本身也是一种结构准备',
            imageSrc: '/about/preference-future.svg',
            imageAlt: '预留偏好占位图',
            imagePosition: '50% 50%',
            mobileImagePosition: '50% 50%',
        },
    ],
    info: {
        principlesTitle: '核心运转原则',
        principles: [
            {
                title: '边际成本归零',
                description: '每多服务一个用户，成本趋近于零',
            },
            {
                title: '无许可杠杆',
                description: '代码和媒体没人能阻止你发布',
            },
            {
                title: '反脆弱',
                description: '极低成本试错，失败了损失很小，成功了收益无限',
            },
        ],
        aboutTitle: '关于我',
        aboutParagraphs: [
            '我在探索一人公司的可行性路径——一个人 + AI Agent，能不能跑通从产品想法到商业变现的完整闭环',
            '我的工具栈：Claude 写代码和文案，Cursor 做开发，Supabase 管数据，Vercel 部署。AI 不是辅助，是我的执行层',
            '这个站记录的是我在做的实验和得出的结论。不是教程，是一个正在边做边验证的人的思考日志',
        ],
        educationTitle: '教育经历',
        educationBody: '天津工业大学 | 信息系统专业 | 系统工程视角',
        currentTitle: '当前状态',
        currentBody: '一人公司实验 | AI 产品开发 | 日语 N2 巩固中',
    },
    narrative: {
        routeTitle: '系列路程：从学习者到构建者',
        routeIntro: '从研究商业模型到动手做产品——一个人、一套 AI 工具栈，验证一人公司这条路能不能跑通',
    },
};

const jaContent: AboutPageContent = {
    hero: {
        pageTitle: 'NASについて',
        floatingPills: ['Vibe Coder', 'システムビルダー', 'メタ認知の実践', 'AIレバレッジ', '小さな閉ループ', 'ミニマル志向'],
        avatarSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.avatarUrl,
        avatarAlt: 'NASのアバター',
        aboutKicker: 'コアポジション',
        aboutTitle: '仕組みを動かす。しかも、ちゃんと効率よく。',
        aboutSubtitle:
            'ゼロから全部を作るより、能力を何倍にも増幅してくれる「レバレッジ」を見つけるほうに強く惹かれます。学内の小さなサービスでも、複雑な業務フローを整理する AI Agent でも、目標はひとつ。仕組みを動かし、現実の中でちゃんと機能させることです。',
        idealLabel: '行動原則',
        idealHeadline: '認知が一段上がれば、打てる手は一気に増える。',
        idealBody: 'AIは代役ではなく、効率の天井を突き破るための増幅器だと捉えています。',
    },
    skills: {
        label: 'Tech & Leverage',
        title: '創造力を起動する',
        summary: 'Claude でプロンプトを磨き、Next.js + Supabase で素早く形にする。そんな自走型の自動化システムを組んでいます。',
        careerLabel: '歩み',
        careerTitle: '進化し続ける',
        careerTimeline: [
            {
                date: '2025.05',
                title: 'システム再起動',
                description: 'メタ認知と効率レバレッジを意識して見直し始めた時期。',
                tone: 'blue',
                progress: '12%',
            },
            {
                date: '2026 - 現在',
                title: 'デジタル分身を構築',
                description: '個人ブランドサイトを軸に、能力をモジュール化しながら整理中。',
                tone: 'green',
                progress: '82%',
            },
        ],
        careerLegend: 'SYSTEM',
        careerStart: '2025',
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
        photoLabel: '',
        photoSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.portraitUrl,
        photoAlt: 'NASのポートレート',
    },
    worksTitle: '制作物',
    works: [
        {
            title: 'Personal Brand Site',
            summary: 'プロフィール、コンテンツ導線、作品紹介をひとつのブランド体験としてまとめた個人サイトです。',
            imageSrc: '/about/work-portfolio-01.png',
            imageAlt: '作品プレビュー 1',
            meta: 'Brand / Web',
        },
        {
            title: 'Growth Console',
            summary: '公開、編集、整理の流れを一つの運用導線にまとめ、長期で積み上げやすい個人の操作台にしています。',
            imageSrc: '/about/work-systems.svg',
            imageAlt: '作品プレビュー 2',
            meta: 'System / Content',
        },
        {
            title: 'Visual Studio',
            summary: 'ページのテンポ、レイアウト、視覚の秩序を試しながら、このサイト自体を長期進化中の実験場として扱っています。',
            imageSrc: '/about/work-studio.svg',
            imageAlt: '作品プレビュー 3',
            meta: 'Motion / Layout',
        },
    ],
    gamesTitle: 'ゲーム',
    games: [
        {
            label: '',
            imageSrc: '/about/game-elden-ring.webp',
            imageAlt: 'エルデンリングのゲーム画面',
        },
        {
            label: '',
            imageSrc: '/about/game-sekiro.webp',
            imageAlt: 'SEKIRO のゲーム画面',
        },
    ],
    preferencesTitle: '趣味と嗜好',
    preferences: [
        {
            label: '好きなアニメ',
            title: 'Steins;Gate / シュタインズ・ゲート',
            subtitle: '論理、時間ループ、叙述トリックが極限まで噛み合う、こういう硬派な作品にどうしても惹かれます。',
            imageSrc: '/about/anime-steins-gate.jpg',
            imageAlt: 'アニメの好み',
            imagePosition: '52% 60%',
            mobileImagePosition: '54% 56%',
        },
        {
            label: '音の好み',
            title: 'AKASAKI / AI Music',
            subtitle: '少し人工的な質感を残しつつ、感情の波もしっかりある音像を、作業中に長く流すのが好きです。',
            imageSrc: '/about/preference-music.jpg',
            imageAlt: '音の好み',
            imagePosition: '60% 48%',
            mobileImagePosition: '58% 46%',
        },
        {
            label: '関心領域',
            title: 'メタ認知と高い合理性',
            subtitle: '判断、状態管理、実行をひとつ上の視点で組み直し、人とシステムの両方を強くする方法に関心があります。',
            imageSrc: '/about/preference-metacognition.png',
            imageAlt: '関心領域のビジュアル',
            imagePosition: '50% 36%',
            mobileImagePosition: '50% 30%',
        },
        {
            label: '余白',
            title: 'Coming Soon',
            subtitle: 'ここは、これから増える嗜好や長期テーマのために残している余白です。',
            imageSrc: '/about/preference-future.svg',
            imageAlt: '予備スロット',
            imagePosition: '50% 50%',
            mobileImagePosition: '50% 50%',
        },
    ],
    info: {
        principlesTitle: '中核の運転原則',
        principles: [
            {
                title: 'ミニマリズム',
                description: '限界利益が薄い動きは切り落とす。',
            },
            {
                title: 'レバレッジ優先',
                description: '同じ車輪を何度も作る作業はしない。',
            },
            {
                title: '現実に落とす',
                description: 'どれだけ良い着想でも、実装しなければゼロです。',
            },
        ],
        aboutTitle: '私について',
        aboutParagraphs: [
            '正直に言うと、私は「コードを一から美しく書くこと」に強い執着があるタイプではありません。',
            'むしろ問題に出会ったら、最初に考えるのはレバレッジです。AI を相棒として使いながら、頭の中の事業アイデアや構想を、実際に動く仕組みへ変えていくほうに自然と向かいます。',
            '2025年5月は、自分にとって一度リセットが入った時期でした。そこからメタ認知を意識的に鍛え始め、日本語 N2 の積み直しも、学内サービスの小さな実験も、本質的には同じく「仕組みを組むこと」だと見えるようになりました。',
            'このサイトは技術自慢のためではなく、問題のほどき方と実行のしかたを見せるために作っています。小さな摩擦で現実の結果を大きく動かすことに惹かれるなら、きっと話が合うと思います。',
        ],
        educationTitle: '学び',
        educationBody: '天津工業大学 | 情報システム専攻 | システム工学の視点',
        currentTitle: '現在の状態',
        currentBody: 'AI レバレッジを探る | 独立プロダクトを磨く | 日本語 N2 を継続強化中',
    },
    narrative: {
        routeTitle: '歩み: プロダクト初心者からシステム構築者へ',
        routeIntro: '最も美しいコードを書くことより、曖昧な要求を動く仕組みへ組み上げることに惹かれます。核にあるのは、レバレッジを見つけて走らせることです。',
    },
};

function withProfileMedia(content: AboutPageContent, media: AboutProfileMedia): AboutPageContent {
    return {
        ...content,
        hero: {
            ...content.hero,
            avatarSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.avatarUrl,
        },
        personality: {
            ...content.personality,
            photoSrc: media.portraitUrl || content.personality.photoSrc,
        },
    };
}

export function getAboutContent(locale: string, media: AboutProfileMedia): AboutPageContent {
    return withProfileMedia(locale === 'zh' ? zhContent : jaContent, media);
}

export function getAboutMetadata(locale: string) {
    if (locale === 'zh') {
        return localizedMetadata('/about', locale, {
            title: '关于我',
            description: '围绕头像、创造力、人格、照片与兴趣偏好构建的 About 页面。',
        });
    }

    return localizedMetadata('/about', locale, {
        title: '私について',
        description: 'アバター、創造力、性格、写真、趣味と嗜好で構成した About ページです。',
    });
}
