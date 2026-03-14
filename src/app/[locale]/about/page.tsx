import { setRequestLocale } from 'next-intl/server';
import AboutExperience from '@/components/about/AboutExperience';
import type { AboutPageContent } from '@/components/about/types';

type Props = { params: Promise<{ locale: string }> };

const zhContent: AboutPageContent = {
    hero: {
        pageTitle: '关于 NAS',
        floatingPills: ['艺术创作发烧友', '编程技巧分享者', '捕捉生活的瞬间', '挖掘编程的秘密', '不放弃无限进步', '现实中唯唯诺诺'],
        aboutKicker: '倘若生活太苦，我便往里加点糖',
        aboutTitle: 'NAS | 段枫',
        aboutSubtitle: '致力于降低人与人之间的信息差',
        idealLabel: '理想',
        idealLines: ['源于', '热爱而去 努力', '学习'],
    },
    skills: {
        label: '技能',
        title: '开启创造力',
        categories: ['视频剪辑', '前端设计', '编程', '系统工程'],
        tiles: [
            { label: 'AI', icon: 'AI', tone: 'sand' },
            { label: 'Ae', icon: 'Ae', tone: 'indigo' },
            { label: 'Java', icon: 'J', tone: 'white' },
            { label: 'Vue', icon: 'V', tone: 'green' },
            { label: 'SQL', icon: 'DB', tone: 'blue' },
            { label: 'Bing', icon: 'B', tone: 'white' },
            { label: 'Zap', icon: 'Z', tone: 'white' },
            { label: 'Zoom', icon: 'ZO', tone: 'pink' },
            { label: 'JS', icon: 'JS', tone: 'dark' },
            { label: 'VS Code', icon: 'VS', tone: 'white' },
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
            title: 'Anime',
            subtitle: '后续放你真正喜欢的番剧封面',
            imageSrc: '/about/anime-cosmos.svg',
            imageAlt: '动漫占位图',
        },
        {
            label: '音乐风格',
            title: 'Music',
            subtitle: '这里后续换成你常听的音乐风格图',
            imageSrc: '/about/media-music.svg',
            imageAlt: '音乐占位图',
        },
        {
            label: '关注偏好',
            title: 'Focus',
            subtitle: '这里后续放你长期关注的主题',
            imageSrc: '/about/media-focus.svg',
            imageAlt: '关注偏好占位图',
        },
        {
            label: '第四栏待定',
            title: 'Coming Soon',
            subtitle: '这一栏先留给后续补充内容',
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
            '我想把这个站点做成一个长期生长的个人空间。它不只是内容容器，也不只是作品展示页，而是一个会持续积累表达、审美和机会承接能力的个人品牌阵地。',
        educationTitle: '教育经历',
        educationItems: ['计算机安全专业', 'APP 开发工程专业', '网络市场营销专业'],
        currentTitle: '当前状态',
        currentItems: ['持续优化个人博客', '整理作品与表达体系', '探索更长期的品牌站结构'],
    },
    narrative: {
        routeTitle: '系列路程',
        routeIntro: '后面的部分暂时保留现有模式，只收敛成更统一的浅色主题与模块节奏。',
        routeItems: ['开始记录与表达', '转向系统与产品', '形成个人品牌站'],
    },
};

const jaContent: AboutPageContent = {
    hero: {
        pageTitle: 'About NAS',
        floatingPills: ['Art creator', 'Coding sharer', 'Capture moments', 'Explore secrets', 'Keep evolving', 'Stay grounded'],
        aboutKicker: 'If life feels bitter, I add a little sweetness',
        aboutTitle: 'NAS | Dan Feng',
        aboutSubtitle: 'Trying to reduce information gaps between people',
        idealLabel: 'Ideal',
        idealLines: ['From', 'passion to effort', 'learning'],
    },
    skills: {
        label: 'Skills',
        title: 'Creative Engine',
        categories: ['Video', 'Frontend', 'Coding', 'Systems'],
        tiles: [
            { label: 'AI', icon: 'AI', tone: 'sand' },
            { label: 'Ae', icon: 'Ae', tone: 'indigo' },
            { label: 'Java', icon: 'J', tone: 'white' },
            { label: 'Vue', icon: 'V', tone: 'green' },
            { label: 'SQL', icon: 'DB', tone: 'blue' },
            { label: 'Bing', icon: 'B', tone: 'white' },
            { label: 'Zap', icon: 'Z', tone: 'white' },
            { label: 'Zoom', icon: 'ZO', tone: 'pink' },
            { label: 'JS', icon: 'JS', tone: 'dark' },
            { label: 'VS Code', icon: 'VS', tone: 'white' },
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
            title: 'Anime',
            subtitle: 'Later this can hold your real anime covers',
            imageSrc: '/about/anime-cosmos.svg',
            imageAlt: 'Anime placeholder',
        },
        {
            label: 'Music Taste',
            title: 'Music',
            subtitle: 'Replace with your preferred music styles later',
            imageSrc: '/about/media-music.svg',
            imageAlt: 'Music placeholder',
        },
        {
            label: 'Focus Topics',
            title: 'Focus',
            subtitle: 'A place for your long-term interests and themes',
            imageSrc: '/about/media-focus.svg',
            imageAlt: 'Focus placeholder',
        },
        {
            label: 'Fourth Slot',
            title: 'Coming Soon',
            subtitle: 'Reserved for future content',
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
            'I want this site to grow into a long-term personal space. Not just a content container, and not only a portfolio, but a place where expression, taste, and real opportunities can accumulate over time.',
        educationTitle: 'Education',
        educationItems: ['Computer Security', 'App Development', 'Network Marketing'],
        currentTitle: 'Current State',
        currentItems: ['Refining the personal blog', 'Organizing work and expression systems', 'Exploring a stronger brand site structure'],
    },
    narrative: {
        routeTitle: 'Series Route',
        routeIntro: 'The later section can keep the current idea, but with a more unified light-theme module rhythm.',
        routeItems: ['Start from writing', 'Move toward systems', 'Shape a personal brand site'],
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
