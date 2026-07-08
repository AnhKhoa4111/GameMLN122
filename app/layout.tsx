import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Giải Mã Tư Bản",
  description:
    "Trò chơi học thuật về tư bản tài chính, độc quyền và chủ quyền kinh tế Việt Nam.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[var(--game-bg)] text-[var(--game-white)] antialiased">
        {children}
      </body>
    </html>
  )
}