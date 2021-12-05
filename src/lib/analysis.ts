import type {
    Paces,
    TimeRange,
    ActivityLap,
    LapAnalysis,
    PaceAnalysis,
    Analysis,
    AnalysisResult,
    PaceAnalysisWithOther,
} from "./types";
import { METRES_IN_KM } from "./utils";

function isInRange(secondsPerKm: number, range: TimeRange) {
    return secondsPerKm >= range.low && secondsPerKm <= range.high;
}

function getSecondsPerKm(metresPerSecond: number) {
    return METRES_IN_KM / metresPerSecond;
}

type PaceProperties = "recovery" | "tempo" | "five" | "overPace" | "strides";
function getPaceForSpeed(paces: Paces, speed: number): PaceProperties | null {
    const secondsPerKm = getSecondsPerKm(speed);
    return (
        (["recovery", "tempo", "five", "overPace", "strides"].find(pace =>
            isInRange(secondsPerKm, paces[pace]),
        ) as PaceProperties) || null
    );
}

function getLapStreams(lap: ActivityLap, velocityStream: number[], heartrateStream: number[]) {
    return {
        ...lap,
        lapVelocity: velocityStream.slice(lap.startIndex, lap.endIndex),
        lapHeartRate: heartrateStream.slice(lap.startIndex, lap.endIndex),
    };
}

function getPercentage(value: number, count: number) {
    return Math.round((value / count) * 100);
}

function getAverageFromArray(array: number[]) {
    return Math.round(array.reduce((a, b) => a + b, 0) / array.length || 0);
}

function createLapAnalysis(lap: ActivityLap, paceAnalysis, heartRateAnalysis): LapAnalysis {
    const count = lap.endIndex - lap.startIndex;
    const timeAtPace = {
        recovery: getPercentage(paceAnalysis.recovery, count),
        tempo: getPercentage(paceAnalysis.tempo, count),
        five: getPercentage(paceAnalysis.five, count),
        overPace: getPercentage(paceAnalysis.overPace, count),
        strides: getPercentage(paceAnalysis.strides, count),
    };

    const percentageOfTimeAtPace: PaceAnalysisWithOther = {
        ...timeAtPace,
        other: 100 - Object.values(timeAtPace).reduce((a, b) => a + b, 0),
    };
    const averageHeartRateAtPace: PaceAnalysis = {
        recovery: getAverageFromArray(heartRateAnalysis.recovery),
        tempo: getAverageFromArray(heartRateAnalysis.tempo),
        five: getAverageFromArray(heartRateAnalysis.five),
        overPace: getAverageFromArray(heartRateAnalysis.overPace),
        strides: getAverageFromArray(heartRateAnalysis.strides),
    };

    return { ...lap, percentageOfTimeAtPace, averageHeartRateAtPace };
}

function getFullAnalysisFromLaps(laps: LapAnalysis[]): Analysis {
    const timeAtPace = {
        recovery: Math.round(laps.reduce((a, b) => a + b.percentageOfTimeAtPace.recovery, 0) / laps.length),
        tempo: Math.round(laps.reduce((a, b) => a + b.percentageOfTimeAtPace.tempo, 0) / laps.length),
        five: Math.round(laps.reduce((a, b) => a + b.percentageOfTimeAtPace.five, 0) / laps.length),
        overPace: Math.round(laps.reduce((a, b) => a + b.percentageOfTimeAtPace.overPace, 0) / laps.length),
        strides: Math.round(laps.reduce((a, b) => a + b.percentageOfTimeAtPace.strides, 0) / laps.length),
    };
    const percentageOfTimeAtPace: PaceAnalysisWithOther = {
        ...timeAtPace,
        other: 100 - Object.values(timeAtPace).reduce((a, b) => a + b, 0),
    };

    const averageHeartRateAtPace: PaceAnalysis = {
        recovery: getAverageFromArray(laps.reduce((a, b) => a.concat(b.averageHeartRateAtPace.recovery), [])),
        tempo: getAverageFromArray(laps.reduce((a, b) => a.concat(b.averageHeartRateAtPace.tempo), [])),
        five: getAverageFromArray(laps.reduce((a, b) => a.concat(b.averageHeartRateAtPace.five), [])),
        overPace: getAverageFromArray(laps.reduce((a, b) => a.concat(b.averageHeartRateAtPace.overPace), [])),
        strides: getAverageFromArray(laps.reduce((a, b) => a.concat(b.averageHeartRateAtPace.strides), [])),
    };

    return { percentageOfTimeAtPace, averageHeartRateAtPace };
}

export function analyseStreams(
    paces: Paces,
    laps: ActivityLap[],
    velocityStream: number[],
    heartrateStream: number[],
): AnalysisResult {
    const lapStreams = laps.map(lap => getLapStreams(lap, velocityStream, heartrateStream));

    const analysedLaps = [] as LapAnalysis[];

    for (const lapStream of lapStreams) {
        const lapPaceAnalysis = {
            recovery: 0,
            tempo: 0,
            five: 0,
            overPace: 0,
            strides: 0,
        };
        const lapHeartRateAnalysis = {
            recovery: [] as number[],
            tempo: [] as number[],
            five: [] as number[],
            overPace: [] as number[],
            strides: [] as number[],
        };

        for (let i = 0; i < lapStream.lapVelocity.length; i++) {
            const lapVelocity = lapStream.lapVelocity[i];
            const lapHeartRate = lapStream.lapHeartRate[i];
            const pace = getPaceForSpeed(paces, lapVelocity);
            if (!pace) {
                continue;
            }

            lapPaceAnalysis[pace] += 1;
            lapHeartRateAnalysis[pace].push(lapHeartRate);
        }

        const { lapHeartRate, lapVelocity, ...lap } = lapStream;
        analysedLaps.push(createLapAnalysis(lap, lapPaceAnalysis, lapHeartRateAnalysis));
    }

    return { ...getFullAnalysisFromLaps(analysedLaps), laps: analysedLaps };
}
