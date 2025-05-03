import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export type Data = {
  date: string;
  avg_price: number;
  high: number;
  low: number;
  open: number;
  close: number;
};

export async function getEurUsdData(): Promise<Data[]> {
  try {
    const result = await sql`
      SELECT
        fecha AS date,
        "último" AS close,
        "apertura" AS open,
        "máximo" AS high,
        "mínimo" AS low,
        "último" AS avg_price
      FROM eur_usd
      ORDER BY fecha DESC
      LIMIT 31;
    `;
    console.log('Daily data:', result[0]);
    // Daily data: [
    //  {
    //    fecha: 2011-05-03T05:00:00.000Z,
    //    'último': 1.4826,
    //    apertura: 1.4825,
    //    'máximo': 1.4891,
    //    'mínimo': 1.4753,
    //    vol: null,
    //    var: 0.01
    //  },
    return result.map((row: any) => ({
      date: row.date.toISOString(),
      avg_price: parseFloat(row.avg_price),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      open: parseFloat(row.open),
      close: parseFloat(row.close),
    }));
  } catch (error) {
    console.error('Error fetching EUR/USD daily data:', error);
    throw error;
  }
}

export async function getEurUsdWeeklyData(): Promise<Data[]> {
  try {
    const result = await sql`
      WITH base AS (
        SELECT fecha, "último", DATE_TRUNC('week', fecha) AS period
        FROM eur_usd
      ),
      ranked AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY period ORDER BY fecha ASC) AS rn_asc,
               ROW_NUMBER() OVER (PARTITION BY period ORDER BY fecha DESC) AS rn_desc
        FROM base
      ),
      open_close AS (
        SELECT period,
               MAX(CASE WHEN rn_asc = 1 THEN "último" END) AS open,
               MAX(CASE WHEN rn_desc = 1 THEN "último" END) AS close
        FROM ranked
        GROUP BY period
      ),
      stats AS (
        SELECT period,
               MAX("último") AS high,
               MIN("último") AS low,
               AVG("último") AS avg_price
        FROM base
        GROUP BY period
      )
      SELECT period AS date, open, close, high, low, ROUND(avg_price::numeric, 4) as avg_price
      FROM open_close
      JOIN stats USING (period)
      ORDER BY date DESC
      LIMIT 20;
    `;
    console.log('Weekly data:', result[0]);
    return result.map((row: any) => ({
      date: row.date.toISOString(),
      avg_price: parseFloat(row.avg_price),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      open: parseFloat(row.open),
      close: parseFloat(row.close),
    }));
  } catch (error) {
    console.error('Error fetching EUR/USD weekly data:', error);
    throw error;
  }
}

export async function getEurUsdMonthlyData(): Promise<Data[]> {
  try {
    const result = await sql`
      WITH base AS (
        SELECT fecha, "último", DATE_TRUNC('month', fecha) AS period
        FROM eur_usd
      ),
      ranked AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY period ORDER BY fecha ASC) AS rn_asc,
               ROW_NUMBER() OVER (PARTITION BY period ORDER BY fecha DESC) AS rn_desc
        FROM base
      ),
      open_close AS (
        SELECT period,
               MAX(CASE WHEN rn_asc = 1 THEN "último" END) AS open,
               MAX(CASE WHEN rn_desc = 1 THEN "último" END) AS close
        FROM ranked
        GROUP BY period
      ),
      stats AS (
        SELECT period,
               MAX("último") AS high,
               MIN("último") AS low,
               AVG("último") AS avg_price
        FROM base
        GROUP BY period
      )
      SELECT period AS date, open, close, high, low, ROUND(avg_price::numeric, 4) as avg_price
      FROM open_close
      JOIN stats USING (period)
      ORDER BY date DESC
      LIMIT 20;
    `;
    console.log('Monthly data:', result[0]);
    return result.map((row: any) => ({
      date: row.date.toISOString(),
      avg_price: parseFloat(row.avg_price),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      open: parseFloat(row.open),
      close: parseFloat(row.close),
    }));
  } catch (error) {
    console.error('Error fetching EUR/USD monthly data:', error);
    throw error;
  }
}

export async function getEurUsdYearlyData(): Promise<Data[]> {
  try {
    const result = await sql`
      WITH base AS (
        SELECT fecha, "último", DATE_TRUNC('year', fecha) AS period
        FROM eur_usd
      ),
      ranked AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY period ORDER BY fecha ASC) AS rn_asc,
               ROW_NUMBER() OVER (PARTITION BY period ORDER BY fecha DESC) AS rn_desc
        FROM base
      ),
      open_close AS (
        SELECT period,
               MAX(CASE WHEN rn_asc = 1 THEN "último" END) AS open,
               MAX(CASE WHEN rn_desc = 1 THEN "último" END) AS close
        FROM ranked
        GROUP BY period
      ),
      stats AS (
        SELECT period,
               MAX("último") AS high,
               MIN("último") AS low,
               AVG("último") AS avg_price
        FROM base
        GROUP BY period
      )
      SELECT period AS date, open, close, high, low, ROUND(avg_price::numeric, 4) as avg_price
      FROM open_close
      JOIN stats USING (period)
      ORDER BY date DESC
      LIMIT 10;
    `;
    console.log('Yearly data:', result[0]);
    return result.map((row: any) => ({
      date: row.date.toISOString(),
      avg_price: parseFloat(row.avg_price),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      open: parseFloat(row.open),
      close: parseFloat(row.close),
    }));
  } catch (error) {
    console.error('Error fetching EUR/USD yearly data:', error);
    throw error;
  }
}
