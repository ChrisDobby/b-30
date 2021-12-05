import { secureApi } from "$lib/authentication";
import withStore from "$lib/withStore";
import type { Store } from "$lib/types";
import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import { getTimesToStore } from "$lib/utils";

type StoreArgs = { store: Store };
export const post = withStore(
    secureApi(
        async (
            { body, locals }: ServerRequest,
            { store: { setTimes, getTimes } }: StoreArgs,
        ): Promise<EndpointOutput> => {
            const { paces } = body as any;
            try {
                const times = await getTimes(locals.user.id);
                const timesToStore = getTimesToStore(times, paces);
                await setTimes(locals.user.id, timesToStore);
                return { status: 200, body: { times: timesToStore } };
            } catch (e) {
                return { status: 500 };
            }
        },
    ),
);
