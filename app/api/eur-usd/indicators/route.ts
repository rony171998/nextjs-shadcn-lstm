import { NextResponse } from "next/server";
import {
    Data,
    getEurUsdWeeklyData,
    getEurUsdMonthlyData,
    getEurUsdData,
    getEurUsdYearlyData,
} from "@/lib/db";

function calculateRSI(
    data: Data[],
    period: number = 14
): { date: string; value: number }[] {
    if (data.length < period + 1) return [];

    const rsiData: { date: string; value: number }[] = [];
    let gains = 0;
    let losses = 0;

    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
        const change = data[i].close - data[i - 1].close;
        if (change >= 0) {
            gains += change;
        } else {
            losses += Math.abs(change);
        }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate RSI for the first point
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    rsiData.push({ date: data[period].date, value: rsi });

    // Calculate RSI for remaining points
    for (let i = period + 1; i < data.length; i++) {
        const change = data[i].close - data[i - 1].close;
        let currentGain = 0;
        let currentLoss = 0;

        if (change >= 0) {
            currentGain = change;
        } else {
            currentLoss = Math.abs(change);
        }

        avgGain = (avgGain * (period - 1) + currentGain) / period;
        avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

        const rs = avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);
        rsiData.push({ date: data[i].date, value: rsi });
    }

    return rsiData;
}

function calculateSMA(
    data: Data[],
    period: number = 20
): { date: string; value: number }[] {
    if (data.length < period) return [];

    const smaData: { date: string; value: number }[] = [];

    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
        }
        const sma = sum / period;
        smaData.push({ date: data[i].date, value: sma });
    }

    return smaData;
}

function calculateEMA(
    data: Data[],
    period: number = 20
): { date: string; value: number }[] {
    if (data.length < period) return [];

    const emaData: { date: string; value: number }[] = [];
    const multiplier = 2 / (period + 1);

    // Calculate SMA for the first EMA value
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += data[i].close;
    }
    let ema = sum / period;
    emaData.push({ date: data[period - 1].date, value: ema });

    // Calculate EMA for remaining points
    for (let i = period; i < data.length; i++) {
        ema = (data[i].close - ema) * multiplier + ema;
        emaData.push({ date: data[i].date, value: ema });
    }

    return emaData;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "daily";

    try {
        let data: Data[];

        if (period === "weekly") {
            data = await getEurUsdWeeklyData();
        } else if (period === "monthly") {
            data = await getEurUsdMonthlyData();
        } else if (period === "yearly") {
            data = await getEurUsdYearlyData();
        } else {
            data = await getEurUsdData();
        }

        if (data.length < 20) {
            return NextResponse.json(
                { error: "Insufficient data for indicator calculations" },
                { status: 400 }
            );
        }

        const effectiveRSIPeriod = Math.min(14, data.length - 1);
        const effectiveSmaPeriod = Math.min(20, data.length);
        const effectiveEmaPeriod = Math.min(20, data.length);

        const indicators = {
            rsi: calculateRSI(data, effectiveRSIPeriod),
            sma: calculateSMA(data, effectiveSmaPeriod),
            ema: calculateEMA(data, effectiveEmaPeriod),
        };

        console.log("Calculated indicators:", indicators);

        return NextResponse.json(indicators);
    } catch (error) {
        console.error("Error calculating indicators:", error);
        return NextResponse.json(
            { error: "Failed to calculate indicators" },
            { status: 500 }
        );
    }
}
