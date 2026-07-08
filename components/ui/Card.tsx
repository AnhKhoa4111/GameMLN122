import type { ReactNode } from "react"

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`bg-[var(--game-bg-dark)] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.25)] ${className}`}
    >
      {children}
    </section>
  )
}
