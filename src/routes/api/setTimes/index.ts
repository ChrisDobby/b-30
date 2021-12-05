import { secureApi } from "$lib/authentication";
import withStore from "$lib/withStore";
import type { Store } from "$lib/types";
import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import { getTimesToStore } from "$lib/utils";

type StoreArgs = { store: Store };
export const post = withStore(
    secureApi(async ({ body, locals }: ServerRequest, { store: { setTimes } }: StoreArgs): Promise<EndpointOutput> => {
        const { paces } = body as any;
        try {
            const timesToStore = getTimesToStore(null, paces);
            await setTimes(locals.user.id, timesToStore);
            return { status: 200, body: { times: timesToStore } };
        } catch (e) {
            return { status: 500 };
        }
    }),
);
