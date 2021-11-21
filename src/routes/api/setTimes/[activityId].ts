import { secureApi } from "$lib/authentication";
import { calculateTimes } from "$lib/utils";
import withStore from "$lib/withStore";
import type { Store } from "$lib/types";
import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

type StoreArgs = { store: Store };
export const get = withStore(
    secureApi(
        async ({ params, locals }: ServerRequest, { store: { setTimes } }: StoreArgs): Promise<EndpointOutput> => {
            const { activityId } = params;

            try {
                const activityResponse = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
                    headers: { Authorization: `Bearer ${locals.token}` },
                });

                if (!activityResponse.ok) {
                    return { status: activityResponse.status };
                }

                const activity = await activityResponse.json();
                const times = { ...calculateTimes(activity.average_speed), fromActivityId: activityId };
                await setTimes(activity.athlete.id, times);

                return { status: 200, body: times };
            } catch (e) {
                return { status: 500 };
            }
        },
    ),
);
