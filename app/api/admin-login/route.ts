import { NextRequest, NextResponse } from "next/server"
import { verifyAdminRequest } from "@/lib/server/adminAuth"

export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req)

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  return NextResponse.json({ ok: true, email: auth.email })
}
