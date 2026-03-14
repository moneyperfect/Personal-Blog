import { setRequestLocale } from 'next-intl/server';
import AboutExperience, { type AboutExperienceContent } from '@/components/about/AboutExperience';

type Props = { params: Promise<{ locale: string }> };

const zhContent: AboutExperienceContent = {
    hero: {
        eyebrow: 'About Me / Personal Signal',
        name: '你好，我是 NAS。',
        headline: '我把内容、产品和体验，做成一个能持续生长的个人品牌系统。',
        description: '这页会更像个人档案，而不是传统商务简介。我关注产品验证、AI 工作流、自动化内容系统，以及如何让一个个人博客既有表达力，也有转化与复利能力。',
        primaryCta: '和我聊聊项目',
        secondaryCta: '查看联系方式',
        status: 'Open to collaborate',
        location: 'China / Remote-friendly',
        motto: '我希望网站既有风格，也有结构；既能表达自己，也能承接真正的产品与机会。',
    },
    labels: ['Product Builder', 'AI Workflow Designer', 'Content Systems', 'Growth-minded Operator', 'Personal Branding', 'Frontend Experience'],
    facts: [
        { label: '当前重心', value: '个人品牌型产品体系' },
        { label: '擅长方式', value: '0 到 1 快速推进' },
        { label: '关注方向', value: '内容 × 自动化 × 转化' },
        { label: '工作节奏', value: '先验证，再放大' },
    ],
    about: {
        title: '关于我',
        intro: '我不想把博客做成“标准模板站”，而更想把它打造成一个有气质、有层次、也能真实承接机会的个人空间。',
        paragraphs: [
            '我喜欢把模糊的想法慢慢打磨成可以上线的东西。它可以是一篇笔记、一张销售页、一个数字产品，也可以是一套能长期运转的内容系统。',
            '相比堆很多功能，我更在意页面有没有辨识度、信息有没有节奏、动效是不是服务表达、以及整个站点有没有形成一套属于自己的品牌语言。',
            '这也是为什么我会持续优化这个博客：它不只是内容容器，更像是一个不断进化中的个人产品实验室。',
        ],
        principles: [
            { title: '表达要有记忆点', description: '我希望用户进入页面后，不会觉得它和其他模板站没有区别。' },
            { title: '系统比碎片更重要', description: '单个页面再漂亮，如果不能和内容、产品、后台联动，也很难形成长期价值。' },
            { title: '动效应该帮助理解', description: '我喜欢动效，但更在意它是否帮助页面建立节奏、层次与反馈。' },
        ],
    },
    skills: {
        title: '我会用什么能力把想法落下来',
        intro: '我的工作方式通常不是单点输出，而是把产品思考、页面表达、技术实现和内容结构一起往前推。',
        marquee: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Supabase', 'Markdown Systems', 'Product Messaging', 'SEO-aware Content', 'Automation Workflows', 'Landing Pages', 'Admin Tools'],
        groups: [
            { title: '产品表达', items: ['价值主张梳理', '页面叙事', '转化结构', '个人品牌定位'], accent: 'linear-gradient(90deg, rgba(34,211,238,0.95), rgba(96,165,250,0.25))' },
            { title: '体验设计', items: ['视觉层级', '滚动节奏', '交互动效', '信息密度控制'], accent: 'linear-gradient(90deg, rgba(244,114,182,0.95), rgba(168,85,247,0.30))' },
            { title: '系统搭建', items: ['Next.js', '内容系统', '后台编辑器', 'Supabase 数据流'], accent: 'linear-gradient(90deg, rgba(250,204,21,0.95), rgba(34,211,238,0.25))' },
            { title: '效率工具', items: ['AI 工作流', '自动化 SOP', '模板化资产', '重复劳动缩减'], accent: 'linear-gradient(90deg, rgba(52,211,153,0.95), rgba(59,130,246,0.28))' },
            { title: '增长意识', items: ['入口设计', '信任信号', '用户路径', '轻量验证'], accent: 'linear-gradient(90deg, rgba(129,140,248,0.95), rgba(236,72,153,0.32))' },
            { title: '长期复利', items: ['博客矩阵', '资源沉淀', '数字产品', '品牌一致性'], accent: 'linear-gradient(90deg, rgba(251,146,60,0.95), rgba(244,114,182,0.28))' },
        ],
    },
    journey: {
        title: '经历轨迹',
        intro: '与其说是一条标准职业路线，不如说是内容、产品和体验慢慢融合成的一条路径。',
        timeline: [
            { year: 'Phase 01', title: '从表达与内容开始', description: '先从写作、信息整理和内容表达切入，逐渐建立对结构、用户理解与价值传递的敏感度。' },
            { year: 'Phase 02', title: '转向产品与工作流', description: '开始从“写内容”走向“做系统”，把自动化、产品化和效率工具一起纳入思考。' },
            { year: 'Phase 03', title: '构建个人品牌型站点', description: '博客、产品、笔记、资源和合作入口不再分散，而是慢慢形成一个更完整的品牌体验。' },
        ],
        snapshotTitle: '我现在在做什么',
        snapshotBody: '目前我更专注于把这个个人博客继续打磨成有审美、有结构、也有承接力的品牌型网站。',
        snapshotList: ['继续优化 About / 产品 / 后台体验', '让内容系统更适合长期积累', '把博客升级成真正的个人品牌阵地'],
    },
    personality: {
        title: '我的工作方式与个人偏好',
        intro: '我更喜欢那些兼顾审美、系统感和可执行性的东西，而不是只停留在概念层面的漂亮想法。',
        traits: [
            { title: '偏爱有气场的首屏', description: '第一屏必须有记忆点，要能迅速传达你的气质、方向和能力。' },
            { title: '喜欢细腻但克制的动效', description: '我不抗拒炫酷，但更希望它有节奏感，而不是把页面变成噪音现场。' },
            { title: '对系统感比较执着', description: '我会反复思考内容、产品、后台和转化入口之间是不是能真正连起来。' },
            { title: '长期主义偏重', description: '我更愿意做能慢慢积累势能的东西，而不是一次性的短期热闹。' },
        ],
    },
    site: {
        title: '这个站点正在变成什么',
        intro: '我希望它最终不是单一博客，也不是单一产品站，而是一个能同时承载表达、产品、资源、合作和实验的个人品牌系统。',
        blocks: [
            { title: '它是个人作品集', description: '我会用它展示自己的审美取向、页面表达和产品思考。' },
            { title: '它也是实验场', description: '很多页面结构、交互方式和内容组织方法，我都会先在这里试。' },
            { title: '它还是转化入口', description: '无论是咨询、合作还是未来的数字产品，都需要有一个像样的承接空间。' },
            { title: '它会持续迭代', description: '我不希望这个站定型太早，它应该跟着我一起成长。' },
        ],
    },
    cta: {
        title: '如果你也想把个人博客做得更有风格和辨识度，我们可以聊聊。',
        description: '不管你是想升级个人品牌站、做产品页、整理后台，还是搭建一个更有表达力的内容系统，我都更倾向于用可落地的方式推进。',
        primary: '联系我',
        secondary: '先看我的笔记',
    },
};

const jaContent: AboutExperienceContent = {
    hero: {
        eyebrow: 'About Me / Personal Signal',
        name: 'こんにちは、NAS です。',
        headline: 'コンテンツ、プロダクト、体験をつなぎ、育ち続ける個人ブランドの仕組みを作っています。',
        description: 'このページは一般的な会社紹介ではなく、もっとパーソナルなプロフィールページです。私はプロダクト検証、AI ワークフロー、自動化されたコンテンツ基盤、そして表現力のある個人ブランドサイトづくりに関心があります。',
        primaryCta: '相談してみる',
        secondaryCta: '連絡先を見る',
        status: 'Open to collaborate',
        location: 'China / Remote-friendly',
        motto: 'サイトは見た目だけでなく、構造・導線・体験まで含めてブランドになるべきだと思っています。',
    },
    labels: ['Product Builder', 'AI Workflow Designer', 'Content Systems', 'Growth-minded Operator', 'Personal Branding', 'Frontend Experience'],
    facts: [
        { label: 'Current focus', value: '個人ブランド型サイト' },
        { label: 'Strength', value: '0→1 の高速推進' },
        { label: 'Interests', value: 'Content × Automation × Conversion' },
        { label: 'Rhythm', value: 'まず検証、次に拡張' },
    ],
    about: {
        title: 'About Me',
        intro: 'このブログを「よくあるテンプレートサイト」にしたくなくて、もっと空気感と構造を持った個人の場に育てています。',
        paragraphs: [
            '私は曖昧なアイデアを少しずつ磨き、公開できる形に変えていくのが好きです。それはノートであり、LPであり、デジタルプロダクトであり、長く使える運用システムでもあります。',
            '単に機能を増やすより、ページに記憶点があるか、情報にリズムがあるか、動きが表現に役立っているかを重視しています。',
            'このブログもただの置き場所ではなく、進化し続ける個人プロダクトの実験室として育てています。',
        ],
        principles: [
            { title: '記憶に残る表現', description: '見た瞬間に雰囲気が伝わり、他と違うと感じてもらえることを大切にしています。' },
            { title: '断片よりシステム', description: 'ページ単体より、コンテンツ・導線・運用・ブランドがつながることを重視します。' },
            { title: '動きは理解を助けるために', description: 'アニメーションは派手さよりも、層・流れ・反応をつくるために使いたいです。' },
        ],
    },
    skills: {
        title: 'アイデアを形にするためのスキル',
        intro: '私は単発のアウトプットより、プロダクト思考、ページ表現、実装、コンテンツ設計を一緒に進めるスタイルです。',
        marquee: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Supabase', 'Markdown Systems', 'Product Messaging', 'SEO-aware Content', 'Automation Workflows', 'Landing Pages', 'Admin Tools'],
        groups: [
            { title: 'プロダクト表現', items: ['価値提案整理', 'ページストーリー', '導線設計', '個人ブランド定位'], accent: 'linear-gradient(90deg, rgba(34,211,238,0.95), rgba(96,165,250,0.25))' },
            { title: '体験設計', items: ['視覚階層', 'スクロールの流れ', 'インタラクション', '情報密度調整'], accent: 'linear-gradient(90deg, rgba(244,114,182,0.95), rgba(168,85,247,0.30))' },
            { title: 'システム構築', items: ['Next.js', 'コンテンツ基盤', '管理画面', 'Supabase'], accent: 'linear-gradient(90deg, rgba(250,204,21,0.95), rgba(34,211,238,0.25))' },
            { title: '効率化', items: ['AI ワークフロー', '自動化 SOP', 'テンプレ資産', '反復作業削減'], accent: 'linear-gradient(90deg, rgba(52,211,153,0.95), rgba(59,130,246,0.28))' },
            { title: '成長視点', items: ['入口設計', '信頼シグナル', 'ユーザー導線', '軽量検証'], accent: 'linear-gradient(90deg, rgba(129,140,248,0.95), rgba(236,72,153,0.32))' },
            { title: '長期複利', items: ['ブログ基盤', '資産化', 'デジタル商品', '一貫したブランド感'], accent: 'linear-gradient(90deg, rgba(251,146,60,0.95), rgba(244,114,182,0.28))' },
        ],
    },
    journey: {
        title: 'Journey',
        intro: '典型的なキャリアというより、コンテンツ・プロダクト・体験が少しずつ重なってできた流れです。',
        timeline: [
            { year: 'Phase 01', title: '表現とコンテンツから出発', description: '文章、構造化、情報整理から入り、価値の伝え方に対する感覚を磨いてきました。' },
            { year: 'Phase 02', title: 'プロダクトとワークフローへ', description: '書くことだけでなく、仕組み化、自動化、プロダクト化まで含めて考えるようになりました。' },
            { year: 'Phase 03', title: '個人ブランド型サイトを構築', description: 'ブログ、プロダクト、ノート、資料、相談導線を一つのブランド体験として接続しています。' },
        ],
        snapshotTitle: 'What I am building now',
        snapshotBody: '今はこの個人ブログを、表現力があり、構造があり、ちゃんと機会を受け止められるブランド型サイトに育てることに集中しています。',
        snapshotList: ['About / Product / Admin 体験の磨き込み', '長期運用に向くコンテンツ基盤づくり', '個人ブランドの中心としてのブログ強化'],
    },
    personality: {
        title: 'Work style and personal preference',
        intro: 'きれいなだけのアイデアより、審美性・システム感・実行性が同居しているものに惹かれます。',
        traits: [
            { title: '強いファーストビューが好き', description: '最初の数秒で空気感が伝わることをかなり重視しています。' },
            { title: '繊細で抑制された動きが好き', description: '派手でも、騒がしくなく、意味のある動きであることが大事です。' },
            { title: 'システム感にこだわる', description: 'コンテンツ、プロダクト、管理画面、導線がどうつながるかを常に考えます。' },
            { title: '長期で効くものを作りたい', description: '一時的な話題性より、積み上がっていくブランドと資産を大切にしています。' },
        ],
    },
    site: {
        title: 'What this site is becoming',
        intro: 'このサイトは単なるブログでも商品一覧でもなく、表現、プロダクト、資料、相談、実験をまとめて担う個人ブランド基盤になっていくはずです。',
        blocks: [
            { title: 'Portfolio', description: '自分の審美感、ページ表現、プロダクト思考を見せる場です。' },
            { title: 'Lab', description: 'ページ構成、動き、情報設計の試行をここで繰り返しています。' },
            { title: 'Gateway', description: '相談、協業、今後のデジタル商品への入口として機能させたいです。' },
            { title: 'Living system', description: 'このサイトは完成形ではなく、私と一緒に変化し続けるものです。' },
        ],
    },
    cta: {
        title: '個人ブログをもっと印象的で、もっと機能する場所にしたいなら話しましょう。',
        description: 'ブランドサイト、商品ページ、管理画面、コンテンツシステムまで、実装と運用の両方を見ながら一緒に前へ進めます。',
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
                ? '更像个人档案页的 About 页面，用自己的内容展示产品思考、审美方向与个人品牌系统。'
                : 'プロダクト思考、審美感、個人ブランドの方向性をまとめたプロフィールページです。',
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <AboutExperience locale={locale} content={locale === 'zh' ? zhContent : jaContent} />;
}
