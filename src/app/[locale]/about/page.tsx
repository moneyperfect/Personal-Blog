import { setRequestLocale } from 'next-intl/server';
import AboutExperience from '@/components/about/AboutExperience';
import type { AboutPageContent } from '@/components/about/types';

type Props = { params: Promise<{ locale: string }> };

const zhContent: AboutPageContent = {
    hero: {
        eyebrow: 'About Me / Theme Demo',
        name: '你好，我是 NAS。',
        tagline:
            '这个页面先不急着写满真实经历，而是先把你想要的主题、模块、布局节奏和悬停表现搭成一个更接近参考页的浅色个人档案页。',
        introTitle: '关于我是谁',
        introBody:
            '这里先放示意内容。后面你可以把它替换成自己的身份介绍、做事方式、擅长方向、教育经历与当前阶段的核心目标。',
        introBullets: [
            '长期主义取向，想把博客做成个人品牌阵地',
            '内容、产品、自动化与表达系统并行推进',
            '希望页面不只是展示，而是能承接机会与信任',
        ],
        status: 'Open to collaborate',
        primaryCta: '联系我',
        secondaryCta: '合作入口',
        floatingSkills: ['Next.js', 'Motion', 'Branding', 'Automation'],
        profileSummary: ['个人博客', '长期主义', '产品表达'],
        journeyTitle: '生涯无限接近',
        journeyBody:
            '这个模块先模拟参考页右侧的人生轨迹卡片。等主题骨架稳定后，我们再把它替换成你的真实教育、职业阶段和长期路线。',
        journeyItems: [
            '从写作表达逐步过渡到产品思维',
            '把博客升级成可持续生长的个人品牌网站',
            '持续打磨后台、体验与内容系统的协同感',
        ],
    },
    skills: {
        title: '开启创造',
        intro:
            '先把自动滚动的 skills 展示、鼠标移入暂停、卡片分区这些主题感做出来。后续你再把这里换成自己的技术栈、能力方向和个人介绍语。',
        marquee: [
            'Next.js',
            'TypeScript',
            'Framer Motion',
            'Tailwind CSS',
            'Supabase',
            'Content Design',
            'Automation',
            'Prompt Systems',
            'Landing Pages',
            'Admin Dashboard',
        ],
        categories: [
            {
                title: '页面表达',
                summary: '把想表达的内容拆成更有节奏的模块与视觉层次，而不是平铺直叙。',
                items: ['首屏结构', '模块编排', '视觉层次', '品牌感'],
                accent: 'linear-gradient(90deg,#8ec5ff,#c8ddff)',
            },
            {
                title: '产品承接',
                summary: '不仅考虑展示，也考虑转化路径、咨询入口、信任感与用户下一步动作。',
                items: ['CTA 设计', '产品页', '咨询入口', '信息分层'],
                accent: 'linear-gradient(90deg,#ffc6b3,#ffe0d4)',
            },
            {
                title: '系统能力',
                summary: '让博客、产品、后台和内容系统不是孤立存在，而是能互相支撑。',
                items: ['内容系统', '后台编辑', '结构优化', '长期迭代'],
                accent: 'linear-gradient(90deg,#b8e7d3,#d5f3e7)',
            },
        ],
    },
    personality: {
        title: '性格与偏好',
        intro:
            '这一段先把你提到的“性格模块 + 照片 + 爱好/动漫/音乐/关注偏好”这些块状结构做齐，当前内容先用演示信息占位。',
        mbti: 'INTP',
        mbtiSummary:
            '偏理性、喜欢独立思考，也容易被系统、结构和页面节奏打动。比起堆砌元素，更在意整体表达是否克制但有记忆点。',
        spotlightTitle: '个人照片位',
        spotlightBody:
            '这里现在先用占位肖像来模拟照片模块。后面可以替换成你的真实照片，或者更贴近你个人气质的视觉素材。',
        highlights: [
            '偏爱有气场的首屏与清晰的信息层次',
            '喜欢细腻但不过度喧闹的动效表现',
            '对系统感、结构感和长期复利比较执着',
            '愿意持续打磨个人品牌的视觉表达',
        ],
        musicTitle: '音乐偏好',
        musicBody:
            '这里后面可以写你常听的音乐类型、歌单风格，或者用来表达你平时创作与工作时喜欢的氛围。',
        focusTitle: '关注偏好',
        focusBody:
            '这里可以放你长期关注的主题，比如产品、AI、创作、自动化、个人成长、效率方法论等。',
        galleryTitle: '爱好与收藏',
        galleryIntro:
            '先把“喜欢的动漫、兴趣、特长、收藏偏好”这种展示方式搭起来，后面再换成你自己的真实内容与封面。',
        posters: [
            {
                title: '喜欢的动漫 A',
                caption: '鼠标移上去会有放大和更顺滑的视觉过渡，先把交互味道做出来。',
                gradient: 'linear-gradient(160deg,#dfefff,#c6dbff)',
            },
            {
                title: '喜欢的动漫 B',
                caption: '这里现在先用示意海报，后续可以换成你真实喜欢的作品封面。',
                gradient: 'linear-gradient(160deg,#fff2db,#ffd9cc)',
            },
            {
                title: '个人爱好',
                caption: '可以替换成摄影、绘画、运动、收藏，或者任何能代表你的兴趣。',
                gradient: 'linear-gradient(160deg,#e6fbef,#cbeed8)',
            },
            {
                title: '擅长特长',
                caption: '这里也可以展示你擅长的创作方向、长期技能或偏爱的表达媒介。',
                gradient: 'linear-gradient(160deg,#f2eaff,#dfd3ff)',
            },
        ],
        traits: [
            { title: '节奏感', description: '做页面时，我很在意视觉起伏、阅读节奏和用户停留的气口。' },
            { title: '系统感', description: '我不喜欢模块彼此割裂，更希望它们能形成可复用的整体结构。' },
            { title: '审美方向', description: '我偏好克制但有记忆点的页面，而不是过度模板化的设计。' },
            { title: '长期主义', description: '我更愿意持续迭代，而不是只追求一次性的惊艳。' },
        ],
    },
    info: {
        title: '个人模块',
        statsTitle: '网站访问统计 / 个人信息',
        stats: [
            { label: '文章示意数', value: '24+' },
            { label: '当前主题迭代', value: 'V3 Demo' },
            { label: '产品方向', value: '个人品牌站' },
            { label: '长期目标', value: '内容复利系统' },
        ],
        mapTitle: '地图上的位置',
        mapBody:
            '这里现在是占位地图模块。后续可以替换成你的城市、工作区域，或者带有情绪表达的地点信息。',
        identityTitle: '关于我是谁',
        identityBody:
            '这里后面可以放真实的自我介绍、教育经历、当前职业、擅长领域，以及你希望别人如何认识你。',
        educationTitle: '教育经历',
        educationItems: ['示意教育经历 A', '示意教育经历 B', '示意研究方向 / 学习主题'],
        currentTitle: '当前职业',
        currentItems: ['示意职业身份 01', '示意正在做的事 02', '示意长期方向 03'],
    },
    narrative: {
        routeTitle: '系列路程',
        routeIntro:
            '这里先把参考页里那种“路程感”做出来。等后面补内容时，我们再把它换成你的真实阶段、项目线索和成长路径。',
        routeItems: [
            {
                stage: 'Phase 01',
                title: '开始记录与表达',
                description: '从写东西、整理内容开始，逐步建立自己的表达习惯、审美倾向和记录方式。',
            },
            {
                stage: 'Phase 02',
                title: '转向产品与系统',
                description: '开始思考博客如何承接机会，以及内容如何逐步产品化、系统化与长期迭代。',
            },
            {
                stage: 'Phase 03',
                title: '形成个人品牌站',
                description: '把 About、产品页、后台和资源页逐步连接成一个更完整的个人品牌体验。',
            },
        ],
        pactTitle: '实验之约 / 十年之约',
        pactIntro:
            '这里先做成一个长期计划型模块。后续可以写你的长期主义计划、站点愿景，或者你和读者之间的约定。',
        pactItems: [
            '持续迭代站点，而不是一次性完工',
            '让内容与产品互相支撑，形成长期价值',
            '把网站做成可复用、可积累的个人品牌资产',
        ],
    },
    support: {
        title: '致谢赞赏名单',
        intro:
            '这一块先把赞赏名单的主题结构做出来。等你确认要不要展示真实支持者信息后，再替换成真实名单、留言和金额。',
        supporters: [
            { name: '示意用户 A', amount: '¥66', note: '感谢你的分享，页面真的很有气质。' },
            { name: '示意用户 B', amount: '¥99', note: '期待你继续更新博客与产品内容。' },
            { name: '示意用户 C', amount: '¥36', note: '这个主题方向很喜欢，会继续关注。' },
            { name: '示意用户 D', amount: '¥188', note: '支持长期创作，也感谢你认真打磨页面体验。' },
        ],
        ctaTitle: '先把主题和布局对齐，内容后面再慢慢填。',
        ctaBody:
            '这一版的重点是先把你想模仿的模块划分、悬停表现、浅色主题和整体节奏做对。等这些骨架稳定后，我们再逐块替换成你的真实信息。',
        primaryCta: '继续完善内容',
        secondaryCta: '先浏览笔记',
    },
};

const jaContent: AboutPageContent = {
    hero: {
        eyebrow: 'About Me / Theme Demo',
        name: 'こんにちは、NAS です。',
        tagline:
            'このページはまず、参考にしたいテーマの空気感、浅色レイアウト、カード構成、ホバー表現を先に整えるためのデモです。',
        introTitle: '私は誰か',
        introBody:
            'ここはまだ仮の内容です。あとで本当の自己紹介、学歴、仕事、得意分野、価値観に差し替えられるように構造を先に整えています。',
        introBullets: [
            '個人ブランドとして長く育つブログを目指す',
            'コンテンツ、プロダクト、自動化、表現を並行して育てる',
            '見せるだけでなく機会と信頼を受け止めるサイトにしたい',
        ],
        status: 'Open to collaborate',
        primaryCta: '連絡する',
        secondaryCta: '協力入口',
        floatingSkills: ['Next.js', 'Motion', 'Branding', 'Automation'],
        profileSummary: ['Personal Blog', 'Long-term', 'Product Expression'],
        journeyTitle: '生涯、無限に近づく',
        journeyBody:
            'ここは参考ページ右側の人生カードを意識したデモです。あとで実際の学歴、職歴、長期ビジョンに置き換えられます。',
        journeyItems: [
            '表現からプロダクト思考へ',
            'ブログを個人ブランドの拠点へ育てる',
            '管理画面、体験、コンテンツを少しずつ連動させる',
        ],
    },
    skills: {
        title: '創造を起動する',
        intro:
            'まずは自動で流れる skills、ホバーで停止する挙動、分割カードのリズムなど、テーマの雰囲気を先に再現しています。',
        marquee: [
            'Next.js',
            'TypeScript',
            'Framer Motion',
            'Tailwind CSS',
            'Supabase',
            'Content Design',
            'Automation',
            'Prompt Systems',
            'Landing Pages',
            'Admin Dashboard',
        ],
        categories: [
            {
                title: 'ページ表現',
                summary: '伝えたいことを、平坦ではなくリズムのあるセクション構成へ変える。',
                items: ['ファーストビュー', 'モジュール配置', '視線誘導', 'ブランド感'],
                accent: 'linear-gradient(90deg,#8ec5ff,#c8ddff)',
            },
            {
                title: '受け皿設計',
                summary: 'ただ見せるのではなく、信頼感、入口、相談導線まで含めて考える。',
                items: ['CTA 設計', '商品ページ', '相談入口', '情報階層'],
                accent: 'linear-gradient(90deg,#ffc6b3,#ffe0d4)',
            },
            {
                title: 'システム感',
                summary: 'ブログ、商品、管理画面、コンテンツ基盤がつながるように整えていく。',
                items: ['コンテンツ基盤', '管理画面', '構造改善', '長期運用'],
                accent: 'linear-gradient(90deg,#b8e7d3,#d5f3e7)',
            },
        ],
    },
    personality: {
        title: '性格と嗜好',
        intro:
            'ここは「性格モジュール + 写真 + 趣味 + アニメ + 音楽 + 関心テーマ」のような構成を先に整えるためのデモです。',
        mbti: 'INTP',
        mbtiSummary:
            '理性と構造を好み、静かな表現や情報の整理に惹かれやすいタイプ。要素を増やすより、全体の印象を整える方が好きです。',
        spotlightTitle: 'Portrait Demo',
        spotlightBody:
            '今はダミーの肖像ですが、あとで自分の写真や、より自分らしいビジュアル素材に差し替えられます。',
        highlights: [
            '空気感のあるファーストビューが好き',
            'うるさすぎないモーションが好き',
            '構造がつながっていくサイトに惹かれる',
            '長く積み上がる個人ブランドを育てたい',
        ],
        musicTitle: '音楽の好み',
        musicBody: '普段よく聴く音楽、制作時の雰囲気、気分の切り替えに使うプレイリストなどを書けます。',
        focusTitle: '関心のあるテーマ',
        focusBody: 'プロダクト、AI、創作、自動化、個人成長、効率化など、長く関心を持つテーマの置き場です。',
        galleryTitle: '趣味とコレクション',
        galleryIntro:
            'アニメ、得意なこと、趣味、好きなビジュアルなどを並べるブロックとして先に構造だけ合わせています。',
        posters: [
            {
                title: 'Favorite Anime A',
                caption: 'Hover で拡大し、より滑らかな切り替えを感じられるダミーカードです。',
                gradient: 'linear-gradient(160deg,#dfefff,#c6dbff)',
            },
            {
                title: 'Favorite Anime B',
                caption: 'あとで実際に好きな作品やカバー画像へ差し替えられます。',
                gradient: 'linear-gradient(160deg,#fff2db,#ffd9cc)',
            },
            {
                title: 'Hobby Demo',
                caption: '写真、収集、創作、運動など、自分らしい趣味カードに置き換えられます。',
                gradient: 'linear-gradient(160deg,#e6fbef,#cbeed8)',
            },
            {
                title: 'Talent Demo',
                caption: '得意分野や長く育てているスキルを見せるカードとして使えます。',
                gradient: 'linear-gradient(160deg,#f2eaff,#dfd3ff)',
            },
        ],
        traits: [
            { title: 'Rhythm', description: 'ページには読む呼吸と視線の流れが必要だと考えています。' },
            { title: 'System', description: 'モジュールが孤立せず、全体としてつながる構造が好きです。' },
            { title: 'Taste', description: 'テンプレ感の薄い、静かだけど記憶に残る表現に惹かれます。' },
            { title: 'Long-term', description: '一度きりの驚きより、積み上がる継続性を大切にします。' },
        ],
    },
    info: {
        title: '個人モジュール',
        statsTitle: 'サイト統計 / 個人情報',
        stats: [
            { label: 'Demo Articles', value: '24+' },
            { label: 'Theme Iteration', value: 'V3 Demo' },
            { label: 'Direction', value: 'Personal Brand Site' },
            { label: 'Long Goal', value: 'Content Compound System' },
        ],
        mapTitle: '地図の上の位置',
        mapBody: 'ここは後で都市や活動エリア、思い入れのある場所情報に差し替えられる地図カードです。',
        identityTitle: '私は誰か',
        identityBody: '自己紹介、学歴、仕事、得意分野、どう見られたいかをまとめるためのカードです。',
        educationTitle: '教育歴',
        educationItems: ['Demo education item A', 'Demo education item B', 'Demo learning direction / focus'],
        currentTitle: '現在の仕事',
        currentItems: ['Demo role 01', 'Demo current focus 02', 'Demo long-term direction 03'],
    },
    narrative: {
        routeTitle: 'シリーズ路程',
        routeIntro:
            'ここでは参考ページの「道のり感」を先に整えています。あとで本当の人生段階やプロジェクトの流れに差し替えられます。',
        routeItems: [
            {
                stage: 'Phase 01',
                title: '記録と表現から始める',
                description: '書くこと、整理すること、見せ方を通して、自分の表現の土台を少しずつ作っていく。',
            },
            {
                stage: 'Phase 02',
                title: 'プロダクトと仕組みへ広げる',
                description: 'ブログを表現だけではなく、価値や機会を受け止める装置として考え始める。',
            },
            {
                stage: 'Phase 03',
                title: '個人ブランドサイトへ',
                description: 'About、商品、管理画面、ノートが一つのブランド体験としてつながっていく。',
            },
        ],
        pactTitle: '実験の約束 / 十年の約束',
        pactIntro: 'ここは長期ビジョン、継続の約束、読者との関係性を書くためのモジュールです。',
        pactItems: [
            '完成より継続的な改善を重視する',
            'コンテンツと商品が支え合う構造にする',
            'サイトを長く育つ個人ブランド資産にする',
        ],
    },
    support: {
        title: '感謝とサポート一覧',
        intro: 'このブロックはまず構成を合わせるためのダミーです。あとで実際の支援者情報に差し替えられます。',
        supporters: [
            { name: 'Demo Supporter A', amount: '¥66', note: 'ページの空気感がとても好きです。' },
            { name: 'Demo Supporter B', amount: '¥99', note: '今後の更新も楽しみにしています。' },
            { name: 'Demo Supporter C', amount: '¥36', note: '個人サイトの方向性がとても良いです。' },
            { name: 'Demo Supporter D', amount: '¥188', note: '長期的な制作を応援しています。' },
        ],
        ctaTitle: 'まずはテーマと構造をそろえる段階です。',
        ctaBody:
            'この版では、参考ページに近いモジュール構成、視線の流れ、浅色テーマ、ホバーの節度を先に整えています。実際の情報はあとから丁寧に差し替えられます。',
        primaryCta: '内容を詰めていく',
        secondaryCta: '先にノートを見る',
    },
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;

    return {
        title: locale === 'zh' ? '关于我' : '私について',
        description:
            locale === 'zh'
                ? '按个人档案页结构重做的 About 页面，目前先用示意内容完成主题、布局与交互。'
                : 'プロフィールページ構成を意識して作り直した About ページです。まずはテーマ、レイアウト、挙動を整えています。',
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <AboutExperience locale={locale} content={locale === 'zh' ? zhContent : jaContent} />;
}
