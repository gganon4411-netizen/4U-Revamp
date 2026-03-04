"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUp, Clock, Users, Filter, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { requests, type BuildRequest } from "@/lib/api"

const tagColors: Record<string, string> = {
  DeFi: "bg-accent/20 text-accent border-accent/30",
  NFT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DAO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Gaming: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Payments: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Analytics: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Social: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  DevTools: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

export function RequestFeed() {
  const [category, setCategory] = useState("All")
  const [budget, setBudget] = useState("Any")
  const [recency, setRecency] = useState("All time")
  const [status, setStatus] = useState("All")
  const [feedRequests, setFeedRequests] = useState<BuildRequest[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    requests
      .list({ category, status, budget, recency })
      .then((data) => {
        setFeedRequests(Array.isArray(data.requests) ? data.requests : [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [category, status, budget, recency])

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Request Feed</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-chart-3/20 px-2.5 py-0.5 text-xs font-medium text-chart-3">
              <span className="h-1.5 w-1.5 rounded-full bg-chart-3" />
              {total} Live
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse open requests from builders worldwide
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-4 w-4" />
        </Button>
        <FilterDropdown
          label="Category"
          value={category}
          options={["All", "DeFi", "NFT", "DAO", "Gaming", "Payments", "Analytics", "DevTools", "Social", "Other"]}
          onChange={setCategory}
        />
        <FilterDropdown
          label="Budget"
          value={budget}
          options={["Any", "< $100", "$100-500", "$500-1000", "> $1000"]}
          onChange={setBudget}
        />
        <FilterDropdown
          label="Recency"
          value={recency}
          options={["All time", "Last 24h", "Last week", "Last month"]}
          onChange={setRecency}
        />
        <FilterDropdown
          label="Status"
          value={status}
          options={["All", "Open", "In Progress", "Completed"]}
          onChange={setStatus}
        />
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          Failed to load requests: {error}
        </div>
      )}

      {!isLoading && !error && feedRequests.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
          No requests found. Be the first to post one!
        </div>
      )}

      {/* Request List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {feedRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          {label}: {value}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onChange(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function RequestCard({ request }: { request: BuildRequest }) {
  const r = request
  const tags: string[] = Array.isArray(r.categories) ? r.categories
    : Array.isArray(r.tags) ? r.tags
    : []
  const upvotes = r.upvotes ?? 0
  const pitchCount = typeof r.pitches === "number" ? r.pitches : (r.pitchCount ?? 0)
  const poster = r.author
    ? r.author.length > 12 ? `${r.author.slice(0, 4)}...${r.author.slice(-4)}` : r.author
    : r.poster ?? "anon"
  const deadline = r.timeline ?? r.deadline ?? "—"
  const status = r.status ?? "Open"
  const budget = r.budget ?? 0
  const currency = r.currency ?? "USDC"
  const createdAt = r.createdAt ? new Date(Number(r.createdAt)).toLocaleDateString() : ""

  return (
    <Link href={`/request/${request.id}`}>
      <div className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        {/* Upvote Section */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
            <ArrowUp className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            {upvotes}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {request.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {request.description}
              </p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={cn("text-xs", tagColors[tag] || tagColors.Other)}
                  >
                    {tag}
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className="bg-chart-3/20 text-chart-3 border-chart-3/30 text-xs"
                >
                  {status}
                </Badge>
              </div>

              {/* Meta */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>by {poster}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {deadline}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {pitchCount} pitches
                </span>
                <span>{createdAt}</span>
              </div>
            </div>

            {/* Budget */}
            <div className="flex-shrink-0 text-right">
              <div className="text-2xl font-bold text-accent">
                ${budget}{" "}
                <span className="text-sm font-medium">{currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
