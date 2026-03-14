'use client';

import AboutHero from './AboutHero';
import AboutLifeModules from './AboutLifeModules';
import AboutSkillRail from './AboutSkillRail';
import AboutSupportWall from './AboutSupportWall';
import type { AboutPageContent } from './types';

interface AboutExperienceProps {
    locale: string;
    content: AboutPageContent;
}

export default function AboutExperience({ locale, content }: AboutExperienceProps) {
    return (
        <div className="about-page-root">
            <div className="about-bento-container">
                <AboutHero locale={locale} content={content.hero} />
                <AboutSkillRail locale={locale} content={content.skills} />
                <AboutLifeModules locale={locale} content={content} />
                <AboutSupportWall locale={locale} content={content.support} />
            </div>
        </div>
    );
}
