import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "GIẢI CỨU VIỆT NAM — Escape Room Kinh Tế",
    description: "Trò chơi học thuật về Tư bản Tài chính & Quyền lực Mềm của Độc quyền",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <body className="min-h-screen bg-gray-950">{children}</body>
        </html>
    )
}