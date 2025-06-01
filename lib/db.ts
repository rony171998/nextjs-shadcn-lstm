import { Pool } from '@neondatabase/serverless';

// Initialize the Neon database client with Pool for better type safety
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Type for the query result
interface QueryResult {
  date: Date;
  close: number;
  open: number;
  high: number;
  low: number;
  avg_price: number;
}

export type Data = {
  date: string;
  avg_price: number;
  high: number;
  low: number;
  open: number;
  close: number;
};

// Helper function to safely execute dynamic table name queries
async function executeDynamicTableQuery(query: string, params: any[] = []): Promise<Data[]> {
  const client = await pool.connect();
  try {
    // Execute the query with the client
    const result = await client.query<QueryResult>(query, params);
    
    // Handle the result
    return result.rows.map(row => ({
      date: new Date(row.date).toISOString(),
      avg_price: Number(row.avg_price),
      high: Number(row.high),
      low: Number(row.low),
      open: Number(row.open),
      close: Number(row.close),
    }));
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    client.release();
  }
}

interface QueryOptions {
  limit?: number;
  tableName?: string;
  timeFrame?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export async function getEurUsdData({limit, tableName = 'eur_usd', timeFrame = 'daily'}: QueryOptions = {}): Promise<Data[]> {
  try {
    const params: any[] = [];
    
    // Base query parts
    let query = `
      SELECT
        fecha AS date,
        "último" AS close,
        "apertura" AS open,
        "máximo" AS high,
        "mínimo" AS low,
        "último" AS avg_price
      FROM ${tableName}
      ORDER BY fecha DESC
    `;
    
    // Add limit if provided
    if (limit) {
      query = `${query} LIMIT $1`;
      params.push(limit);
    }
    
    // Execute the query with parameters
    const result = await executeDynamicTableQuery(query, params);
    console.log('Daily data:', result[0]);
    return result;
  } catch (error) {
    console.error('Error fetching EUR/USD daily data:', error);
    throw error;
  }
}

export async function getEurUsdWeeklyData({limit, tableName = 'eur_usd'}: QueryOptions = {}): Promise<Data[]> {
  try {
    let query;
    if (limit) {
      query = `
        WITH weekly_data AS (
          SELECT 
            date_trunc('week', date) as date,
            AVG((high + low + close) / 3) as avg_price,
            MAX(high) as high,
            MIN(low) as low,
            FIRST_VALUE(open) OVER (PARTITION BY date_trunc('week', date) ORDER BY date) as open,
            LAST_VALUE(close) OVER (PARTITION BY date_trunc('week', date) ORDER BY date) as close
          FROM ${tableName}
          GROUP BY date_trunc('week', date), date
        )
        SELECT * FROM weekly_data
        ORDER BY date DESC
        LIMIT $1
      `;
      return await executeDynamicTableQuery(query, [limit]);
    } else {
      query = `
        WITH weekly_data AS (
          SELECT 
            date_trunc('week', date) as date,
            AVG((high + low + close) / 3) as avg_price,
            MAX(high) as high,
            MIN(low) as low,
            FIRST_VALUE(open) OVER (PARTITION BY date_trunc('week', date) ORDER BY date) as open,
            LAST_VALUE(close) OVER (PARTITION BY date_trunc('week', date) ORDER BY date) as close
          FROM ${tableName}
          GROUP BY date_trunc('week', date), date
        )
        SELECT * FROM weekly_data
        ORDER BY date DESC
      `;
      return await executeDynamicTableQuery(query);
    }
  } catch (error) {
    console.error('Error fetching EUR/USD weekly data:', error);
    throw error;
  }
}

export async function getEurUsdMonthlyData({limit, tableName = 'eur_usd'}: QueryOptions = {}): Promise<Data[]> {
  try {
    let query;
    if (limit) {
      query = `
        WITH monthly_data AS (
          SELECT 
            date_trunc('month', date) as date,
            AVG((high + low + close) / 3) as avg_price,
            MAX(high) as high,
            MIN(low) as low,
            FIRST_VALUE(open) OVER (PARTITION BY date_trunc('month', date) ORDER BY date) as open,
            LAST_VALUE(close) OVER (PARTITION BY date_trunc('month', date) ORDER BY date) as close
          FROM ${tableName}
          GROUP BY date_trunc('month', date), date
        )
        SELECT * FROM monthly_data
        ORDER BY date DESC
        LIMIT $1
      `;
      return await executeDynamicTableQuery(query, [limit]);
    } else {
      query = `
        WITH monthly_data AS (
          SELECT 
            date_trunc('month', date) as date,
            AVG((high + low + close) / 3) as avg_price,
            MAX(high) as high,
            MIN(low) as low,
            FIRST_VALUE(open) OVER (PARTITION BY date_trunc('month', date) ORDER BY date) as open,
            LAST_VALUE(close) OVER (PARTITION BY date_trunc('month', date) ORDER BY date) as close
          FROM ${tableName}
          GROUP BY date_trunc('month', date), date
        )
        SELECT * FROM monthly_data
        ORDER BY date DESC
      `;
      return await executeDynamicTableQuery(query);
    }
  } catch (error) {
    console.error('Error fetching EUR/USD monthly data:', error);
    throw error;
  }
}

export async function getEurUsdYearlyData({limit, tableName = 'eur_usd'}: QueryOptions = {}): Promise<Data[]> {
  try {
    const baseQuery = `
      WITH yearly_data AS (
        SELECT 
          date_trunc('year', date) as date,
          AVG((high + low + close) / 3) as avg_price,
          MAX(high) as high,
          MIN(low) as low,
          FIRST_VALUE(open) OVER (PARTITION BY date_trunc('year', date) ORDER BY date) as open,
          LAST_VALUE(close) OVER (PARTITION BY date_trunc('year', date) ORDER BY date) as close
        FROM ${tableName}
        GROUP BY date_trunc('year', date), date
      )
      SELECT * FROM yearly_data
      ORDER BY date DESC
    `;
    
    if (limit) {
      return await executeDynamicTableQuery(`${baseQuery} LIMIT $1`, [limit]);
    }
    
    return await executeDynamicTableQuery(baseQuery);
  } catch (error) {
    console.error('Error fetching EUR/USD yearly data:', error);
    throw error;
  }
}
