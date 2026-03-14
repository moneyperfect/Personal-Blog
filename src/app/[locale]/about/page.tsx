import { setRequestLocale } from 'next-intl/server';
import AboutExperience from '@/components/about/AboutExperience';
import type { AboutPageContent } from '@/components/about/types';

type Props = { params: Promise<{ locale: string }> };

const zhContent: AboutPageContent = {
    hero: {
        eyebrow: 'About Me / Personal Dossier',
        name: '你好，我是 NAS。',
        tagline:
            '我想把这个页面打造成一张更完整的个人档案页：有主视觉、有能力结构、有兴趣偏好，也有能承接未来作品与品牌的空间。',
        introTitle: '关于我是谁',
        introBody:
            '这里先用高质量 demo 内容占位。后面你只需要把真实经历、身份介绍、教育背景和职业方向替换进去，不用再重做结构。',
        introBullets: [
            '偏好长期主义与可持续积累',
            '把内容、产品与系统能力一起往前推',
            '希望页面既有审美，也能形成真实的承接能力',
        ],
        status: 'Open to collaborate',
        primaryCta: '联系我',
        secondaryCta: '合作入口',
        floatingPills: ['艺术创作', '编程设计', '捕捉瞬间', '无限进步', '重构表达', '持续积累'],
        journeyTitle: '生涯无限接近',
        journeyBody:
            '这一块先承接“正在靠近怎样的人生状态”这种主题。后续可以换成你的真实轨迹、阶段目标和个人方法论。',
        journeyItems: [
            '从内容表达转向更完整的产品思维',
            '让博客成为长期生长的个人品牌站',
            '持续打磨体验、后台与作品呈现的协同感',
        ],
    },
    skills: {
        title: '创造力引擎',
        intro:
            '这一层不是后台式的功能清单，而是更像个人档案页里的能力展示。上面是流动的能力关键词，下面是更具体的技能板块。',
        marquee: [
            { label: 'Next.js', icon: 'N' },
            { label: 'TypeScript', icon: 'TS' },
            { label: 'Framer Motion', icon: 'FM' },
            { label: 'Tailwind CSS', icon: 'TW' },
            { label: 'Supabase', icon: 'SB' },
            { label: 'Content Design', icon: 'CD' },
            { label: 'Automation', icon: 'AU' },
            { label: 'Prompt Systems', icon: 'PS' },
            { label: 'Landing Pages', icon: 'LP' },
            { label: 'Admin Dashboard', icon: 'AD' },
        ],
        displayGroups: [
            {
                title: '前端设计',
                summary: '做得不是单纯的网页，而是有情绪、有层次、有记忆点的页面表达。',
                icon: 'UI',
                items: ['布局节奏', '视觉系统', '交互动效', '响应式体验'],
            },
            {
                title: '内容系统',
                summary: '把笔记、产品、专题页和后台串起来，让内容不是散落的，而是可积累的。',
                icon: 'CT',
                items: ['Markdown 流程', '内容模型', '后台编辑', '信息分层'],
            },
            {
                title: '产品承接',
                summary: '不仅考虑展示，也考虑咨询、入口、信任感以及未来可延展的产品结构。',
                icon: 'PD',
                items: ['CTA 设计', '产品介绍', '咨询入口', '转化路径'],
            },
        ],
    },
    personality: {
        title: '性格与照片',
        intro: '先把 MBTI 与照片组合成页面中的第一块大模块，形成清晰的“人物感”和“档案感”。',
        mbti: 'INTP',
        mbtiLabel: '提倡者型之外，更偏向冷静的结构探索者',
        mbtiSummary:
            '我偏理性，也喜欢独立地把复杂问题拆开来理解。相比堆很多视觉元素，我更在意结构是否清晰、表达是否克制，以及页面是否经得起长时间迭代。',
        photoTitle: '个人照片位',
        photoBody: '这里先用占位人像图来模拟照片位置，后续你只需要替换成真实照片即可。',
        talentsTitle: '我的特长',
        talentsIntro: '这一块先保留成可读性很强的能力卡形式，后续可替换成你的真实擅长方向。',
        talents: [
            { title: '页面表达', description: '把复杂内容变成易读、顺眼、有记忆点的视觉结构。' },
            { title: '系统拆解', description: '擅长把零散需求整理成一套更稳定、更可复用的方案。' },
            { title: '长期迭代', description: '比起一次性惊艳，我更重视持续优化带来的稳定进步。' },
        ],
    },
    worksTitle: '我的作品',
    worksIntro: '这里先做成大图轮播型模块，后续可以替换成你真正想展示的项目、站点或产品。',
    works: [
        {
            title: 'Personal Brand Site',
            summary: '把个人主页、产品页、内容系统和品牌表达做成同一套体验语言。',
            imageSrc: '/about/work-launch.svg',
            imageAlt: '作品占位图 1',
            meta: 'Brand / Web',
        },
        {
            title: 'Content Growth System',
            summary: '围绕笔记、专题页与后台编辑能力，搭出更适合长期积累的内容系统。',
            imageSrc: '/about/work-systems.svg',
            imageAlt: '作品占位图 2',
            meta: 'System / Content',
        },
        {
            title: 'Studio Experiment',
            summary: '持续试验页面动效、布局节奏与卡片结构，把网站当作长期实验场。',
            imageSrc: '/about/work-studio.svg',
            imageAlt: '作品占位图 3',
            meta: 'Visual / Motion',
        },
    ],
    gamesTitle: '游戏爱好者',
    gamesIntro: '用一整行两个并列模块承接“游戏偏好”这一部分，后续可替换成真实游戏封面与链接。',
    games: [
        {
            title: 'Inside',
            summary: '偏爱氛围、叙事、空间感都很克制的作品，也喜欢这种留白式的表达。',
            imageSrc: '/about/game-odyssey.svg',
            imageAlt: '游戏占位图 1',
            tag: '游戏爱好者',
        },
        {
            title: 'Black Myth',
            summary: '更偏爱有强烈气场与视觉完成度的作品，也希望页面表达能有类似的完成感。',
            imageSrc: '/about/game-myth.svg',
            imageAlt: '游戏占位图 2',
            tag: '游戏爱好者',
        },
    ],
    animeTitle: '爱好番剧',
    animeIntro: '这一块先接入图片占位结构，并保留 hover 聚焦、放大与顺滑切换的能力，后续再替换成真实番剧封面。',
    anime: [
        {
            title: 'Cosmos Layer',
            description: '偏爱科幻感、氛围感和视觉叙事强的作品。',
            imageSrc: '/about/anime-cosmos.svg',
            imageAlt: '番剧占位图 1',
            tag: 'Anime',
        },
        {
            title: 'Blue Dawn',
            description: '更喜欢能在静和动之间找到节奏的作品。',
            imageSrc: '/about/anime-dawn.svg',
            imageAlt: '番剧占位图 2',
            tag: 'Anime',
        },
        {
            title: 'Circuit World',
            description: '科技、未来、系统感是我很容易被打动的方向。',
            imageSrc: '/about/anime-circuit.svg',
            imageAlt: '番剧占位图 3',
            tag: 'Anime',
        },
        {
            title: 'Rain Archive',
            description: '也偏爱有情绪留白和氛围纵深的故事。',
            imageSrc: '/about/anime-rain.svg',
            imageAlt: '番剧占位图 4',
            tag: 'Anime',
        },
    ],
    musicCard: {
        title: '音乐偏好',
        description: '这里后续可以替换成你常听的音乐风格、歌单入口，或者能代表你状态的一张封面图。',
        imageSrc: '/about/media-music.svg',
        imageAlt: '音乐偏好占位图',
        tag: 'Music',
    },
    focusCard: {
        title: '关注偏好',
        description: '这里可以放 AI、产品、自动化、个人成长、效率方法论等你长期关注的主题。',
        imageSrc: '/about/media-focus.svg',
        imageAlt: '关注偏好占位图',
        tag: 'Focus',
    },
    info: {
        title: '信息模块',
        statsTitle: '网站访问统计',
        stats: [
            { label: '文章示意数', value: '24+' },
            { label: '主题迭代', value: 'V4' },
            { label: '方向', value: '个人品牌站' },
            { label: '长期目标', value: '内容复利系统' },
        ],
        mapTitle: '地图上的位置',
        mapBody: '这里先保留地图位与说明文字，后续可以替换为真实城市、活动区域或更具情绪表达的地点信息。',
        identityTitle: '关于我是谁',
        identityBody: '这里后续可以放自我介绍、教育背景、职业状态以及你希望别人如何认识你。',
        educationTitle: '教育经历',
        educationItems: ['计算机方向', '持续自学与长期积累', '关注产品与创作交叉领域'],
        currentTitle: '当前职业',
        currentItems: ['个人博客运营', '独立产品探索', '内容与表达系统迭代'],
    },
    narrative: {
        routeTitle: '系列路程',
        routeIntro: '这一部分继续保留现在的模式，但视觉上会对齐整页的档案式节奏。',
        routeItems: [
            {
                stage: 'Phase 01',
                title: '开始记录与表达',
                description: '从写作与整理开始，慢慢建立自己的表达方式和信息取舍习惯。',
            },
            {
                stage: 'Phase 02',
                title: '转向系统与产品',
                description: '从单篇内容转向整体结构，开始思考页面、产品和后台之间如何相互支撑。',
            },
            {
                stage: 'Phase 03',
                title: '形成个人品牌站',
                description: '把 about、产品、笔记与作品串联成更完整的个人品牌体验。',
            },
        ],
        pactTitle: '实验之约',
        pactIntro: '这里保留为长期计划型模块，后续可以替换成你真正的长期主义计划与阶段性承诺。',
        pactItems: ['保持持续迭代', '让内容与产品互相支撑', '把网站做成长期积累的资产'],
    },
    support: {
        title: '致谢赞赏名单',
        intro: '这一块继续保留为支持者与致谢区域，后续可以换成真实的名字、留言与金额。',
        supporters: [
            { name: '示意用户 A', amount: '¥66', note: '感谢你的分享，这一页的气质真的很舒服。' },
            { name: '示意用户 B', amount: '¥99', note: '很期待你继续完善这个站点。' },
            { name: '示意用户 C', amount: '¥36', note: '主题方向很喜欢，会持续关注。' },
            { name: '示意用户 D', amount: '¥188', note: '支持长期创作，也感谢你认真打磨页面。' },
        ],
        ctaTitle: '主题和结构已经对齐，内容后面再慢慢填。',
        ctaBody: '这一轮的重点是把布局、模块顺序、互动方式和图片占位能力搭好，后续你只需要逐步替换真实内容。',
        primaryCta: '继续完善内容',
        secondaryCta: '先浏览笔记',
    },
};

const jaContent: AboutPageContent = {
    hero: {
        eyebrow: 'About Me / Personal Dossier',
        name: 'こんにちは、NAS です。',
        tagline:
            'このページは、個人紹介だけでなく、表現・作品・興味・ブランド感をまとめたプロフィールページとして育てていく想定です。',
        introTitle: '私は誰か',
        introBody:
            'ここは高品質なダミー内容を置いています。あとで実際の自己紹介、学歴、仕事、価値観に差し替えやすい構造にしています。',
        introBullets: [
            '長期的に積み上がるものを好む',
            'コンテンツ、プロダクト、仕組みを一緒に育てる',
            '見た目だけでなく受け皿としての機能も重視する',
        ],
        status: 'Open to collaborate',
        primaryCta: '連絡する',
        secondaryCta: '協力入口',
        floatingPills: ['Art Direction', 'Frontend Design', 'Capture Moments', 'Keep Evolving', 'Refine Ideas', 'Build Slowly'],
        journeyTitle: '生涯、無限に近づく',
        journeyBody: 'ここは「今どんな方向へ近づいているか」を示すための軌跡カードです。',
        journeyItems: [
            '表現からより立体的なプロダクト思考へ',
            'ブログを個人ブランドの拠点へ育てる',
            '体験、管理画面、作品導線の一体感を磨き続ける',
        ],
    },
    skills: {
        title: 'Creative Engine',
        intro:
            'ここは管理画面のような一覧ではなく、個人プロフィールページとしての能力表現に寄せたセクションです。',
        marquee: [
            { label: 'Next.js', icon: 'N' },
            { label: 'TypeScript', icon: 'TS' },
            { label: 'Framer Motion', icon: 'FM' },
            { label: 'Tailwind CSS', icon: 'TW' },
            { label: 'Supabase', icon: 'SB' },
            { label: 'Content Design', icon: 'CD' },
            { label: 'Automation', icon: 'AU' },
            { label: 'Prompt Systems', icon: 'PS' },
            { label: 'Landing Pages', icon: 'LP' },
            { label: 'Admin Dashboard', icon: 'AD' },
        ],
        displayGroups: [
            {
                title: 'Frontend Design',
                summary: '整った見た目だけでなく、空気感や視線の流れまで設計する。',
                icon: 'UI',
                items: ['レイアウト', 'ビジュアル', 'モーション', 'レスポンシブ'],
            },
            {
                title: 'Content Systems',
                summary: 'ノート、商品、特集ページ、管理画面を一つの流れとしてつなぐ。',
                icon: 'CT',
                items: ['Markdown', '編集基盤', '情報整理', '構造化'],
            },
            {
                title: 'Product Thinking',
                summary: '見せるだけでなく、相談、導線、信頼形成まで含めて考える。',
                icon: 'PD',
                items: ['CTA', '商品紹介', '相談入口', '導線設計'],
            },
        ],
    },
    personality: {
        title: '性格と写真',
        intro: 'まず MBTI と写真を一つの主役モジュールとしてまとめ、ページの人物感を強めます。',
        mbti: 'INTP',
        mbtiLabel: '静かに構造を探るタイプ',
        mbtiSummary:
            '理性的で、物事を一度分解して考えることを好みます。要素を増やすより、構造と余白を整えることで印象を作る方が好きです。',
        photoTitle: 'Portrait Slot',
        photoBody: '今はダミー画像ですが、あとで実際の写真にそのまま差し替えられます。',
        talentsTitle: '私の強み',
        talentsIntro: 'ここは読みやすいカード型の強み紹介として残し、あとで実際の内容へ差し替えます。',
        talents: [
            { title: 'Page Expression', description: '複雑な内容を読みやすく、記憶に残る構成へ整理する。' },
            { title: 'System Thinking', description: 'ばらけた要求を、一つの再利用しやすい形へまとめる。' },
            { title: 'Long-term Iteration', description: '一度きりの完成より、継続的な改善で強くする。' },
        ],
    },
    worksTitle: 'My Works',
    worksIntro: 'ここは大きめの作品カルーセルとして整え、あとで本物のプロジェクト紹介に差し替えます。',
    works: [
        {
            title: 'Personal Brand Site',
            summary: 'プロフィール、商品、ノート、ブランド表現を一つの体験としてまとめる。',
            imageSrc: '/about/work-launch.svg',
            imageAlt: 'Work placeholder 1',
            meta: 'Brand / Web',
        },
        {
            title: 'Content Growth System',
            summary: 'ノートと管理画面を軸に、長く育つコンテンツ基盤を整える。',
            imageSrc: '/about/work-systems.svg',
            imageAlt: 'Work placeholder 2',
            meta: 'System / Content',
        },
        {
            title: 'Studio Experiment',
            summary: '動き、カード構成、ページの空気感を継続的に試す実験場。',
            imageSrc: '/about/work-studio.svg',
            imageAlt: 'Work placeholder 3',
            meta: 'Visual / Motion',
        },
    ],
    gamesTitle: 'Game Hobby',
    gamesIntro: 'ここは横並び 2 カードで、ゲーム嗜好の存在感をページ内に残す構成にします。',
    games: [
        {
            title: 'Inside',
            summary: '静かな緊張感と余白のある表現を持つ作品が好きです。',
            imageSrc: '/about/game-odyssey.svg',
            imageAlt: 'Game placeholder 1',
            tag: 'Game Hobby',
        },
        {
            title: 'Black Myth',
            summary: '完成度と気迫が高いビジュアル表現にも惹かれます。',
            imageSrc: '/about/game-myth.svg',
            imageAlt: 'Game placeholder 2',
            tag: 'Game Hobby',
        },
    ],
    animeTitle: 'Favorite Anime',
    animeIntro: 'このセクションは画像前提で組み、hover で拡大・フォーカスが切り替わるようにします。',
    anime: [
        {
            title: 'Cosmos Layer',
            description: 'SF と静かな世界観に惹かれることが多いです。',
            imageSrc: '/about/anime-cosmos.svg',
            imageAlt: 'Anime placeholder 1',
            tag: 'Anime',
        },
        {
            title: 'Blue Dawn',
            description: '動と静のリズムがある作品に惹かれます。',
            imageSrc: '/about/anime-dawn.svg',
            imageAlt: 'Anime placeholder 2',
            tag: 'Anime',
        },
        {
            title: 'Circuit World',
            description: '未来感や構造感のある作品も好みです。',
            imageSrc: '/about/anime-circuit.svg',
            imageAlt: 'Anime placeholder 3',
            tag: 'Anime',
        },
        {
            title: 'Rain Archive',
            description: '感情の余白がある作品も好きです。',
            imageSrc: '/about/anime-rain.svg',
            imageAlt: 'Anime placeholder 4',
            tag: 'Anime',
        },
    ],
    musicCard: {
        title: 'Music Taste',
        description: 'よく聴く音楽やプレイリスト、制作中の空気感に合う一枚をあとで入れられます。',
        imageSrc: '/about/media-music.svg',
        imageAlt: 'Music placeholder',
        tag: 'Music',
    },
    focusCard: {
        title: 'Focus Topics',
        description: 'AI、プロダクト、創作、自動化、個人成長など、長く関心を持つテーマの置き場です。',
        imageSrc: '/about/media-focus.svg',
        imageAlt: 'Focus placeholder',
        tag: 'Focus',
    },
    info: {
        title: 'Information',
        statsTitle: 'Site Stats',
        stats: [
            { label: 'Articles', value: '24+' },
            { label: 'Theme Iteration', value: 'V4' },
            { label: 'Direction', value: 'Brand Site' },
            { label: 'Long Goal', value: 'Compounding System' },
        ],
        mapTitle: 'Map Position',
        mapBody: 'ここは後で実際の都市や活動エリア、感情のある場所情報に差し替えられます。',
        identityTitle: 'Who I Am',
        identityBody: '自己紹介、学歴、仕事、どう見られたいかをまとめるための情報カードです。',
        educationTitle: 'Education',
        educationItems: ['Computer direction', 'Self-learning and long-term building', 'Product + creation crossover'],
        currentTitle: 'Current Work',
        currentItems: ['Personal blog operation', 'Independent product exploration', 'Content and expression iteration'],
    },
    narrative: {
        routeTitle: 'Series Route',
        routeIntro: '後半は現在の方向性を保ちつつ、整った情報カードとしてまとめ直します。',
        routeItems: [
            {
                stage: 'Phase 01',
                title: 'Start from writing',
                description: '書くことと整理することを通して、自分の表現習慣を作っていく。',
            },
            {
                stage: 'Phase 02',
                title: 'Move toward systems',
                description: '単体の内容ではなく、全体構造としてどう機能するかを考え始める。',
            },
            {
                stage: 'Phase 03',
                title: 'Shape a brand site',
                description: 'About、商品、ノート、作品が一つのブランド体験になるようにつなげていく。',
            },
        ],
        pactTitle: 'Creative Pact',
        pactIntro: 'ここは長期的なテーマや計画を置くためのカードとして残します。',
        pactItems: ['Keep iterating', 'Connect content and products', 'Build long-term brand assets'],
    },
    support: {
        title: 'Supporters / Thanks',
        intro: 'このブロックは支援者と感謝の一覧として残し、あとで実際の名前とメッセージに差し替えられます。',
        supporters: [
            { name: 'Demo User A', amount: '¥66', note: 'このページの空気感がとても好きです。' },
            { name: 'Demo User B', amount: '¥99', note: '今後の更新も楽しみにしています。' },
            { name: 'Demo User C', amount: '¥36', note: 'テーマの方向性がとても良いです。' },
            { name: 'Demo User D', amount: '¥188', note: '長く続く創作を応援しています。' },
        ],
        ctaTitle: '構造と順序は整ったので、次は本当の内容を埋める段階です。',
        ctaBody: 'この版ではモジュール順序、画像スロット、hover、作品導線まで先に整えています。',
        primaryCta: '内容を詰める',
        secondaryCta: '先にノートを見る',
    },
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;

    return {
        title: locale === 'zh' ? '关于我' : '私について',
        description:
            locale === 'zh'
                ? '个人档案式 About 页面，强调主视觉、技能展示、兴趣模块与长期品牌表达。'
                : 'Visual-first About page with dossier structure, skill display, media modules, and long-term brand expression.',
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <AboutExperience locale={locale} content={locale === 'zh' ? zhContent : jaContent} />;
}
