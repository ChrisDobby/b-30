import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    profile: string;
};

export type TimeRange = { low: number; high: number };
export type Paces = {
    date5k: number;
    recovery: TimeRange;
    tempo: TimeRange;
    five: TimeRange;
    overPace: TimeRange;
    strides: TimeRange;
};

export type Times = Paces & {
    dateTime: string;
    fromActivityId?: string;
};

export enum MeasurementPreference {
    Metric = "meters",
    Imperial = "feet",
}

export type Session = {
    user?: User;
    token?: string;
    times?: Times[];
    measurementPreference?: MeasurementPreference;
    timesError?: boolean;
    pacesDate?: Date;
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

export type Store = {
    setTimes: (id: string, times: Times[]) => Promise<void>;
    getTimes: (id: string) => Promise<Times[] | null>;
};

export type Api = (request: ServerRequest, args?: any) => Promise<EndpointOutput>;

export enum ApiResult {
    Success = "success",
    Error = "error",
}

export type ApiError = { result: ApiResult.Error; error?: string };

export type ActivityLap = {
    id: number;
    name: string;
    movingTime: number;
    distance: number;
    averageSpeed: number;
    startIndex: number;
    endIndex: number;
};

export type PaceAnalysis = {
    recovery: number;
    tempoRecovery: number;
    tempo: number;
    fiveTempo: number;
    five: number;
    overPaceFive: number;
    overPace: number;
    stridesOverPace: number;
    strides: number;
};

export type PaceAnalysisWithOther = PaceAnalysis & { other: number };

export type Analysis = { percentageOfTimeAtPace: PaceAnalysisWithOther; averageHeartRateAtPace: PaceAnalysis };
export type LapAnalysis = ActivityLap & Analysis & { pace: string };

export type AnalysisResult = Analysis & {
    laps: LapAnalysis[];
};

export type DisplayActivity = {
    name: string;
    dateTime: string;
    distance: number;
    movingTime: number;
    averageSpeed: number;
    analysis: AnalysisResult;
};
