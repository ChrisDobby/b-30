import { getCookies, retrieveToken } from "$lib/authentication";
import type { Auth, AuthenticatedAthlete, Session, User } from "$lib/types";
import withStore from "$lib/withStore";
import type { Request, Handle } from "@sveltejs/kit";
import cookie from "cookie";

function createUserFromAuth({ id, firstname, lastname, profile }: AuthenticatedAthlete): User {
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
        request.locals.user = createUserFromAuth(JSON.parse(strava_athlete));
        request.locals.token = strava_token;
    } else if (strava_athlete && strava_refresh) {
        const { token, scope } = JSON.parse(strava_refresh);
        refreshed = await retrieveToken({ refreshToken: token, scope });
        request.locals.user = createUserFromAuth(JSON.parse(strava_athlete));
        request.locals.token = refreshed.access_token;
    }

    const response = await resolve(request);
    if (refreshed) {
        response.headers["Set-Cookie"] = getCookies(refreshed);
    }

    return response;
};

export const getSession = withStore(async (request: Request, { store }): Promise<Session> => {
    if (!request.locals.user) {
        return {};
    }

    const times = await store.getTimes(request.locals.user.id);
    return {
        user: request.locals.user,
        token: request.locals.token,
        times,
    };
});
