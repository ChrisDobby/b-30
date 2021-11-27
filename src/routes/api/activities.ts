import { secureApi } from "$lib/authentication";
import { getActivities } from "$lib/utils";
import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import resilientFetch from "$lib/resilientFetch";

const f = resilientFetch(fetch);

export const get = secureApi(async ({ locals }: ServerRequest): Promise<EndpointOutput> => {
    try {
        const activities = await getActivities(f, locals.token, locals.measurementPreference, 2);
        return { status: 200, body: activities };
    } catch (e) {
        return { status: 500 };
    }
});
