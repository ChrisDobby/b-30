import { getCookies, retrieveToken } from "$lib/authentication";
import type { Auth, AuthenticatedAthlete, Session, User } from "$lib/types";
import type { Request, Handle } from "@sveltejs/kit";
import cookie from "cookie";

function createUserFromToken({ id, firstname, lastname, profile }: AuthenticatedAthlete): User {
    return {
        id: id,
        firstName: firstname,
        lastName: lastname,
        profile: profile,
    };
}

export const handle: Handle = async ({ request, resolve }) => {
    const { strava_token, strava_refresh, strava_athlete } = cookie.parse(request.headers.cookie || "");

    let refreshed: Auth | null = null;
    if (strava_athlete && strava_token) {
        request.locals.user = createUserFromToken(JSON.parse(strava_athlete));
    } else if (strava_athlete && strava_refresh) {
        const { token, scope } = JSON.parse(strava_refresh);
        refreshed = await retrieveToken({ refreshToken: token, scope });
        request.locals.user = createUserFromToken(JSON.parse(strava_athlete));
    }

    const response = await resolve(request);
    if (refreshed) {
        response.headers["Set-Cookie"] = getCookies(refreshed);
    }

    return response;
};

export function getSession(request: Request): Session {
    return request.locals.user ? { user: request.locals.user } : {};
}
