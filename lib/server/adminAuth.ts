export function isValidAdminCode(adminCode: unknown): boolean {
  const expectedCode = process.env.ADMIN_CODE ?? process.env.HOST_CODE ?? "admin"
  return String(adminCode ?? "") === expectedCode
}
