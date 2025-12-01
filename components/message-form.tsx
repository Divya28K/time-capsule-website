"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface MessageFormProps {
  onSealed: (id: string) => void
  onUnlock: () => void
}

export function MessageForm({ onSealed, onUnlock }: MessageFormProps) {
  const [message, setMessage] = useState("")
  const [unlockDate, setUnlockDate] = useState("")
  const [email, setEmail] = useState("")
  const [isSealing, setIsSealing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !unlockDate || !email.trim()) {
      return
    }

    setIsSealing(true)

    // Create capsule ID
    const capsuleId = `capsule-${Date.now()}`

    // Store in localStorage
    const capsules = JSON.parse(localStorage.getItem("timeCapsules") || "[]")
    capsules.push({
      id: capsuleId,
      message,
      unlockDate,
      email,
      createdAt: new Date().toISOString(),
      unlocked: false,
    })
    localStorage.setItem("timeCapsules", JSON.stringify(capsules))

    // Simulate sealing animation
    setTimeout(() => {
      onSealed(capsuleId)
      setIsSealing(false)
    }, 1500)
  }

  const today = new Date().toISOString().split("T")[0]
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 10)
  const max = maxDate.toISOString().split("T")[0]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-balance text-primary">Time Capsule</h1>
        <p className="text-lg md:text-xl text-pretty text-muted-foreground">Write a message to your future self</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border">
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-foreground">
            Your Message
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Dear future me..."
            className="min-h-[200px] resize-none text-base leading-relaxed"
            required
            disabled={isSealing}
          />
          <p className="text-sm text-muted-foreground">{message.length} characters</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Your Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isSealing}
          />
          <p className="text-xs text-muted-foreground">
            We'll send you a reminder when it's time to unlock your message
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-foreground">
            Open on
          </label>
          <Input
            id="date"
            type="date"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            min={today}
            max={max}
            required
            disabled={isSealing}
          />
          <p className="text-xs text-muted-foreground">Choose a date in the future (up to 10 years)</p>
        </div>

        <Button
          type="submit"
          className="w-full text-base py-6 font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isSealing || !message.trim() || !unlockDate || !email.trim()}
        >
          {isSealing ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sealing your capsule...
            </span>
          ) : (
            "Seal Time Capsule"
          )}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={onUnlock}
          className="text-sm underline hover:no-underline transition-all text-muted-foreground"
        >
          Have a capsule to unlock?
        </button>
      </div>
    </div>
  )
}
