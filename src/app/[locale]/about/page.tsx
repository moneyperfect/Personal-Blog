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
        tiles: [
            { label: 'AI', icon: 'AI', tone: 'sand' },
            { label: 'Cursor', icon: 'CU', tone: 'indigo' },
            { label: 'ComfyUI', icon: 'CF', tone: 'white' },
            { label: 'Next.js', icon: 'N', tone: 'dark' },
            { label: 'React', icon: 'R', tone: 'blue' },
            { label: 'Vue', icon: 'V', tone: 'green' },
            { label: 'TypeScript', icon: 'TS', tone: 'white' },
            { label: 'Supabase', icon: 'SB', tone: 'green' },
            { label: 'SQL', icon: 'DB', tone: 'blue' },
            { label: 'VS Code', icon: 'VS', tone: 'white' },
            { label: 'Flow', icon: 'AT', tone: 'pink' },
        ],
        careerLabel: '生涯',
        careerTitle: '无限进步',
        careerItems: ['EDU, 计算机安全专业', 'EDU, APP 开发工程专业', 'EDU, 网络市场营销专业'],
        careerLegend: 'EDU',
        careerStart: '2017',
        careerEnd: '现在',
    },
    personality: {
        label: '性格',
        title: '提倡者',
        code: 'INTP-T',
        notePrefix: '在 ',
        noteLinkLabel: '16personalities',
        noteLinkHref: 'https://www.16personalities.com/',
        noteSuffix: ' 了解更多关于 逻辑学家',
        illustrationSrc: '/about/mbti-demo.svg',
        illustrationAlt: 'MBTI illustration demo',
        photoLabel: '照片',
        photoSrc: '/about/portrait-demo.svg',
        photoAlt: 'Personal photo demo',
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
        pageTitle: 'About NAS',
        floatingPills: [
            'Vibe Coder',
            'System Builder',
            'Metacognition',
            'AI Leverage',
            'Business Logic',
            'Minimal & Efficient',
        ],
        aboutKicker: 'Find leverage, build systems.',
        aboutTitle: 'NAS | Dan Feng',
        aboutSubtitle: 'Turning vague business needs into technical systems with a higher delivery standard.',
        idealLabel: 'Operating Principle',
        idealLines: ['Cognition', 'defines the edge,', 'AI amplifies output.'],
    },
    skills: {
        label: 'Tech & Leverage',
        title: 'Tech & Leverage',
        categories: ['AI workflows', 'Frontend systems', 'Automation', 'Business delivery'],
        tiles: [
            { label: 'AI', icon: 'AI', tone: 'sand' },
            { label: 'Cursor', icon: 'CU', tone: 'indigo' },
            { label: 'ComfyUI', icon: 'CF', tone: 'white' },
            { label: 'Next.js', icon: 'N', tone: 'dark' },
            { label: 'React', icon: 'R', tone: 'blue' },
            { label: 'Vue', icon: 'V', tone: 'green' },
            { label: 'TypeScript', icon: 'TS', tone: 'white' },
            { label: 'Supabase', icon: 'SB', tone: 'green' },
            { label: 'SQL', icon: 'DB', tone: 'blue' },
            { label: 'VS Code', icon: 'VS', tone: 'white' },
            { label: 'Flow', icon: 'AT', tone: 'pink' },
        ],
        careerLabel: 'Career',
        careerTitle: 'Keep Improving',
        careerItems: ['EDU, Computer Security', 'EDU, App Development', 'EDU, Network Marketing'],
        careerLegend: 'EDU',
        careerStart: '2017',
        careerEnd: 'Now',
    },
    personality: {
        label: 'Personality',
        title: 'Mediator',
        code: 'INTP-T',
        notePrefix: 'See more on ',
        noteLinkLabel: '16personalities',
        noteLinkHref: 'https://www.16personalities.com/',
        noteSuffix: ' about the Logician type',
        illustrationSrc: '/about/mbti-demo.svg',
        illustrationAlt: 'MBTI illustration demo',
        photoLabel: 'Photo',
        photoSrc: '/about/portrait-demo.svg',
        photoAlt: 'Personal photo demo',
    },
    worksTitle: 'My Works',
    works: [
        {
            title: 'Personal Brand Site',
            summary: 'A unified space for profile, writing, products, and long-term identity.',
            imageSrc: '/about/work-launch.svg',
            imageAlt: 'Work placeholder 1',
            meta: 'Brand / Web',
        },
        {
            title: 'Growth Console',
            summary: 'A system around content publishing, editing, and long-term presentation.',
            imageSrc: '/about/work-systems.svg',
            imageAlt: 'Work placeholder 2',
            meta: 'System / Content',
        },
        {
            title: 'Visual Studio',
            summary: 'A place to keep refining layout rhythm, interaction, and presentation.',
            imageSrc: '/about/work-studio.svg',
            imageAlt: 'Work placeholder 3',
            meta: 'Motion / Layout',
        },
    ],
    gamesTitle: 'Game Hobby',
    games: [
        {
            label: 'Game Hobby',
            imageSrc: '/about/game-odyssey.svg',
            imageAlt: 'Game placeholder 1',
        },
        {
            label: 'Game Hobby',
            imageSrc: '/about/game-myth.svg',
            imageAlt: 'Game placeholder 2',
        },
    ],
    preferencesTitle: 'Interests & Preferences',
    preferences: [
        {
            label: 'Favorite Anime',
            title: 'Steins;Gate / Summertime Render',
            subtitle: 'Drawn to tightly structured stories with logic, recursion, and closed time loops.',
            imageSrc: '/about/anime-circuit.svg',
            imageAlt: 'Anime placeholder',
        },
        {
            label: 'Music Taste',
            title: 'AKASAKI / AI Music',
            subtitle: 'Leaning toward emotionally tense sounds with a generated, experimental texture.',
            imageSrc: '/about/media-music.svg',
            imageAlt: 'Music placeholder',
        },
        {
            label: 'Focus Topics',
            title: 'Metacognition & Rationality',
            subtitle: 'A long-term interest in using higher-order cognition to manage decisions, state, and execution.',
            imageSrc: '/about/media-focus.svg',
            imageAlt: 'Focus placeholder',
        },
        {
            label: 'Fourth Slot',
            title: 'Coming Soon',
            subtitle: 'Reserved for future images, links, or another long-term preference.',
            imageSrc: '/about/preference-future.svg',
            imageAlt: 'Placeholder image',
        },
    ],
    info: {
        statsTitle: 'Site Stats',
        stats: [
            { label: 'Articles', value: '24+' },
            { label: 'Version', value: 'V5' },
            { label: 'Direction', value: 'Brand' },
            { label: 'Goal', value: 'Compound' },
        ],
        aboutTitle: 'About Me',
        aboutBody:
            '"I am not only an explorer in information systems. I am more inclined to define myself as a system builder. Here, I do not insist on building every wheel from scratch. I use AI as leverage to cross the walls of traditional code and solve real problems directly.\n\nWhether it is leading campus business projects, decoding between Uyghur, Chinese, and Japanese (N2), or pushing a kilogram-precise muscle-building plan in the gym, I keep believing that any complex problem in life and work can be decomposed, measured, and optimized."',
        educationTitle: 'Education',
        educationItems: ['Computer Security', 'App Development', 'Network Marketing'],
        currentTitle: 'Current State',
        currentItems: ['Refining the personal blog', 'Organizing work and expression systems', 'Exploring a stronger brand site structure'],
    },
    narrative: {
        routeTitle: 'Series Route',
        routeIntro: 'Upgrade expression into systems, then push those systems toward reusable and automated business loops.',
        routeItems: ['Build a digital twin', 'Explore AI leverage', 'Construct an automated business loop'],
    },
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;

    return {
        title: locale === 'zh' ? '关于我' : 'About',
        description:
            locale === 'zh'
                ? '围绕头像、创造力引擎、性格、照片与兴趣偏好构建的 About 页面。'
                : 'An about page centered on avatar, creative engine, personality, photo, and personal preferences.',
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <AboutExperience locale={locale} content={locale === 'zh' ? zhContent : jaContent} />;
}
