import type { NextRequest } from "next/server"
import { supabase } from "@/lib/server/supabase"

export type AdminAuthResult =
  | {
      ok: true
      email: string
    }
  | {
      ok: false
      error: string
    }

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}

export async function verifyAdminRequest(
  req: NextRequest
): Promise<AdminAuthResult> {
  const authorization = req.headers.get("authorization")
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : ""

  if (!token) {
    return { ok: false, error: "Bạn cần đăng nhập bằng Google." }
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user?.email) {
    return { ok: false, error: "Phiên đăng nhập admin không hợp lệ." }
  }

  if (!isAdminEmail(data.user.email)) {
    return { ok: false, error: "Email này không có quyền admin." }
  }

  return { ok: true, email: data.user.email }
}
