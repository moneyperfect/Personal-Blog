export interface AboutHeroContent {
    eyebrow: string;
    name: string;
    tagline: string;
    introTitle: string;
    introBody: string;
    introBullets: string[];
    status: string;
    primaryCta: string;
    secondaryCta: string;
    floatingPills: string[];
    journeyTitle: string;
    journeyBody: string;
    journeyItems: string[];
}

export interface AboutSkillItem {
    label: string;
    icon: string;
}

export interface AboutSkillDisplayGroup {
    title: string;
    summary: string;
    icon: string;
    items: string[];
}

export interface AboutSkillContent {
    title: string;
    intro: string;
    marquee: AboutSkillItem[];
    displayGroups: AboutSkillDisplayGroup[];
}

export interface AboutTalentItem {
    title: string;
    description: string;
}

export interface AboutMediaCard {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    href?: string;
    tag?: string;
    caption?: string;
}

export interface AboutWorkCard {
    title: string;
    summary: string;
    imageSrc: string;
    imageAlt: string;
    href?: string;
    meta: string;
}

export interface AboutGameCard {
    title: string;
    summary: string;
    imageSrc: string;
    imageAlt: string;
    href?: string;
    tag: string;
}

export interface AboutPersonalityContent {
    title: string;
    intro: string;
    mbti: string;
    mbtiLabel: string;
    mbtiSummary: string;
    photoTitle: string;
    photoBody: string;
    talentsTitle: string;
    talentsIntro: string;
    talents: AboutTalentItem[];
}

export interface AboutInfoContent {
    title: string;
    statsTitle: string;
    stats: Array<{ label: string; value: string }>;
    mapTitle: string;
    mapBody: string;
    identityTitle: string;
    identityBody: string;
    educationTitle: string;
    educationItems: string[];
    currentTitle: string;
    currentItems: string[];
}

export interface AboutNarrativeContent {
    routeTitle: string;
    routeIntro: string;
    routeItems: Array<{ stage: string; title: string; description: string }>;
    pactTitle: string;
    pactIntro: string;
    pactItems: string[];
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
    worksIntro: string;
    works: AboutWorkCard[];
    gamesTitle: string;
    gamesIntro: string;
    games: AboutGameCard[];
    animeTitle: string;
    animeIntro: string;
    anime: AboutMediaCard[];
    musicCard: AboutMediaCard;
    focusCard: AboutMediaCard;
    info: AboutInfoContent;
    narrative: AboutNarrativeContent;
    support: AboutSupportContent;
}
