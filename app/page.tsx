"use client"

import { useState } from "react"
import { MessageForm } from "@/components/message-form"
import { SealedMessage } from "@/components/sealed-message"
import { UnlockMessage } from "@/components/unlock-message"

export default function Home() {
  const [view, setView] = useState<"form" | "sealed" | "unlock">("form")
  const [capsuleId, setCapsuleId] = useState<string>("")

  const handleSealed = (id: string) => {
    setCapsuleId(id)
    setView("sealed")
  }

  const handleReset = () => {
    setView("form")
    setCapsuleId("")
  }

  const handleUnlock = () => {
    setView("unlock")
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {view === "form" && <MessageForm onSealed={handleSealed} onUnlock={handleUnlock} />}
        {view === "sealed" && <SealedMessage capsuleId={capsuleId} onReset={handleReset} />}
        {view === "unlock" && <UnlockMessage onBack={() => setView("form")} />}
      </div>
    </main>
  )
}
