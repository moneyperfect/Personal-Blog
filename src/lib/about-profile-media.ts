import {
    hasSupabaseAdminConfig,
    hasSupabasePublicConfig,
    supabaseAdmin,
    supabasePublic,
} from '@/lib/supabase';

export interface AboutProfileMedia {
    avatarUrl: string | null;
    portraitUrl: string | null;
    updatedAt: string | null;
}

interface AboutProfileMediaRow {
    avatar_url: string | null;
    portrait_url: string | null;
    updated_at: string | null;
}

export const ABOUT_PROFILE_MEDIA_DEFAULTS = {
    avatarUrl: '/about/avatar-demo.svg',
    portraitUrl: '/about/portrait-demo.svg',
} as const;

const EMPTY_ABOUT_PROFILE_MEDIA: AboutProfileMedia = {
    avatarUrl: null,
    portraitUrl: null,
    updatedAt: null,
};

function isMissingAboutProfileMediaTable(error: unknown) {
    return typeof error === 'object'
        && error !== null
        && 'code' in error
        && error.code === 'PGRST205';
}

function mapAboutProfileMedia(row: AboutProfileMediaRow | null | undefined): AboutProfileMedia {
    if (!row) {
        return EMPTY_ABOUT_PROFILE_MEDIA;
    }

    return {
        avatarUrl: row.avatar_url,
        portraitUrl: row.portrait_url,
        updatedAt: row.updated_at,
    };
}

export async function getAboutProfileMedia(): Promise<AboutProfileMedia> {
    const client = hasSupabasePublicConfig ? supabasePublic : hasSupabaseAdminConfig ? supabaseAdmin : null;

    if (!client) {
        return EMPTY_ABOUT_PROFILE_MEDIA;
    }

    try {
        const { data, error } = await client
            .from('about_profile_media')
            .select('avatar_url, portrait_url, updated_at')
            .eq('id', 1)
            .maybeSingle();

        if (error) {
            if (isMissingAboutProfileMediaTable(error)) {
                return EMPTY_ABOUT_PROFILE_MEDIA;
            }

            console.error('Failed to load about profile media:', error);
            return EMPTY_ABOUT_PROFILE_MEDIA;
        }

        return mapAboutProfileMedia(data as AboutProfileMediaRow | null);
    } catch (error) {
        console.error('Unexpected about profile media read failure:', error);
        return EMPTY_ABOUT_PROFILE_MEDIA;
    }
}

export function resolveAboutProfileMedia(media: AboutProfileMedia) {
    return {
        avatarUrl: media.avatarUrl || ABOUT_PROFILE_MEDIA_DEFAULTS.avatarUrl,
        portraitUrl: media.portraitUrl || ABOUT_PROFILE_MEDIA_DEFAULTS.portraitUrl,
    };
}
