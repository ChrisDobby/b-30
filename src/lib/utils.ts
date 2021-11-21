import type { Times } from "./types";

const METRES_IN_KM = 1000;
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

export function timeFromSeconds(seconds: number): string {
    const minutes = seconds / SECONDS_IN_MINUTE;
    const hours = minutes / MINUTES_IN_HOUR;
    const fractionSeconds = addLeadingZero(fractionToPartOfTime(minutes % 1));
    if (hours >= 1) {
        return `${Math.trunc(hours)}:${addLeadingZero(fractionToPartOfTime(hours % 1))}:${fractionSeconds} hrs`;
    }

    return `${Math.trunc(minutes)}:${fractionSeconds} mins`;
}

export function distanceInKm(distanceInMetres: number): string {
    return `${to2Decimals(distanceInMetres / METRES_IN_KM)} km`;
}

export function calculateSpeedAndPace(metresPerSecond: number): [string, string] {
    const metresPerHour = metresPerSecond * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
    const kmPerHour = metresPerHour / METRES_IN_KM;
    const secondsPerKm = METRES_IN_KM / metresPerSecond;
    return [`${to2Decimals(kmPerHour)} km/hour`, `${timeFromSeconds(secondsPerKm)}/km`];
}

export function calculateTimes(metresPerSecond: number): Times {
    const date5k = Math.floor((METRES_IN_KM / metresPerSecond) * 5);

    return {
        date5k,
        recovery: [date5k + 56, date5k + 75],
        tempo: [date5k + 12, date5k + 19],
        five: [date5k - 2, date5k + 2],
        ten: [date5k + 9, date5k + 16],
        overPace: [date5k - 19, date5k - 12],
        strides: [date5k - 37, date5k - 25],
    };
}
