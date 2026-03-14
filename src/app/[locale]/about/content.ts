import type { AboutPageContent } from '@/components/about/types';
import {
    ABOUT_PROFILE_MEDIA_DEFAULTS,
    resolveAboutProfileMedia,
    type AboutProfileMedia,
} from '@/lib/about-profile-media';

const zhContent: AboutPageContent = {
    hero: {
        pageTitle: '关于 NAS',
        floatingPills: ['Vibe Coder', '系统构建者', '元认知践行者', 'AI 杠杆驱动', '商业闭环探索', '极简效率派'],
        avatarSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.avatarUrl,
        avatarAlt: 'NAS 的头像',
        aboutKicker: '核心定位',
        aboutTitle: '让系统跑起来，而且必须有效率',
        aboutSubtitle:
            '比起从零去造轮子，我更着迷于寻找那个能放大十倍能力的“杠杆”。不管是一个校园跑腿的商业小闭环，还是帮甲方搞定复杂流程的 AI Agent，我的目的只有一个：让系统跑起来，而且必须有效率。',
        idealLabel: '行动准则',
        idealHeadline: '认知高一米，边界宽一丈。',
        idealBody: 'AI 不是我的替代者，它是我的超级义体，用来刺破效能天花板。',
    },
    skills: {
        label: 'Tech & Leverage',
        title: '开启创造力',
        summary: '从 Claude 调教 Prompt 到 Next.js + Supabase 的快速落地，我专注于打造一套能“自个儿跑”的自动化业务系统。',
        careerLabel: '生涯',
        careerTitle: '无限进步',
        careerTimeline: [
            {
                date: '2025.05',
                title: '系统重启',
                description: '意识觉醒，开始关注元认知与效率杠杆。',
                tone: 'blue',
                progress: '10%',
            },
            {
                date: '2025.10',
                title: '初探杠杆',
                description: '利用 AI 辅助跑通校园商业服务闭环。',
                tone: 'yellow',
                progress: '46%',
            },
            {
                date: '2026 至今',
                title: '构建数字分身',
                description: '落地个人品牌站，将能力模块化。',
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
        photoLabel: '照片',
        photoSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.portraitUrl,
        photoAlt: 'NAS 的个人照片',
    },
    worksTitle: '我的作品',
    works: [
        {
            title: 'Personal Brand Site',
            summary: '把个人主页、内容系统和产品承接整合为统一的品牌表达，持续打磨展示与转化之间的平衡。',
            imageSrc: '/about/work-launch.svg',
            imageAlt: '个人品牌站作品预览',
            meta: 'Brand / Web',
        },
        {
            title: 'Growth Console',
            summary: '围绕内容发布、后台编辑与作品整理，搭建更适合长期积累与迭代的个人操作台。',
            imageSrc: '/about/work-systems.svg',
            imageAlt: '增长控制台作品预览',
            meta: 'System / Content',
        },
        {
            title: 'Visual Studio',
            summary: '持续实验页面节奏、交互动效和视觉模块，把这个站点当成长期进化中的个人实验室。',
            imageSrc: '/about/work-studio.svg',
            imageAlt: '视觉工作室作品预览',
            meta: 'Motion / Layout',
        },
    ],
    gamesTitle: '游戏爱好',
    games: [
        {
            label: '游戏爱好',
            imageSrc: '/about/game-odyssey.svg',
            imageAlt: '游戏爱好展示 1',
        },
        {
            label: '游戏爱好',
            imageSrc: '/about/game-myth.svg',
            imageAlt: '游戏爱好展示 2',
        },
    ],
    preferencesTitle: '爱好与偏好',
    preferences: [
        {
            label: '喜欢的动漫',
            title: 'Steins;Gate / 命运石之门',
            subtitle: '《命运石之门》。偏爱这种把逻辑、时空闭环和叙事诡计玩儿到极致的硬核作品，懂的都懂。',
            imageSrc: '/about/anime-circuit.svg',
            imageAlt: '动漫偏好展示',
        },
        {
            label: '音乐偏好',
            title: 'AKASAKI / AI Music',
            subtitle: '喜欢带情绪张力、同时又有一点生成感与实验性的声音纹理，适合长时间工作时反复循环。',
            imageSrc: '/about/media-music.svg',
            imageAlt: '音乐偏好展示',
        },
        {
            label: '关注点',
            title: '元认知与高理性状态',
            subtitle: '持续关注如何用更高层次的认知框架管理决策、状态与执行，让人和系统一起提效。',
            imageSrc: '/about/media-focus.svg',
            imageAlt: '关注点展示',
        },
        {
            label: '第四栏待补充',
            title: 'Coming Soon',
            subtitle: '这里暂时保留给之后新增的图片、链接或长期偏好，留白也是一种结构上的准备。',
            imageSrc: '/about/preference-future.svg',
            imageAlt: '预留偏好展示',
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
            '去年五月算是我的一次“出厂设置重置”，也就是开始有意识地进行元认知训练。从那之后我发现，不管是跨语言去啃下日语 N2，还是在校园里跑通一个小服务，本质上都是在搭系统，把复杂的问题拆解，然后让它自动化运转。',
            '我建这个站，不是为了秀技术，而是想展示我解决问题的思路和执行力。如果你也着迷于“如何用最小的摩擦力撬动最大的现实结果”，那我们大概率能聊得来。',
        ],
        educationTitle: '教育经历',
        educationBody: '天津工业大学 | 信息系统专业 | 系统工程视角',
        currentTitle: '当前状态',
        currentBody: '探索 AI 杠杆 | 打磨独立产品 | 日语 N2 巩固中',
    },
    narrative: {
        routeTitle: '系列路程：从产品小白到系统构建者',
        routeIntro:
            '我不懂怎么写出最优雅的代码，但我知道怎么把模糊的需求拼装成能运转的系统。核心逻辑只有一个：找到杠杆，让它跑起来。',
    },
};

const jaContent: AboutPageContent = {
    hero: {
        pageTitle: 'NAS について',
        floatingPills: ['Vibe Coder', 'システムビルダー', 'メタ認知実践者', 'AI レバレッジ志向', 'ビジネス検証中', 'ミニマル効率派'],
        avatarSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.avatarUrl,
        avatarAlt: 'NAS のアバター',
        aboutKicker: 'コアポジション',
        aboutTitle: '仕組みを動かす。しかも、効率よく。',
        aboutSubtitle:
            'ゼロからすべてを作るより、十倍の力を生むレバレッジを探すことに惹かれます。学内サービスでも、複雑な業務フローを整理する AI Agent でも、目的はひとつです。仕組みを動かし、現実の中で機能させること。',
        idealLabel: '行動原則',
        idealHeadline: '認知が高くなるほど、境界は広がる。',
        idealBody: 'AI は代替ではなく、効率の天井を突き破るための増幅器だと考えています。',
    },
    skills: {
        label: 'Tech & Leverage',
        title: '創造力を起動する',
        summary: 'Claude でのプロンプト調整から Next.js + Supabase の素早い実装まで、動き続ける自動化システムを組み上げることに集中しています。',
        careerLabel: '歩み',
        careerTitle: '進化し続ける',
        careerTimeline: [
            {
                date: '2025.05',
                title: 'システム再起動',
                description: 'メタ認知と効率レバレッジを意識して見直し始めた時期。',
                tone: 'blue',
                progress: '10%',
            },
            {
                date: '2025.10',
                title: 'レバレッジ探索',
                description: 'AI を使って学内サービスの小さな閉ループを回し始めた段階。',
                tone: 'yellow',
                progress: '46%',
            },
            {
                date: '2026 - 現在',
                title: 'デジタル分身を構築',
                description: '個人ブランドサイトを軸に、能力をモジュール化して整理中。',
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
        photoLabel: '写真',
        photoSrc: ABOUT_PROFILE_MEDIA_DEFAULTS.portraitUrl,
        photoAlt: 'NAS のポートレート',
    },
    worksTitle: '私の作品',
    works: [
        {
            title: 'Personal Brand Site',
            summary: 'プロフィール、コンテンツ運用、作品導線をひとつのブランド体験としてまとめた個人サイトです。',
            imageSrc: '/about/work-launch.svg',
            imageAlt: '作品プレビュー 1',
            meta: 'Brand / Web',
        },
        {
            title: 'Growth Console',
            summary: '公開・編集・整理の流れを一つの運用導線にまとめ、長期的に積み上げやすい形へ整えています。',
            imageSrc: '/about/work-systems.svg',
            imageAlt: '作品プレビュー 2',
            meta: 'System / Content',
        },
        {
            title: 'Visual Studio',
            summary: 'モーション、レイアウト、視線誘導を試しながら、サイト全体を実験場として磨き続けています。',
            imageSrc: '/about/work-studio.svg',
            imageAlt: '作品プレビュー 3',
            meta: 'Motion / Layout',
        },
    ],
    gamesTitle: 'ゲームの好み',
    games: [
        {
            label: 'ゲームの好み',
            imageSrc: '/about/game-odyssey.svg',
            imageAlt: 'ゲームプレビュー 1',
        },
        {
            label: 'ゲームの好み',
            imageSrc: '/about/game-myth.svg',
            imageAlt: 'ゲームプレビュー 2',
        },
    ],
    preferencesTitle: '趣味と嗜好',
    preferences: [
        {
            label: '好きなアニメ',
            title: 'Steins;Gate / シュタインズ・ゲート',
            subtitle: '論理、時間ループ、叙述トリックが緻密に噛み合う、こういう硬派な作品に惹かれます。',
            imageSrc: '/about/anime-circuit.svg',
            imageAlt: 'アニメの好み',
        },
        {
            label: '音楽の好み',
            title: 'AKASAKI / AI Music',
            subtitle: '感情の張りと少しの生成感、そして実験性を含んだ音像が長時間作業にちょうどいいです。',
            imageSrc: '/about/media-music.svg',
            imageAlt: '音楽の好み',
        },
        {
            label: '関心領域',
            title: 'メタ認知と高い合理性',
            subtitle: '判断、状態管理、実行をより高い視点で扱うための認知フレームに関心があります。',
            imageSrc: '/about/media-focus.svg',
            imageAlt: '関心領域の紹介',
        },
        {
            label: '4つ目のスロット',
            title: 'Coming Soon',
            subtitle: '今後の追加画像やリンク、長期的な嗜好のために残している余白です。',
            imageSrc: '/about/preference-future.svg',
            imageAlt: '予備スロット',
        },
    ],
    info: {
        principlesTitle: 'Operating Principles',
        principles: [
            {
                title: 'Minimal',
                description: '限界利益が下がる動きは切り捨てる。',
            },
            {
                title: 'Leverage First',
                description: '同じ車輪を何度も作る作業はしない。',
            },
            {
                title: 'Ship to Reality',
                description: 'どれだけ良いアイデアでも、実装しなければゼロ。',
            },
        ],
        aboutTitle: '私について',
        aboutParagraphs: [
            '私は単なる情報システム領域の探求者というより、問題を動く仕組みに変える「システムビルダー」でありたいと思っています。',
            'AI をレバレッジとして使い、曖昧な構想を現実で動く構造に変えることに価値を感じています。',
        ],
        educationTitle: '学歴',
        educationBody: '天津工業大学 | 情報システム専攻 | システム工学の視点',
        currentTitle: '現在の状態',
        currentBody: 'AI レバレッジを探る | 独立プロダクトを磨く | 日本語 N2 を継続強化中',
    },
    narrative: {
        routeTitle: 'シリーズの道のり：初心者からシステム構築者へ',
        routeIntro:
            '最も美しいコードを書くことより、曖昧な要求を動くシステムへ組み上げることに価値を感じます。核にあるのは、レバレッジを見つけて走らせることです。',
    },
};

function withProfileMedia(content: AboutPageContent, media: AboutProfileMedia): AboutPageContent {
    const resolved = resolveAboutProfileMedia(media);

    return {
        ...content,
        hero: {
            ...content.hero,
            avatarSrc: resolved.avatarUrl,
        },
        personality: {
            ...content.personality,
            photoSrc: resolved.portraitUrl,
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
            description: '围绕头像、创造力引擎、人格画像、照片与兴趣偏好构建的 About 页面。',
        };
    }

    return {
        title: '私について',
        description: 'アバター、創造力、性格、写真、趣味と嗜好で構成した About ページです。',
    };
}
