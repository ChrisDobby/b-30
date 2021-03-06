import type { LoadInput, Load, Page } from "@sveltejs/kit";
import type { Auth, Api } from "$lib/types";
import cookie from "cookie";
import resilientFetch from "$lib/resilientFetch";

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID || "";
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || "";
const STRAVA_AUTHORISE_URL = process.env.STRAVA_AUTHORISE_URL || "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = process.env.STRAVA_TOKEN_URL || "https://www.strava.com/oauth/token";

type RetrieveTokenArgs = {
    scope: string;
    code?: string;
    refreshToken?: string;
};

const f = resilientFetch(fetch);
export async function retrieveToken({ code, refreshToken, scope }: RetrieveTokenArgs): Promise<Auth> {
    const tokenData =
        typeof refreshToken !== "undefined"
            ? `grant_type=refresh_token&refresh_token=${refreshToken}`
            : `grant_type=authorization_code&code=${code}`;

    const authResponse = await f(STRAVA_TOKEN_URL, {
        method: "POST",
        body: `${tokenData}&client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { athlete, ...stravaJson } = await authResponse.json();

    return {
        ...stravaJson,
        scope,
        athlete,
    };
}

function getHostUrl(page: Page) {
    return `${page.host.startsWith("localhost") ? "http" : "https"}://${page.host}`;
}

function getRedirectUri(page: Page) {
    return `${getHostUrl(page)}/api/authenticated?redirect_to=${page.path}`;
}

export const secureApi =
    (api: Api): Api =>
    async (request, args) => {
        const { locals } = request;

        if (!locals.user) {
            return { status: 401 };
        }

        return api(request, args);
    };

export const securePage =
    (loader: Load): Load =>
    async (args: LoadInput) => {
        const {
            session: { user },
            page,
        } = args;

        if (user) {
            return loader(args);
        }

        const authUrl = `${STRAVA_AUTHORISE_URL}?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${getRedirectUri(
            page,
        )}&response_type=code&approval_prompt=auto&scope=activity:read_all,profile:read_all`;

        return {
            status: 302,
            redirect: authUrl,
        };
    };

export function getCookies(auth: Auth): string[] {
    const cookies = [
        cookie.serialize("strava_token", auth.access_token, {
            path: "/",
            httpOnly: true,
            expires: new Date(auth.expires_at * 1000),
        }),
        cookie.serialize("strava_refresh", JSON.stringify({ token: auth.refresh_token, scope: auth.scope }), {
            path: "/",
            httpOnly: true,
        }),
    ];

    if (auth.athlete) {
        cookies.push(cookie.serialize("strava_athlete", JSON.stringify(auth.athlete), { path: "/", httpOnly: true }));
    }

    return cookies;
}
