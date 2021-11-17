import type { LoadInput, Load } from "@sveltejs/kit";
import type { Auth } from "$lib/types";

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID || "";
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || "";
const STRAVA_AUTHORISE_URL = process.env.STRAVA_AUTHORISE_URL || "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = process.env.STRAVA_TOKEN_URL || "https://www.strava.com/oauth/token";

type RetrieveTokenArgs = {
    scope: string;
    code?: string;
    refreshToken?: string;
};

export async function retrieveToken({ code, refreshToken, scope }: RetrieveTokenArgs): Promise<Auth> {
    const tokenData =
        typeof refreshToken !== "undefined"
            ? `grant_type=refresh_token&refresh_token=${refreshToken}`
            : `grant_type=authorization_code&code=${code}`;

    const authResponse = await fetch(STRAVA_TOKEN_URL, {
        method: "POST",
        body: `${tokenData}&client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { athlete, ...stravaJson } = await authResponse.json();
    return {
        ...stravaJson,
        scope,
        id: athlete.id,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        profile: athlete.profile,
    };
}

function getHostUrl(page) {
    return `http://${page.host}`;
}

function getRedirectUri(page) {
    return `${getHostUrl(page)}/api/authenticated`;
}

export const secure =
    (loader: Load): Load =>
    async (args: LoadInput) => {
        const {
            session: { user },
            page,
        } = args;

        if (!user) {
            const authUrl = `${STRAVA_AUTHORISE_URL}?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${getRedirectUri(
                page,
            )}&response_type=code&approval_prompt=auto&scope=activity:read_all`;

            return {
                status: 302,
                redirect: authUrl,
            };
        }

        return loader(args);
    };
