import { setRequestLocale } from 'next-intl/server';
import AboutExperience, { type AboutExperienceContent } from '@/components/about/AboutExperience';

type Props = { params: Promise<{ locale: string }> };

const zhContent: AboutExperienceContent = {
    hero: {
        eyebrow: 'About Me / Personal Signal',
        title: '我做数字产品，',
        subtitle: '也把想法做成带动增长的体验。',
        description:
            '这不是一张传统商务介绍页，而是一张更接近个人作品集的品牌页面。我关注产品验证、自动化工作流、内容资产化，以及把抽象想法打磨成可以被用户感知的真实体验。',
        primaryCta: '和我聊聊项目',
        secondaryCta: '添加联系方式',
        status: 'Open to collaborate',
    },
    labels: ['Product Builder', 'AI Workflow Designer', 'Content Systems', 'Growth-minded Operator'],
    stats: [
        { value: '0 → 1', label: '从概念、定位到上线，把模糊想法变成可交付页面与产品。' },
        { value: 'Multi', label: '同时覆盖策略、设计表达、前端体验与内容系统。' },
        { value: 'Fast', label: '偏好快速验证、小步迭代、用真实反馈校正方向。' },
        { value: 'Human', label: '强调节奏、细节与叙事，让产品更有感知温度。' },
    ],
    timelineTitle: 'Trajectory',
    timelineIntro: '不是单一职业路径，而是一条把内容、产品和体验逐步融合的路线。',
    timeline: [
        {
            year: 'Phase 01',
            title: '从内容与表达开始',
            description: '先从写作、信息整理和内容表达切入，逐渐建立起对用户视角、结构设计和价值传递的敏感度。',
        },
        {
            year: 'Phase 02',
            title: '转向产品与工作流',
            description: '开始关注工具、自动化和商业化路径，不再只写内容，而是思考如何把内容和产品能力变成持续增长的系统。',
        },
        {
            year: 'Phase 03',
            title: '构建个人品牌型产品矩阵',
            description: '把博客、产品、SaaS 方向、资源库和咨询能力组合成一个更立体的个人品牌体系，让每个入口都能承接同一种价值感。',
        },
    ],
    capabilityTitle: 'What I Build',
    capabilityIntro: '我更擅长把“有潜力但还不清晰”的东西，打磨成可上线、可表达、可转化的形态。',
    capabilities: [
        {
            title: '产品叙事',
            description: '梳理价值主张、定位差异和页面语言，让用户在更短时间里理解你为什么值得被记住。',
            accent: 'linear-gradient(90deg, rgba(34,211,238,0.95), rgba(96,165,250,0.25))',
        },
        {
            title: '高质感前端页面',
            description: '用更强的视觉层级、滚动节奏、动效反馈和细节感，让页面看起来不像模板站。',
            accent: 'linear-gradient(90deg, rgba(244,114,182,0.95), rgba(168,85,247,0.30))',
        },
        {
            title: '自动化内容系统',
            description: '把笔记、资源、产品、后台和工作流串联起来，减少重复劳动，让内容成为资产而不是负担。',
            accent: 'linear-gradient(90deg, rgba(250,204,21,0.95), rgba(34,211,238,0.25))',
        },
        {
            title: '增长导向优化',
            description: '不只关注视觉美感，也会考虑入口结构、转化动作、信任信号和长期可维护性。',
            accent: 'linear-gradient(90deg, rgba(52,211,153,0.95), rgba(59,130,246,0.28))',
        },
        {
            title: 'MVP 快速推进',
            description: '在信息还不完整时也能快速推进，通过更轻的版本先跑起来，再用反馈决定下一步。',
            accent: 'linear-gradient(90deg, rgba(129,140,248,0.95), rgba(236,72,153,0.32))',
        },
        {
            title: '品牌感塑造',
            description: '让个人博客不止是展示页，而是具有记忆点、审美方向和气质差异的个人品牌空间。',
            accent: 'linear-gradient(90deg, rgba(251,146,60,0.95), rgba(244,114,182,0.28))',
        },
    ],
    fragmentsTitle: 'Fragments',
    fragmentsIntro: '我希望自己的页面不只是“信息完整”，而是带有态度、速度感和一点点惊喜。',
    fragments: [
        {
            title: '我在意第一屏的气场',
            description: '用户通常在几秒内决定要不要继续看下去，所以第一屏必须同时传达风格、能力和方向感。',
        },
        {
            title: '我喜欢可感知的动效',
            description: '动效不只是炫技，它应该帮助页面建立节奏、反馈和层次，让品牌气质真正被感受到。',
        },
        {
            title: '我偏爱系统感而不是堆功能',
            description: '工具越多不一定越好，更关键的是让内容、产品、后台和转化入口彼此联动起来。',
        },
        {
            title: '我在做长期复利的东西',
            description: '不追求一次性爆发，更看重长期积累后形成的内容护城河、产品矩阵和个人品牌势能。',
        },
    ],
    cta: {
        title: '如果你也想把个人品牌站做得更有辨识度，我们可以聊聊。',
        description: '无论是博客升级、产品页重做、后台系统整理，还是从 0 到 1 的个人品牌型产品规划，我都更喜欢用可落地的方式推进，而不是停留在空泛建议上。',
        primary: '联系我',
        secondary: '先看看我的笔记',
    },
};

const jaContent: AboutExperienceContent = {
    hero: {
        eyebrow: 'About Me / Personal Signal',
        title: 'デジタルプロダクトを作り、',
        subtitle: 'アイデアを体験として形にしています。',
        description:
            'これは普通の会社紹介ページではなく、よりパーソナルなポートフォリオに近い About ページです。私はプロダクト検証、AI ワークフロー、自動化、コンテンツ資産化、そして印象に残る体験設計に取り組んでいます。',
        primaryCta: '相談してみる',
        secondaryCta: '連絡先を見る',
        status: 'Open to collaborate',
    },
    labels: ['Product Builder', 'AI Workflow Designer', 'Content Systems', 'Growth-minded Operator'],
    stats: [
        { value: '0 → 1', label: '曖昧なアイデアを、公開できるページとプロダクトへ変えていきます。' },
        { value: 'Multi', label: '戦略、表現、フロントエンド、コンテンツ設計まで横断して考えます。' },
        { value: 'Fast', label: '小さく早く試し、実際の反応で次の方向を調整するのが得意です。' },
        { value: 'Human', label: '数字だけでなく、温度感や伝わり方も大切にしています。' },
    ],
    timelineTitle: 'Trajectory',
    timelineIntro: '単なる職歴ではなく、表現・プロダクト・体験が重なってできた流れです。',
    timeline: [
        {
            year: 'Phase 01',
            title: 'コンテンツと表現から出発',
            description: '文章、構造化、情報整理から始まり、ユーザー視点で価値を伝える感覚を磨いてきました。',
        },
        {
            year: 'Phase 02',
            title: 'プロダクトとワークフローへ拡張',
            description: 'コンテンツだけでなく、ツール、自動化、収益化導線まで含めて設計するようになりました。',
        },
        {
            year: 'Phase 03',
            title: '個人ブランド型プロダクト群を構築',
            description: 'ブログ、プロダクト、SaaS の構想、資料、相談導線を一つのブランド体験として接続しています。',
        },
    ],
    capabilityTitle: 'What I Build',
    capabilityIntro: 'まだ輪郭の曖昧なものを、公開できる形まで磨き上げるのが得意です。',
    capabilities: [
        {
            title: 'プロダクトストーリー設計',
            description: '価値提案、差別化、ページ上の言葉を整理し、短時間で伝わる構成にします。',
            accent: 'linear-gradient(90deg, rgba(34,211,238,0.95), rgba(96,165,250,0.25))',
        },
        {
            title: '印象に残るフロントエンド',
            description: 'テンプレート感のない視覚表現、動き、余白、情報の流れを丁寧に整えます。',
            accent: 'linear-gradient(90deg, rgba(244,114,182,0.95), rgba(168,85,247,0.30))',
        },
        {
            title: '自動化されたコンテンツ基盤',
            description: 'ノート、資料、プロダクト、管理画面をつなげて、運用コストを下げながら価値を積み上げます。',
            accent: 'linear-gradient(90deg, rgba(250,204,21,0.95), rgba(34,211,238,0.25))',
        },
        {
            title: '成長を見据えた改善',
            description: '見た目だけでなく、導線、信頼感、変換率、継続運用のしやすさも一緒に考えます。',
            accent: 'linear-gradient(90deg, rgba(52,211,153,0.95), rgba(59,130,246,0.28))',
        },
        {
            title: 'MVP の高速立ち上げ',
            description: '情報が十分でなくても、まず試せる形を作り、反応を見ながら前に進めます。',
            accent: 'linear-gradient(90deg, rgba(129,140,248,0.95), rgba(236,72,153,0.32))',
        },
        {
            title: 'ブランド感の設計',
            description: 'ブログを単なる記録場所ではなく、記憶に残る個人ブランド空間として育てます。',
            accent: 'linear-gradient(90deg, rgba(251,146,60,0.95), rgba(244,114,182,0.28))',
        },
    ],
    fragmentsTitle: 'Fragments',
    fragmentsIntro: '情報が揃っているだけでなく、空気感や姿勢まで伝わるページを目指しています。',
    fragments: [
        {
            title: 'ファーストビューの空気感を重視',
            description: '数秒で印象が決まるからこそ、最初の画面で方向性と雰囲気を同時に伝えることを大切にしています。',
        },
        {
            title: '動きは演出ではなく体験',
            description: 'アニメーションは目立つためだけではなく、リズムや階層、フィードバックを作るために使います。',
        },
        {
            title: '機能の多さよりシステム感',
            description: '要素をただ増やすより、コンテンツ、導線、運用、ブランドがつながる構造を重視します。',
        },
        {
            title: '長く効く資産を作る',
            description: '短期的な派手さより、積み上がっていくブランド、コンテンツ、プロダクトの複利を目指しています。',
        },
    ],
    cta: {
        title: '個人ブランドサイトをもっと印象的にしたいなら、ぜひ話しましょう。',
        description: 'ブログの刷新、プロダクトページ改善、管理画面の整理、0→1 の個人ブランド設計まで、実装と運用を前提に進めるのが得意です。',
        primary: '問い合わせる',
        secondary: 'ノートを見る',
    },
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;

    return {
        title: locale === 'zh' ? '关于我' : '私について',
        description:
            locale === 'zh'
                ? '更接近个人作品集气质的 About 页面，展示我如何把产品、内容和体验串成一个更有记忆点的个人品牌。'
                : 'プロダクト、コンテンツ、体験設計をつなぐ個人ブランド型 About ページです。',
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const content = locale === 'zh' ? zhContent : jaContent;

    return <AboutExperience locale={locale} content={content} />;
}
