import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"
import { asc, desc } from "drizzle-orm"

// existing code...
export async function GET() {
  try {
    const allApiKeys = await db
      .select()
      .from(apiKeys)
      .orderBy(asc(apiKeys.id))
    return Response.json(allApiKeys)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

interface CreateApiKeyRequest {
  name: string
  key: string
}
// POST - Create a new comment
export async function POST(request: Request) {
  try {
    const body: CreateApiKeyRequest = await request.json()
    const { name, key } = body
    console.log({ name, key })
    // Validate required fields
    if (!body.key || !body.name) {
      return Response.json(
        { error: "name, key are required" },
        { status: 400 }
      )
    }

    const [newApiKey] = await db
      .insert(apiKeys)
      .values(body)
      .returning()

    return Response.json(newApiKey, { status: 201 })
  } catch (error) {
    console.error("Error creating api key:", error)
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export const dynamic = "force-dynamic"