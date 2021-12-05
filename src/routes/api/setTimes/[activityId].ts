import { secureApi } from "$lib/authentication";
import { calculatePaces, getTimesToStore } from "$lib/utils";
import withStore from "$lib/withStore";
import type { Store } from "$lib/types";
import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import resilientFetch from "$lib/resilientFetch";

const f = resilientFetch(fetch);

type StoreArgs = { store: Store };
export const post = withStore(
    secureApi(
        async (
            { params, locals }: ServerRequest,
            { store: { setTimes, getTimes } }: StoreArgs,
        ): Promise<EndpointOutput> => {
            const { activityId } = params;

            try {
                const activityResponse = await f(`https://www.strava.com/api/v3/activities/${activityId}`, {
                    headers: { Authorization: `Bearer ${locals.token}` },
                });

                if (!activityResponse.ok) {
                    return { status: activityResponse.status };
                }

                const activity = await activityResponse.json();
                const times = await getTimes(activity.athlete.id);
                const timesToStore = getTimesToStore(times, calculatePaces(activity.average_speed), activityId);
                await setTimes(activity.athlete.id, timesToStore);

                return { status: 200, body: { times: timesToStore } };
            } catch (e) {
                return { status: 500 };
            }
        },
    ),
);
