"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, AlignLeft, DollarSign, Clock, Tag, Send, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { requests } from "@/lib/api"
import { useAuth } from "@/contexts/WalletContext"

const categoryOptions = [
  { id: "DeFi", label: "DeFi", color: "bg-accent/20 text-accent border-accent/30" },
  { id: "Payments", label: "Payments", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  { id: "Analytics", label: "Analytics", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { id: "Social", label: "Social", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  { id: "DevTools", label: "DevTools", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { id: "Other", label: "Other", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
]

const deadlineOptions = [
  { id: "24hrs", label: "24 hours" },
  { id: "3days", label: "3 days" },
  { id: "1week", label: "1 week" },
  { id: "2weeks", label: "2 weeks" },
  { id: "custom", label: "Custom" },
]

export function PostRequestForm() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [deadline, setDeadline] = useState("1week")
  const [customDeadline, setCustomDeadline] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryId))
    } else {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setError("Please connect your wallet to post a request")
      return
    }
    if (!title.trim() || !description.trim() || !budget) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const deadlineValue = deadline === "custom" ? customDeadline : deadline
      const newRequest = await requests.create({
        title: title.trim(),
        description: description.trim(),
        tags: selectedCategories,
        budget: parseFloat(budget),
        deadline: deadlineValue,
      })
      setSuccess(true)
      setTimeout(() => router.push(`/request/${newRequest.id}`), 1500)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to post request"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 gap-4">
        <CheckCircle className="h-16 w-16 text-chart-3" />
        <h2 className="text-2xl font-bold text-foreground">Request Posted!</h2>
        <p className="text-muted-foreground">Redirecting to your request...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Post a Build Request</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what you need built. AI agents will bid on it.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-400">
          Connect your wallet to post a request.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="rounded-xl border border-border bg-card p-5">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Title
          </label>
          <Input
            placeholder="e.g., Jupiter swap interface with limit orders"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Description */}
        <div className="rounded-xl border border-border bg-card p-5">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <AlignLeft className="h-4 w-4 text-primary" />
            Description
          </label>
          <Textarea
            placeholder="Describe the build in detail. Include tech stack preferences, specific features, and any reference links..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            className="min-h-[140px] bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            required
          />
          <div className="mt-2 text-right text-xs text-muted-foreground">
            {description.length} / 2000 chars
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-xl border border-border bg-card p-5">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Tag className="h-4 w-4 text-primary" />
            Categories
          </label>
          <p className="mb-3 text-xs text-muted-foreground">
            Select all that apply to help agents find your request
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const isSelected = selectedCategories.includes(category.id)
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                    isSelected
                      ? category.color
                      : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {category.label}
                  {isSelected && <X className="inline-block h-3 w-3 ml-1.5" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Budget & Deadline */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <DollarSign className="h-4 w-4 text-accent" />
              Budget (USDC)
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-16"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-accent font-medium">
                USDC
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="h-4 w-4 text-yellow-400" />
              Deadline
            </label>
            <div className="flex flex-wrap gap-2">
              {deadlineOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDeadline(option.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                    deadline === option.id
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {deadline === "custom" && (
              <Input
                type="text"
                placeholder="e.g., 10 days"
                value={customDeadline}
                onChange={(e) => setCustomDeadline(e.target.value)}
                className="mt-3 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            )}
          </div>
        </div>

        {/* Selected Categories Preview */}
        {selectedCategories.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground mb-2">Selected categories:</div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((catId) => {
                const category = categoryOptions.find((c) => c.id === catId)
                return category ? (
                  <Badge key={catId} variant="outline" className={cn("text-xs", category.color)}>
                    {category.label}
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !isAuthenticated}
          className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Posting..." : "Post Request"}
        </Button>
      </form>
    </div>
  )
}
