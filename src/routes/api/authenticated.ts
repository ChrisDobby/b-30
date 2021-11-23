import type { EndpointOutput } from "@sveltejs/kit";
import { getCookies, retrieveToken } from "$lib/authentication";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

export async function get({ query }: ServerRequest): Promise<EndpointOutput> {
    try {
        const code = query.get("code");
        const scope = query.get("scope");
        const redirect = query.get("redirect_to");

        if (!code || !scope) {
            return {
                headers: { Location: "/" },
                status: 302,
            };
        }

        const token = await retrieveToken({ code, scope });

        return {
            headers: {
                "Set-Cookie": getCookies(token),
                Location: `${redirect || "/activities"}?`,
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
