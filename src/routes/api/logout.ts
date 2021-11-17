import type { EndpointOutput } from "@sveltejs/kit";
import cookie from "cookie";

export async function get(): Promise<EndpointOutput> {
    return {
        headers: {
            "Set-Cookie": [
                cookie.serialize("strava_token", null, {
                    path: "/",
                    httpOnly: true,
                    maxAge: 0,
                }),
                cookie.serialize("strava_refresh_token", null, { path: "/", httpOnly: true, maxAge: 0 }),
            ],
            Location: "/",
        },
        status: 302,
    };
}
