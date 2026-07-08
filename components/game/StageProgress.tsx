import { FINAL_STAGE } from "@/lib/types/stage"

export default function StageProgress({ currentStage }: { currentStage: number }) {
  return (
    <div className="mt-6 flex gap-2">
      {Array.from({ length: FINAL_STAGE }, (_, index) => {
        const stage = index + 1
        const isReached = stage <= currentStage

        return (
          <div
            key={stage}
            className={`h-3 flex-1 border-2 border-[var(--game-white)] ${
              isReached ? "bg-[var(--game-yellow)]" : "bg-[var(--game-bg-light)]"
            }`}
            title={`Stage ${stage}`}
          />
        )
      })}
    </div>
  )
}
