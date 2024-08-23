import "server-only";
import { Pool, QueryResult } from "pg";

// Create a new pool instance
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "") || 5432,
  database: process.env.PG_DATABASE,
});

// Function to execute a query
export const executeQuery = async (
  query: string,
  params: any[] = []
): Promise<QueryResult> => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

export const createUser = async (username: string, password: string) => {
  const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
  const result = await executeQuery(query, [username, password]);
  return result.rows[0];
};

export const findUser = async (username: string) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const result = await executeQuery(query, [username]);
  return result.rows[0];
};
