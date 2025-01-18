// นำเข้า function drizzle จาก drizzle-orm สำหรับ PostgreSQL
import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"
// import { Pool } from 'pg';
import * as schema from "./schema"

// import * as dotenv from "dotenv";
// dotenv.config();

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
  throw new Error("DATABASE_URL environment variable is not defined.")
}

const DATABASE_URL = process.env.DATABASE_URL

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: true, // Neon requires SSL connections
})

// สร้างและส่งออก Object ฐานข้อมูลที่ใช้ drizzle กับ pool ที่สร้างขึ้น
export const db = drizzle(pool, { schema })
