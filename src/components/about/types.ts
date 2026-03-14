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
    floatingSkills: string[];
    profileSummary: string[];
    journeyTitle: string;
    journeyBody: string;
    journeyItems: string[];
}

export interface AboutSkillCategory {
    title: string;
    summary: string;
    items: string[];
    accent: string;
}

export interface AboutSkillContent {
    title: string;
    intro: string;
    marquee: string[];
    categories: AboutSkillCategory[];
}

export interface AboutTraitCard {
    title: string;
    description: string;
}

export interface AboutPosterCard {
    title: string;
    caption: string;
    gradient: string;
}

export interface AboutPersonalityContent {
    title: string;
    intro: string;
    mbti: string;
    mbtiSummary: string;
    spotlightTitle: string;
    spotlightBody: string;
    highlights: string[];
    musicTitle: string;
    musicBody: string;
    focusTitle: string;
    focusBody: string;
    galleryTitle: string;
    galleryIntro: string;
    posters: AboutPosterCard[];
    traits: AboutTraitCard[];
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
    info: AboutInfoContent;
    narrative: AboutNarrativeContent;
    support: AboutSupportContent;
}
