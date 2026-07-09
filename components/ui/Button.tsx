import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "primary" | "danger" | "secondary"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--game-white)] bg-[var(--game-yellow)] text-[var(--game-bg-dark)] hover:bg-[var(--game-yellow-hover)]",
  danger: "border-[var(--game-white)] bg-red-500 text-white hover:bg-red-600",
  secondary:
    "border-[var(--game-white)] bg-[var(--game-bg-light)] text-[var(--game-white)] hover:bg-[var(--game-bg-focus)]",
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`border-4 px-5 py-3 font-black shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}