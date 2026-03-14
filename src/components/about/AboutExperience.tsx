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
            <div className="page-container page-width py-10 sm:py-14">
                <AboutHero locale={locale} content={content.hero} />
                <AboutSkillRail locale={locale} content={content.skills} />
                <AboutLifeModules
                    locale={locale}
                    personality={content.personality}
                    info={content.info}
                    narrative={content.narrative}
                />
                <AboutSupportWall locale={locale} content={content.support} />
            </div>
        </div>
    );
}
