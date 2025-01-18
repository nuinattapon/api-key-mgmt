import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

// Function to handle GET requests
export async function GET() {
  try {
    // Fetch all API keys from the database, ordered by ID in ascending order
    const allApiKeys = await db
      .select()
      .from(apiKeys)
      .orderBy(desc(apiKeys.id))
    
    // Return the fetched API keys as a JSON response
    return Response.json(allApiKeys)
  } catch (error) {
    // Log any errors and return a 500 Internal Server Error response
    console.error("Error fetching API keys:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Interface to define the structure of the request body for creating an API key
interface CreateApiKeyRequest {
  name: string
  key: string
}

// Function to handle POST requests for creating a new API key
export async function POST(request: Request) {
  try {
    // Parse the request body as JSON
    const body: CreateApiKeyRequest = await request.json()

    // Validate that both 'name' and 'key' fields are present
    if (!body.key || !body.name) {
      return Response.json(
        { error: "Name and key are required" },
        { status: 400 }
      )
    }

    // Insert the new API key into the database and return the newly created key
    const [newApiKey] = await db
      .insert(apiKeys)
      .values(body)
      .returning()

    // Return the new API key as a JSON response with a 201 Created status
    return Response.json(newApiKey, { status: 201 })
  } catch (error) {
    // Log any errors and return a 500 Internal Server Error response
    console.error("Error creating API key:", error)
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

