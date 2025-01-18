import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { validateAndParseId } from "@/lib/utils"

// Function to handle GET requests for fetching an API key by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate and parse the ID from the request parameters
    const idOrResponse = await validateAndParseId(await params)
    if (idOrResponse instanceof Response) return idOrResponse // Return error response if validation fails
    const id: number = idOrResponse

    // Query the database for the API key with the specified ID
    const allApiKeys = await db.select().from(apiKeys).where(eq(apiKeys.id, id))

    // If no API key is found, return a 404 error response
    if (allApiKeys.length === 0) {
      return Response.json({ error: "API key not found" }, { status: 404 })
    }
    // Return the found API key as a JSON response
    return Response.json(allApiKeys[0])
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching an API key:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Function to handle DELETE requests for deleting an API key by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate and parse the ID from the request parameters
    const idOrResponse = await validateAndParseId(await params)
    if (idOrResponse instanceof Response) return idOrResponse // Return error response if validation fails
    const id: number = idOrResponse

    // Delete the API key with the specified ID from the database
    const [deletedApiKey] = await db
      .delete(apiKeys)
      .where(eq(apiKeys.id, id))
      .returning()

    // If no API key is found to delete, return a 404 error response
    if (!deletedApiKey) {
      return Response.json({ error: "API key not found" }, { status: 404 })
    }
    // Return a success message if the API key is deleted
    return Response.json({ message: "User deleted successfully" })
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error deleting an API key:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Interface for the request body when updating an API key
interface UpdateApiKeyBody {
  name?: string
  key?: string
}

// Function to handle PUT requests for updating an API key by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    // Validate and parse the ID from the request parameters
    const idOrResponse = await validateAndParseId(await params)
    if (idOrResponse instanceof Response) return idOrResponse
    const id = idOrResponse

    // Parse the request body to get the update data
    const body: UpdateApiKeyBody = await request.json()
    const { name, key } = body

    // If neither name nor key is provided, return a 400 error response
    if (!name && !key) {
      return Response.json(
        { error: "Name or key is required for updating API key" },
        { status: 400 }
      )
    }

    // Create an object to hold the update data
    const updateData: { name?: string; key?: string } = {}
    if (name) updateData.name = name
    if (key) updateData.key = key

    // Update the API key in the database with the new data
    const [updatedApiKey] = await db
      .update(apiKeys)
      .set(updateData)
      .where(eq(apiKeys.id, id))
      .returning()

    // If no API key is found to update, return a 404 error response
    if (!updatedApiKey) {
      return Response.json({ error: "API key not found" }, { status: 404 })
    }

    // Return the updated API key as a JSON response
    return Response.json(updatedApiKey)
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error updating API key:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}