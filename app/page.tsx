import Card from "@/components/ui/Card"
import JoinLobbyForm from "@/components/lobby/JoinLobbyForm"

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--game-bg)] px-4">
      <div className="flex w-full max-w-[520px] flex-col items-center">
        <h1 className="max-w-4xl text-center font-extrabold leading-[0.95] tracking-tight text-black">
          <span className="mb-3 block text-[42px] leading-none text-[#FFC857] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)] md:text-[56px]">
            GIẢI MÃ
          </span>

          <span className="relative mt-4 inline-block text-[64px] leading-none tracking-[-0.06em] text-[var(--game-white)] md:text-[96px]">
            <span className="relative z-10">TƯ BẢN</span>
            <span className="absolute bottom-2 left-1 right-1 z-0 h-5 rounded-full bg-[#FFC857] md:h-7" />
          </span>
        </h1>

        <Card className="w-full max-w-[420px] px-12 py-10">
          <JoinLobbyForm />
        </Card>
      </div>
    </main>
  )
}
