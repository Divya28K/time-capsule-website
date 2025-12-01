"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface SealedMessageProps {
  capsuleId: string
  onReset: () => void
}

export function SealedMessage({ capsuleId, onReset }: SealedMessageProps) {
  const [capsule, setCapsule] = useState<any>(null)
  const [daysUntil, setDaysUntil] = useState<number>(0)

  useEffect(() => {
    const capsules = JSON.parse(localStorage.getItem("timeCapsules") || "[]")
    const found = capsules.find((c: any) => c.id === capsuleId)

    if (found) {
      setCapsule(found)

      const unlockDate = new Date(found.unlockDate)
      const today = new Date()
      const diffTime = unlockDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysUntil(diffDays)
    }
  }, [capsuleId])

  if (!capsule) {
    return null
  }

  const unlockDate = new Date(capsule.unlockDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-6 bg-card p-8 md:p-12 rounded-2xl shadow-lg border border-border">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-accent">
          <svg className="w-10 h-10 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-balance text-primary">Your capsule is sealed</h2>

        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          Your message has been locked away safely. It will be ready to open on{" "}
          <strong className="text-foreground">{unlockDate}</strong>.
        </p>

        <div className="py-6 px-8 rounded-xl bg-background">
          <div className="text-5xl font-bold mb-2 text-primary">{daysUntil}</div>
          <div className="text-sm text-muted-foreground">{daysUntil === 1 ? "day" : "days"} until unlock</div>
        </div>

        <div className="space-y-3 pt-4">
          <p className="text-sm text-muted-foreground">
            We've sent a reminder to <strong>{capsule.email}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            Bookmark this page to return and unlock your message when the time comes
          </p>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={onReset} variant="outline" className="transition-all bg-transparent">
          Create another capsule
        </Button>
      </div>
    </div>
  )
}
