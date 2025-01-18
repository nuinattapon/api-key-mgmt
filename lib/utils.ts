
export async function validateAndParseId(params: {
    id: string
  }): Promise<number | Response> {
    if (!params || typeof params.id === "undefined") {
      return Response.json({ error: "ID is missing" }, { status: 404 })
    }
  
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
      return Response.json(
        { error: "Invalid ID: Unable to parse as an integer" },
        { status: 400 }
      )
    }
  
    return id
  }