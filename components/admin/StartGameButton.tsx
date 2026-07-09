import Button from "@/components/ui/Button"

type StartGameButtonProps = {
  disabled?: boolean
  isStarted?: boolean
  onStart: () => void
}

export default function StartGameButton({
  disabled,
  isStarted,
  onStart,
}: StartGameButtonProps) {
  return (
    <Button type="button" disabled={disabled || isStarted} onClick={onStart}>
      {isStarted ? "Game đã bắt đầu" : "Bắt đầu game"}
    </Button>
  )
}
