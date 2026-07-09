import { NextRequest, NextResponse } from "next/server"
import { verifyAdminRequest } from "@/lib/server/adminAuth"

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req)

    if (!admin.ok) {
      return NextResponse.json({ error: admin.error }, { status: 403 })
    }

    return NextResponse.json({ ok: true, email: admin.email })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể xác thực admin" }, { status: 500 })
  }
}
