import type { ReactNode } from "react"
import Button from "@/components/ui/Button"

export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-[var(--game-bg-dark)] p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.35)]">
        <h2 className="text-2xl font-black">{title}</h2>
        <div className="mt-4">{children}</div>
        <Button className="mt-6 w-full" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </div>
  )
}
