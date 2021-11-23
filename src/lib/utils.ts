import type { Times } from "./types";
import { MeasurementPreference } from "./types";

const METRES_IN_KM = 1000;
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

function getPaces(date5kTime: number, date5kSecondsPerKm: number): Times {
    return {
        date5k: date5kTime,
        recovery: { low: date5kSecondsPerKm + 56, high: date5kSecondsPerKm + 75 },
        tempo: { low: date5kSecondsPerKm + 12, high: date5kSecondsPerKm + 19 },
        five: { low: date5kSecondsPerKm - 2, high: date5kSecondsPerKm + 2 },
        overPace: { low: date5kSecondsPerKm - 19, high: date5kSecondsPerKm - 12 },
        strides: { low: date5kSecondsPerKm - 37, high: date5kSecondsPerKm - 25 },
    };
}

export function calculatePaces(date5k: number): Times {
    const date5kSecondsPerKm = METRES_IN_KM / date5k;
    const date5kTime = Math.floor(date5kSecondsPerKm * 5);

    return getPaces(date5kTime, date5kSecondsPerKm);
}

export function calculatePacesFromTime(date5kTime: number): Times {
    const date5kSecondsPerKm = date5kTime / 5;
    return getPaces(date5kTime, date5kSecondsPerKm);
}
