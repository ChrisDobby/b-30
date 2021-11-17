import type { Session } from "$lib/types";
import type { Request } from "@sveltejs/kit";
import cookie from "cookie";

export function getSession(request: Request): Session {
    const { strava_token } = cookie.parse(request.headers.cookie || "");
    if (!strava_token) {
        return {};
    }

    const strava = JSON.parse(strava_token);
    return {
        user: {
            id: strava.id,
            firstName: strava.firstname,
            lastName: strava.lastname,
            profile: strava.profile,
        },
    };
}
