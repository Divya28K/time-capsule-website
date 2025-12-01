"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface UnlockMessageProps {
  onBack: () => void
}

export function UnlockMessage({ onBack }: UnlockMessageProps) {
  const [capsules, setCapsules] = useState<any[]>([])
  const [selectedCapsule, setSelectedCapsule] = useState<any>(null)
  const [isUnlocking, setIsUnlocking] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("timeCapsules") || "[]")
    setCapsules(stored)
  }, [])

  const handleUnlock = (capsule: any) => {
    const unlockDate = new Date(capsule.unlockDate)
    const today = new Date()

    if (today < unlockDate) {
      const daysLeft = Math.ceil((unlockDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      alert(`This capsule isn't ready yet! Come back in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}.`)
      return
    }

    setIsUnlocking(true)

    setTimeout(() => {
      // Mark as unlocked
      const updated = capsules.map((c) =>
        c.id === capsule.id ? { ...c, unlocked: true, unlockedAt: new Date().toISOString() } : c,
      )
      localStorage.setItem("timeCapsules", JSON.stringify(updated))

      setSelectedCapsule(capsule)
      setIsUnlocking(false)
    }, 1500)
  }

  if (selectedCapsule) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-6 bg-card p-8 md:p-12 rounded-2xl shadow-lg border border-border">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-accent">
            <svg className="w-10 h-10 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-balance text-primary">Capsule Unlocked</h2>

          <p className="text-sm text-muted-foreground">
            Written on{" "}
            {new Date(selectedCapsule.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="bg-muted p-6 rounded-xl text-left">
            <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground">{selectedCapsule.message}</p>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => {
              setSelectedCapsule(null)
              onBack()
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Back to home
          </Button>
        </div>
      </div>
    )
  }

  if (isUnlocking) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-6 bg-card p-12 rounded-2xl shadow-lg border border-border">
          <div className="inline-block w-16 h-16 border-4 rounded-full animate-spin border-border border-t-primary" />
          <p className="text-lg text-muted-foreground">Unlocking your time capsule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-balance text-primary">Your Time Capsules</h1>
        <p className="text-lg text-pretty text-muted-foreground">Select a capsule to unlock</p>
      </header>

      {capsules.length === 0 ? (
        <div className="text-center space-y-6 bg-card p-12 rounded-2xl shadow-lg border border-border">
          <p className="text-lg text-muted-foreground">You don't have any time capsules yet.</p>
          <Button onClick={onBack} variant="outline">
            Create your first capsule
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {capsules.map((capsule) => {
            const unlockDate = new Date(capsule.unlockDate)
            const today = new Date()
            const isReady = today >= unlockDate
            const daysLeft = Math.ceil((unlockDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            return (
              <div
                key={capsule.id}
                className="bg-card p-6 rounded-xl shadow-lg border border-border flex items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isReady ? "bg-green-500" : "bg-amber-500"}`} />
                    <p className="font-medium text-foreground">
                      {unlockDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <p className="text-sm line-clamp-2 text-muted-foreground">{capsule.message}</p>
                  {!isReady && (
                    <p className="text-xs text-muted-foreground">
                      {daysLeft} {daysLeft === 1 ? "day" : "days"} until unlock
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleUnlock(capsule)}
                  disabled={!isReady}
                  className={isReady ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                >
                  {isReady ? "Unlock" : "Locked"}
                </Button>
              </div>
            )
          })}
        </div>
      )}

      <div className="text-center">
        <Button onClick={onBack} variant="outline">
          Create new capsule
        </Button>
      </div>
    </div>
  )
}
