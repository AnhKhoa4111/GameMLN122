import { NextRequest } from "next/server"
import { supabase } from "@/lib/server/supabase"

export type AdminAuthResult =
  | { ok: true; email: string }
  | { ok: false; error: string; status: number }

function getAllowedAdminEmails() {
  return new Set(
    String(process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  )
}

export async function verifyAdminRequest(
  req: NextRequest
): Promise<AdminAuthResult> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")

  if (!token) {
    return { ok: false, error: "Thiếu phiên đăng nhập admin.", status: 401 }
  }

  const allowedEmails = getAllowedAdminEmails()

  if (allowedEmails.size === 0) {
    return {
      ok: false,
      error: "Chưa cấu hình ADMIN_EMAILS trong môi trường.",
      status: 500,
    }
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user?.email) {
    return { ok: false, error: "Phiên đăng nhập không hợp lệ.", status: 403 }
  }

  const email = data.user.email.toLowerCase()

  if (!allowedEmails.has(email)) {
    return { ok: false, error: "Email này không có quyền admin.", status: 403 }
  }

  return { ok: true, email }
}
