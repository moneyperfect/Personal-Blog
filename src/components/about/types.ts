export interface AboutHeroContent {
    pageTitle: string;
    floatingPills: string[];
    avatarSrc: string;
    avatarAlt: string;
    aboutKicker: string;
    aboutTitle: string;
    aboutSubtitle: string;
    idealLabel: string;
    idealHeadline: string;
    idealBody: string;
}

export interface AboutCareerTimelineItem {
    date: string;
    title: string;
    description: string;
    tone: 'blue' | 'yellow' | 'green';
    progress: string;
}

export interface AboutSkillContent {
    label: string;
    title: string;
    summary: string;
    careerLabel: string;
    careerTitle: string;
    careerTimeline: AboutCareerTimelineItem[];
    careerLegend: string;
    careerStart: string;
    careerEnd: string;
}

export interface AboutPersonalityContent {
    label: string;
    title: string;
    code: string;
    notePrefix: string;
    noteLinkLabel: string;
    noteLinkHref: string;
    noteSuffix: string;
    photoLabel: string;
    photoSrc: string;
    photoAlt: string;
}

export interface AboutWorkCard {
    title: string;
    summary: string;
    imageSrc: string;
    imageAlt: string;
    meta: string;
    href?: string;
}

export interface AboutGameCard {
    label: string;
    imageSrc: string;
    imageAlt: string;
}

export interface AboutPreferenceCard {
    label: string;
    title: string;
    subtitle: string;
    imageSrc: string;
    imageAlt: string;
    imagePosition?: string;
    mobileImagePosition?: string;
    href?: string;
}

export interface AboutInfoContent {
    principlesTitle: string;
    principles: Array<{ title: string; description: string }>;
    aboutTitle: string;
    aboutParagraphs: string[];
    educationTitle: string;
    educationBody: string;
    currentTitle: string;
    currentBody: string;
}

export interface AboutNarrativeContent {
    routeTitle: string;
    routeIntro: string;
}

export interface AboutSupportContent {
    title: string;
    intro: string;
    supporters: Array<{ name: string; amount: string; note: string }>;
    ctaTitle: string;
    ctaBody: string;
    primaryCta: string;
    secondaryCta: string;
}

export interface AboutPageContent {
    hero: AboutHeroContent;
    skills: AboutSkillContent;
    personality: AboutPersonalityContent;
    worksTitle: string;
    works: AboutWorkCard[];
    gamesTitle: string;
    games: AboutGameCard[];
    preferencesTitle: string;
    preferences: AboutPreferenceCard[];
    info: AboutInfoContent;
    narrative: AboutNarrativeContent;
    support?: AboutSupportContent;
}
