'use client';

import AboutHero from './AboutHero';
import AboutLifeModules from './AboutLifeModules';
import AboutSkillRail from './AboutSkillRail';
import type { AboutPageContent } from './types';

interface AboutExperienceProps {
    locale: string;
    content: AboutPageContent;
}

export default function AboutExperience({ locale, content }: AboutExperienceProps) {
    return (
        <div className="about-page-root">
            <div className="about-bento-container">
                <AboutHero content={content.hero} />
                <AboutSkillRail content={content.skills} />
                <AboutLifeModules locale={locale} content={content} />
            </div>
        </div>
    );
}
