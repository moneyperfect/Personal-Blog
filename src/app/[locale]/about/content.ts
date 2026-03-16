import type { AboutPageContent } from '@/components/about/types';
import { ABOUT_PROFILE_MEDIA_DEFAULTS, type AboutProfileMedia } from '@/lib/about-profile-media';

const zhContent: AboutPageContent = {
    hero: {
        pageTitle: '关于 NAS',
        floatingPills: ['Vibe Coder', '系统构建者', '元认知实践者', 'AI 杠杆驱动', '闭环探索中', '极简效率派'],
        avatarSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.avatarUrl,
        avatarAlt: 'NAS 的头像',
        aboutKicker: '核心定位',
        aboutTitle: '让系统跑起来，而且必须有效率。',
        aboutSubtitle:
            '比起从零去造轮子，我更着迷于寻找那个能放大十倍能力的“杠杆”。不管是一个校园跑腿的商业小闭环，还是帮甲方搞定复杂流程的 AI Agent，我的目的只有一个：让系统跑起来，而且必须有效率。',
        idealLabel: '行动准则',
        idealHeadline: '认知高一米，边界宽一丈。',
        idealBody: 'AI 不是我的替代者，它是我的超级义体，用来刺破效能天花板。',
    },
    skills: {
        label: 'Tech & Leverage',
        title: '开启创造力',
        summary: '从 Claude 调教 Prompt 到 Next.js + Supabase 落地，我专注于搭一套能自己跑的自动化系统。',
        careerLabel: '生涯',
        careerTitle: '无限进步',
        careerTimeline: [
            {
                date: '2025.05',
                title: '系统重启',
                description: '意识觉醒，开始关注元认知与效率杠杆。',
                tone: 'blue',
                progress: '12%',
            },
            {
                date: '2026 至今',
                title: '构建数字分身',
                description: '落地个人品牌站，将能力逐步模块化。',
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
            title: 'Personal Brand Site',
            summary: '把个人主页、内容系统和作品承接整理成统一的表达界面，让展示、叙事和后续转化放进同一套结构里。',
            imageSrc: '/about/work-portfolio-01.png',
            imageAlt: '个人品牌站作品预览',
            meta: 'Brand / Web',
        },
        {
            title: 'Growth Console',
            summary: '围绕内容发布、后台编辑与作品归档，搭一个更适合长期积累和持续迭代的个人操作台。',
            imageSrc: '/about/work-systems.svg',
            imageAlt: '增长控制台作品预览',
            meta: 'System / Content',
        },
        {
            title: 'Visual Studio',
            summary: '持续实验页面节奏、交互动效与视觉秩序，把这个站点当成我长期升级中的个人实验室。',
            imageSrc: '/about/work-studio.svg',
            imageAlt: '视觉工作室作品预览',
            meta: 'Motion / Layout',
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
            subtitle: '《命运石之门》。偏爱这种把逻辑、时空闭环和叙事诡计玩儿到极致的硬核作品，懂的都懂。',
            imageSrc: '/about/anime-steins-gate.jpg',
            imageAlt: '命运石之门海报',
            imagePosition: '48% 42%',
            mobileImagePosition: '56% 42%',
        },
        {
            label: '音乐',
            title: 'AKASAKI / AI Music',
            subtitle: '喜欢带一点生成感、又不丢情绪张力的声音纹理，适合在高强度工作时反复循环。',
            imageSrc: '/about/preference-music.jpg',
            imageAlt: '音乐偏好氛围图',
            imagePosition: '50% 42%',
            mobileImagePosition: '50% 40%',
        },
        {
            label: '关注点',
            title: '元认知与高理性状态',
            subtitle: '持续关注如何用更高层次的认知框架管理决策、状态与执行，让人和系统一起提效。',
            imageSrc: '/about/preference-metacognition.png',
            imageAlt: '元认知主题图片',
            imagePosition: '50% 24%',
            mobileImagePosition: '50% 18%',
        },
        {
            label: '保留位',
            title: 'Coming Soon',
            subtitle: '这里先留给之后新增的图片、链接或长期偏好，留白本身也是一种结构准备。',
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
                title: '极简主义',
                description: '砍掉一切边际收益为负的动作。',
            },
            {
                title: '杠杆优先',
                description: '不做重复造轮子的苦力活。',
            },
            {
                title: '现实落地',
                description: '想法再好，不部署就等于零。',
            },
        ],
        aboutTitle: '关于我',
        aboutParagraphs: [
            '老实说，我连代码小白都算不上，因为从零手敲代码对我来说太没效率了。',
            '我真正的习惯是：遇到问题，先找杠杆。与其自己死磕底层逻辑，我更喜欢用 AI 当我的“超级义体”，把脑子里的商业想法和产品架构直接跑通。',
            '去年五月算是我的一次“出厂设置重置”，也就是开始有意识地进行元认知训练。从那之后我发现，不管是跨语言去啃下日语 N2，还是在校园里跑通一个小服务，本质上都是在搭系统——把复杂的问题拆解，然后让它自动化运转。',
            '我建这个站，不是为了秀技术，而是想展示我解决问题的思路和执行力。如果你也着迷于“如何用最小的摩擦力撬动最大的现实结果”，那我们大概率能聊得来。',
        ],
        educationTitle: '教育经历',
        educationBody: '天津工业大学 | 信息系统专业 | 系统工程视角',
        currentTitle: '当前状态',
        currentBody: '探索 AI 杠杆 | 打磨独立产品 | 日语 N2 巩固中',
    },
    narrative: {
        routeTitle: '系列路程：从产品小白到系统构建者',
        routeIntro: '我不懂怎么写出最优雅的代码，但我知道怎么把模糊的需求拼装成能运转的系统。核心逻辑只有一个：找到杠杆，让它跑起来。',
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
            imagePosition: '48% 42%',
            mobileImagePosition: '56% 42%',
        },
        {
            label: '音の好み',
            title: 'AKASAKI / AI Music',
            subtitle: '少し人工的な質感を残しつつ、感情の波もしっかりある音像を、作業中に長く流すのが好きです。',
            imageSrc: '/about/preference-music.jpg',
            imageAlt: '音の好み',
            imagePosition: '50% 42%',
            mobileImagePosition: '50% 40%',
        },
        {
            label: '関心領域',
            title: 'メタ認知と高い合理性',
            subtitle: '判断、状態管理、実行をひとつ上の視点で組み直し、人とシステムの両方を強くする方法に関心があります。',
            imageSrc: '/about/preference-metacognition.png',
            imageAlt: '関心領域のビジュアル',
            imagePosition: '50% 24%',
            mobileImagePosition: '50% 18%',
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
        return {
            title: '关于我',
            description: '围绕头像、创造力、人格、照片与兴趣偏好构建的 About 页面。',
        };
    }

    return {
        title: '私について',
        description: 'アバター、創造力、性格、写真、趣味と嗜好で構成した About ページです。',
    };
}
