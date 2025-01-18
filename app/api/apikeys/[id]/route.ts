import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { validateAndParseId } from "@/lib/utils"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const idOrResponse = await validateAndParseId(await params)
    if (idOrResponse instanceof Response) return idOrResponse // Return error response if validation fails
    const id: number = idOrResponse

    // ดึงข้อมูล user และ posts โดยใช้ join
    const allApiKeys = await db.select().from(apiKeys).where(eq(apiKeys.id, id))

    // ตรวจสอบว่าพบ user หรือไม่
    if (allApiKeys.length === 0) {
      return Response.json({ error: "API key not found" }, { status: 404 })
    }
    return Response.json(allApiKeys[0])
  } catch (error) {
    // จัดการกับข้อผิดพลาด
    console.error("Error fetching an API key:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const idOrResponse = await validateAndParseId(await params)
    if (idOrResponse instanceof Response) return idOrResponse // Return error response if validation fails
    const id: number = idOrResponse

    // ดึงข้อมูล user และ posts โดยใช้ join
    const [deletedApiKey] = await db
      .delete(apiKeys)
      .where(eq(apiKeys.id, id))
      .returning()

    // ตรวจสอบว่าพบ user หรือไม่
    if (!deletedApiKey) {
      return Response.json({ error: "API key not found" }, { status: 404 })
    }
    return Response.json({ message: "User deleted successfully" })
  } catch (error) {
    // จัดการกับข้อผิดพลาด
    console.error("Error deleting an API key:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

interface UpdateApiKeyBody {
  name?: string
  key?: string
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    const idOrResponse = await validateAndParseId(await params)
    if (idOrResponse instanceof Response) return idOrResponse // Return error response if validation fails
    const id = idOrResponse
    // รับข้อมูลที่ต้องการอัพเดทจาก request body
    const body: UpdateApiKeyBody = await request.json()
    const { name, key } = body

    // ตรวจสอบว่ามีข้อมูลที่จะอัพเดทหรือไม่
    if (!name && !key) {
      return Response.json(
        { error: "Name or key is required for updating API key" },
        { status: 400 }
      )
    }

    // สร้าง object สำหรับเก็บข้อมูลที่จะอัพเดท
    const updateData: { name?: string; key?: string } = {}
    if (name) updateData.name = name
    if (key) updateData.key = key

    // อัพเดทข้อมูล user ในฐานข้อมูล
    const [updatedApiKey] = await db
      .update(apiKeys)
      .set(updateData)
      .where(eq(apiKeys.id, id))
      .returning()

    // ถ้าไม่พบ apikey ให้ส่ง response แจ้ง error
    if (!updatedApiKey) {
      return Response.json({ error: "API key not found" }, { status: 404 })
    }

    // ส่ง response กลับไปพร้อมข้อมูล user ที่อัพเดทแล้ว
    return Response.json(updatedApiKey)
  } catch (error) {
    // จัดการกรณีเกิด error
    console.error("Error updating API key:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}