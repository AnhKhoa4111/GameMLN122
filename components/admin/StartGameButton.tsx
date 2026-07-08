import Button from "@/components/ui/Button"

export default function StartGameButton({
  isBusy,
  onStart,
}: {
  isBusy: boolean
  onStart: () => void
}) {
  return (
    <Button disabled={isBusy} onClick={onStart}>
      Bắt đầu game
    </Button>
  )
}
