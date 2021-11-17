import type { EndpointOutput } from "@sveltejs/kit";
import { retrieveToken } from "$lib/authentication";
import cookie from "cookie";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

export async function get({ query }: ServerRequest): Promise<EndpointOutput> {
    try {
        const code = query.get("code");
        const scope = query.get("scope");

        if (!code || !scope) {
            return {
                headers: { Location: "/" },
                status: 302,
            };
        }

        const token = await retrieveToken({ code, scope });

        return {
            headers: {
                "Set-Cookie": [
                    cookie.serialize("strava_token", JSON.stringify(token), {
                        path: "/",
                        httpOnly: true,
                        expires: new Date(token.expires_at * 1000),
                    }),
                    cookie.serialize("strava_refresh_token", token.refresh_token, { path: "/", httpOnly: true }),
                ],
                Location: "/activities",
            },
            status: 302,
        };
    } catch (error) {
        console.error(error);
        return {
            headers: { Location: "/" },
            status: 302,
        };
    }
}
