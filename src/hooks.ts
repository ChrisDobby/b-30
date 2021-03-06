import { getCookies, retrieveToken } from "$lib/authentication";
import type { Auth, AuthenticatedAthlete, Session, User } from "$lib/types";
import { MeasurementPreference } from "$lib/types";
import withStore from "$lib/withStore";
import type { Request, Handle } from "@sveltejs/kit";
import cookie from "cookie";
import resilientFetch from "$lib/resilientFetch";

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

const f = resilientFetch(fetch);
export const getSession = withStore(async (request: Request, { store }): Promise<Session> => {
    if (!request.locals.user) {
        return {};
    }

    let measurementPreference = MeasurementPreference.Metric;
    try {
        const [times, athleteResponse] = await Promise.all([
            store.getTimes(request.locals.user.id),
            f("https://www.strava.com/api/v3/athlete", {
                headers: { Authorization: `Bearer ${request.locals.token}` },
            }),
        ]);

        if (athleteResponse.ok) {
            const athlete = await athleteResponse.json();
            measurementPreference = athlete.measurement_preference;
        }

        return {
            user: request.locals.user,
            token: request.locals.token,
            times,
            measurementPreference,
        };
    } catch (e) {
        return { user: request.locals.user, token: request.locals.token, measurementPreference, timesError: true };
    }
});
