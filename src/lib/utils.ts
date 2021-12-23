import type { ApiError, Paces, StravaActivity, Times } from "./types";
import { ApiResult } from "./types";
import { MeasurementPreference } from "./types";
import { format } from "date-fns";

export const METRES_IN_KM = 1000;
const METRES_IN_MILE = 1609.34;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;

function to2Decimals(num: number) {
    return Math.round(num * 100 + Number.EPSILON) / 100;
}

function fractionToPartOfTime(fraction: number) {
    return to2Decimals(Math.trunc(fraction * SECONDS_IN_MINUTE));
}

function addLeadingZero(num: number) {
    if (num >= 10) {
        return num.toString();
    }

    return `0${num}`;
}

export function timeFromSeconds(seconds: number, withUnits = true): string {
    const minutes = seconds / SECONDS_IN_MINUTE;
    const hours = minutes / MINUTES_IN_HOUR;
    const fractionSeconds = addLeadingZero(fractionToPartOfTime(minutes % 1));
    if (hours >= 1) {
        return `${Math.trunc(hours)}:${addLeadingZero(fractionToPartOfTime(hours % 1))}:${fractionSeconds} ${
            withUnits ? "hrs" : ""
        }`;
    }

    return `${Math.trunc(minutes)}:${fractionSeconds} ${withUnits ? "mins" : ""}`;
}

const MEASUREMENT_METRES = {
    [MeasurementPreference.Metric]: METRES_IN_KM,
    [MeasurementPreference.Imperial]: METRES_IN_MILE,
};

export const MEASUREMENT_UNITS = {
    [MeasurementPreference.Metric]: "km",
    [MeasurementPreference.Imperial]: "mi",
};

export const secondsForUnit =
    (measurementPreference = MeasurementPreference.Metric) =>
    (secondsPerKm: number): number => {
        return (secondsPerKm / METRES_IN_KM) * MEASUREMENT_METRES[measurementPreference];
    };

export const distance =
    (measurementPreference = MeasurementPreference.Metric) =>
    (distanceInMetres: number): string => {
        const metres = MEASUREMENT_METRES[measurementPreference];
        const unit = MEASUREMENT_UNITS[measurementPreference];
        return `${to2Decimals(distanceInMetres / metres)} ${unit}`;
    };

export const calculateSpeedAndPace =
    (measurementPreference = MeasurementPreference.Metric) =>
    (metresPerSecond: number): [string, string] => {
        const metresPerHour = metresPerSecond * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
        const kmPerHour = metresPerHour / MEASUREMENT_METRES[measurementPreference];
        const secondsPerKm = MEASUREMENT_METRES[measurementPreference] / metresPerSecond;
        const unit = MEASUREMENT_UNITS[measurementPreference];
        return [`${to2Decimals(kmPerHour)} ${unit}/hour`, `${timeFromSeconds(secondsPerKm)}/${unit}`];
    };

function getPaces(date5kTime: number, date5kSecondsPerKm: number): Paces {
    return {
        date5k: date5kTime,
        recovery: { low: date5kSecondsPerKm + 56, high: date5kSecondsPerKm + 75 },
        tempo: { low: date5kSecondsPerKm + 12, high: date5kSecondsPerKm + 19 },
        five: { low: date5kSecondsPerKm - 4, high: date5kSecondsPerKm + 3 },
        overPace: { low: date5kSecondsPerKm - 19, high: date5kSecondsPerKm - 12 },
        strides: { low: date5kSecondsPerKm - 37, high: date5kSecondsPerKm - 25 },
    };
}

export function calculatePaces(date5k: number): Paces {
    const date5kSecondsPerKm = METRES_IN_KM / date5k;
    const date5kTime = Math.floor(date5kSecondsPerKm * 5);

    return getPaces(date5kTime, date5kSecondsPerKm);
}

export function calculatePacesFromTime(date5kTime: number): Paces {
    const date5kSecondsPerKm = date5kTime / 5;
    return getPaces(date5kTime, date5kSecondsPerKm);
}

type GetActivitiesSuccess = { result: ApiResult.Success; activities: StravaActivity[] };
type GetActivitiesResult = GetActivitiesSuccess | ApiError;
export async function getActivities(
    fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>,
    token: string,
    measurementPreference: MeasurementPreference,
    page = 1,
): Promise<GetActivitiesResult> {
    const activitiesResponse = await fetch(`https://www.strava.com/api/v3/athlete/activities?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const getDistance = distance(measurementPreference);
    const getSpeedAndPace = calculateSpeedAndPace(measurementPreference);

    if (!activitiesResponse.ok) {
        return { result: ApiResult.Error, error: activitiesResponse.statusText };
    }

    return {
        result: ApiResult.Success,
        activities: (await activitiesResponse.json()).map(activity => ({
            id: activity.id,
            name: activity.name,
            date: format(new Date(activity.start_date), "dd-MMM-yyyy HH:mm"),
            distance: getDistance(activity.distance),
            time: timeFromSeconds(activity.moving_time),
            pace: getSpeedAndPace(activity.average_speed)[1],
        })),
    };
}

export function getTimesToStore(times: Times[] | null, paces: Paces, fromActivityId?: string): Times[] {
    const date = format(new Date(), "dd-MMM-yyyy");
    const pacesWithActivityId = fromActivityId ? { ...paces, fromActivityId } : paces;
    const newTime = { ...pacesWithActivityId, dateTime: new Date().toISOString() };
    return !times || (times.length === 1 && format(new Date(times[0].dateTime), "dd-MMM-yyy") === date)
        ? [newTime]
        : [...times, newTime];
}

export function getPacesForDateTime(dateTime: Date, times: Times[] | null): Paces | null {
    if (!times || !times.length) {
        return null;
    }

    if (times.length === 1) {
        return times[0];
    }

    const sortedTimes = [...times].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    const filteredTimes = sortedTimes.filter(time => new Date(time.dateTime) <= dateTime).reverse();

    return filteredTimes.length ? filteredTimes[0] : sortedTimes[0];
}

export const CHART_DISPLAY = {
    recovery: { colour: "blue", label: "Recovery", isPrimaryPace: true },
    tempoRecovery: { colour: "#42f5f2", label: "Recovery->tempo", isPrimaryPace: false },
    tempo: { colour: "green", label: "Tempo", isPrimaryPace: true },
    fiveTempo: { colour: "#a7f542", label: "Tempo->5k", isPrimaryPace: false },
    five: { colour: "#ffbf00", label: "5K", isPrimaryPace: true },
    overPaceFive: { colour: "#ff9900", label: "5K->over pace", isPrimaryPace: false },
    overPace: { colour: "#fc4903", label: "Over pace", isPrimaryPace: true },
    stridesOverPace: { colour: "red", label: "Over pace->strides", isPrimaryPace: false },
    strides: { colour: "#ff005d", label: "Strides", isPrimaryPace: true },
    other: { colour: "gray", label: "Other", isPrimaryPace: false },
};
