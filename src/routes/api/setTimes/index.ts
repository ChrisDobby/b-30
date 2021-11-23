import { secureApi } from "$lib/authentication";
import withStore from "$lib/withStore";
import type { Store } from "$lib/types";
import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

type StoreArgs = { store: Store };
export const post = withStore(
    secureApi(async ({ body, locals }: ServerRequest, { store: { setTimes } }: StoreArgs): Promise<EndpointOutput> => {
        const { times } = body as any;
        try {
            await setTimes(locals.user.id, times);
            return { status: 200, body: {} };
        } catch (e) {
            return { status: 500 };
        }
    }),
);
