import { apiKeys } from "./schema"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined.")
}

const sql = neon(process.env.DATABASE_URL!)

const db = drizzle(sql, {
  schema,
})

const main = async () => {
  try {
    console.log("Seeding database")
    // Delete all data
    await db.delete(apiKeys)
    await db.insert(apiKeys).values([
      {
        name: "production",
        key: "prod",
      },
      {
        name: "development",
        key: "test",
      },
    ])

  } catch (error) {
    console.error(error)
    throw new Error("Failed to seed database")
  }
}

main()
