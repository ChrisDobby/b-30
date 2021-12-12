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

type PacesWithCombinations = Paces & {
    tempoRecovery: TimeRange;
    fiveTempo: TimeRange;
    overPaceFive: TimeRange;
    stridesOverPace: TimeRange;
};

function getPacesWithCombinations(paces: Paces): PacesWithCombinations {
    return {
        ...paces,
        tempoRecovery: { low: paces.tempo.high, high: paces.recovery.low },
        fiveTempo: { low: paces.five.high, high: paces.tempo.low },
        overPaceFive: { low: paces.overPace.high, high: paces.five.low },
        stridesOverPace: { low: paces.strides.high, high: paces.overPace.low },
    };
}

type PaceProperties =
    | "recovery"
    | "tempoRecovery"
    | "tempo"
    | "fiveTempo"
    | "five"
    | "overPaceFive"
    | "overPace"
    | "stridesOverPace"
    | "strides";
function getPaceForSpeed(paces: PacesWithCombinations, speed: number): PaceProperties | null {
    const secondsPerKm = getSecondsPerKm(speed);
    return (
        ([
            "recovery",
            "tempoRecovery",
            "tempo",
            "fiveTempo",
            "five",
            "overPaceFive",
            "overPace",
            "stridesOverPace",
            "strides",
        ].find(pace => isInRange(secondsPerKm, paces[pace])) as PaceProperties) || null
    );
}

function getLapStreams(
    lap: ActivityLap,
    velocityStream: number[],
    heartrateStream: number[],
    distanceStream: number[],
) {
    const distances = distanceStream.reduce(
        (acc, distance, index) => [
            ...acc,
            index === 0 ? distance : Math.round((distance - distanceStream[index - 1]) * 10) / 10,
        ],
        [],
    );

    return {
        ...lap,
        lapVelocity: velocityStream.slice(lap.startIndex, lap.endIndex),
        lapHeartRate: heartrateStream.slice(lap.startIndex, lap.endIndex),
        lapDistance: distances.slice(lap.startIndex, lap.endIndex),
    };
}

function getPercentage(value: number, count: number) {
    return Math.round((value / count) * 100);
}

function getAverageFromArray(array: number[]) {
    return Math.round(array.reduce((a, b) => a + b, 0) / array.length || 0);
}

function createAnalysis(paceAnalysis, heartRateAnalysis, count: number): Analysis {
    const timeAtPace = {
        recovery: getPercentage(paceAnalysis.recovery, count),
        tempoRecovery: getPercentage(paceAnalysis.tempoRecovery, count),
        tempo: getPercentage(paceAnalysis.tempo, count),
        fiveTempo: getPercentage(paceAnalysis.fiveTempo, count),
        five: getPercentage(paceAnalysis.five, count),
        overPaceFive: getPercentage(paceAnalysis.overPaceFive, count),
        overPace: getPercentage(paceAnalysis.overPace, count),
        stridesOverPace: getPercentage(paceAnalysis.stridesOverPace, count),
        strides: getPercentage(paceAnalysis.strides, count),
    };

    const percentageOfTimeAtPace: PaceAnalysisWithOther = {
        ...timeAtPace,
        other: 100 - Object.values(timeAtPace).reduce((a, b) => a + b, 0),
    };
    const averageHeartRateAtPace: PaceAnalysis = {
        recovery: getAverageFromArray(heartRateAnalysis.recovery),
        tempoRecovery: getAverageFromArray(heartRateAnalysis.tempoRecovery),
        tempo: getAverageFromArray(heartRateAnalysis.tempo),
        fiveTempo: getAverageFromArray(heartRateAnalysis.fiveTempo),
        five: getAverageFromArray(heartRateAnalysis.five),
        overPaceFive: getAverageFromArray(heartRateAnalysis.overPaceFive),
        overPace: getAverageFromArray(heartRateAnalysis.overPace),
        stridesOverPace: getAverageFromArray(heartRateAnalysis.stridesOverPace),
        strides: getAverageFromArray(heartRateAnalysis.strides),
    };

    return {
        percentageOfTimeAtPace,
        averageHeartRateAtPace,
    };
}
function createLapAnalysis(
    paces: PacesWithCombinations,
    lap: ActivityLap,
    paceAnalysis,
    heartRateAnalysis,
): LapAnalysis {
    return {
        ...lap,
        ...createAnalysis(paceAnalysis, heartRateAnalysis, lap.distance),
        pace: getPaceForSpeed(paces, lap.averageSpeed) || "other",
    };
}

export function analyseActivity(
    paces: Paces,
    laps: ActivityLap[],
    distanceStream: number[],
    velocityStream: number[],
    heartrateStream: number[],
): AnalysisResult {
    const allPaces = getPacesWithCombinations(paces);
    const lapStreams = laps.map(lap => getLapStreams(lap, velocityStream, heartrateStream, distanceStream));

    const analysedLaps = [] as LapAnalysis[];

    const fullPaceAnalysis = {
        recovery: 0,
        tempoRecovery: 0,
        tempo: 0,
        fiveTempo: 0,
        five: 0,
        overPaceFive: 0,
        overPace: 0,
        stridesOverPace: 0,
        strides: 0,
    };

    const fullHeartRateAnalysis = {
        recovery: [] as number[],
        tempoRecovery: [] as number[],
        tempo: [] as number[],
        fiveTempo: [] as number[],
        five: [] as number[],
        overPaceFive: [] as number[],
        overPace: [] as number[],
        stridesOverPace: [] as number[],
        strides: [] as number[],
    };

    for (const lapStream of lapStreams) {
        const lapPaceAnalysis = {
            recovery: 0,
            tempoRecovery: 0,
            tempo: 0,
            fiveTempo: 0,
            five: 0,
            overPaceFive: 0,
            overPace: 0,
            stridesOverPace: 0,
            strides: 0,
        };
        const lapHeartRateAnalysis = {
            recovery: [] as number[],
            tempoRecovery: [] as number[],
            tempo: [] as number[],
            fiveTempo: [] as number[],
            five: [] as number[],
            overPaceFive: [] as number[],
            overPace: [] as number[],
            stridesOverPace: [] as number[],
            strides: [] as number[],
        };

        for (let i = 0; i < lapStream.lapVelocity.length; i++) {
            const lapVelocity = lapStream.lapVelocity[i];
            const lapHeartRate = lapStream.lapHeartRate[i];
            const pace = getPaceForSpeed(allPaces, lapVelocity);
            if (!pace) {
                continue;
            }

            lapPaceAnalysis[pace] += lapStream.lapDistance[i];
            fullPaceAnalysis[pace] += lapStream.lapDistance[i];

            lapHeartRateAnalysis[pace].push(lapHeartRate);
            fullHeartRateAnalysis[pace].push(lapHeartRate);
        }

        const { lapHeartRate, lapVelocity, ...lap } = lapStream;
        analysedLaps.push(createLapAnalysis(allPaces, lap, lapPaceAnalysis, lapHeartRateAnalysis));
    }

    return {
        ...createAnalysis(fullPaceAnalysis, fullHeartRateAnalysis, distanceStream[distanceStream.length - 1]),
        laps: analysedLaps,
    };
}
