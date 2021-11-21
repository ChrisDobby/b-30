import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    profile: string;
};

export type Session = {
    user?: User;
    token?: string;
};

export type AuthenticatedAthlete = {
    id: string;
    firstname: string;
    lastname: string;
    profile: string;
};
export type Auth = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    scope: string;
    athlete?: AuthenticatedAthlete;
};

export type StravaActivity = {
    id: string;
    name: string;
    date: string;
    distance: string;
    time: string;
    pace: string;
};

export type Times = {
    date5k: number;
    recovery: [number, number];
    tempo: [number, number];
    ten: [number, number];
    five: [number, number];
    overPace: [number, number];
    strides: [number, number];
    fromActivityId?: string;
};

export type Store = {
    setTimes: (id: string, times: Times) => Promise<void>;
};

export type Api = (request: ServerRequest, args?: any) => Promise<EndpointOutput>;
