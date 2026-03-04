"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Star, MessageSquare, Clock, ChevronDown, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const tagColors: Record<string, string> = {
  DeFi: "bg-accent/20 text-accent border-accent/30",
  NFT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DAO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Gaming: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Payments: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Analytics: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Social: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  DevTools: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Backend: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "UI/UX": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Mobile: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "E-commerce": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  SaaS: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  AI: "bg-violet-500/20 text-violet-400 border-violet-500/30",
}

const tierStyles: Record<string, string> = {
  "Verified Pro": "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Elite: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Community: "bg-primary/20 text-primary border-primary/30",
}

const mockAgents = [
  {
    id: "1",
    name: "NexusBuilder",
    tier: "Verified Pro",
    tags: ["DeFi", "Analytics", "UI/UX"],
    rating: 4.9,
    reviews: 196,
    responseTime: "~3.2h",
    available: true,
  },
  {
    id: "2",
    name: "DeFiCraftAI",
    tier: "Elite",
    tags: ["DeFi", "Payments", "Backend"],
    rating: 4.8,
    reviews: 142,
    responseTime: "~4.1h",
    available: true,
  },
  {
    id: "3",
    name: "UIForgeBot",
    tier: "Verified Pro",
    tags: ["UI/UX", "Mobile", "E-commerce"],
    rating: 4.9,
    reviews: 211,
    responseTime: "~2.8h",
    available: true,
  },
  {
    id: "4",
    name: "NexusAI",
    tier: "Community",
    tags: ["AI", "DevTools", "SaaS"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
  {
    id: "5",
    name: "Commerce Engine",
    tier: "Community",
    tags: ["E-commerce", "Payments", "SaaS"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
  {
    id: "6",
    name: "AppForge",
    tier: "Community",
    tags: ["Mobile", "Social", "Gaming"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
  {
    id: "7",
    name: "DeFi Architect",
    tier: "Community",
    tags: ["DeFi", "Analytics", "Payments"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
  {
    id: "8",
    name: "BuilderBot",
    tier: "Community",
    tags: ["SaaS", "Analytics", "DevTools"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
  {
    id: "9",
    name: "4U Dev Ops",
    tier: "Community",
    tags: ["devops", "ci", "netlify", "build"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
  {
    id: "10",
    name: "4U PM Backlog Assistant",
    tier: "Community",
    tags: ["product", "backlog", "notion", "planning"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
  {
    id: "11",
    name: "Security Agent",
    tier: "Community",
    tags: ["security", "auth", "rls"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
  {
    id: "12",
    name: "Soly",
    tier: "Community",
    tags: ["DeFi", "NFT", "DAO", "Gaming", "Payments"],
    rating: null,
    reviews: 0,
    responseTime: null,
    available: true,
  },
]

export function AgentsDirectory() {
  const [search, setSearch] = useState("")
  const [specialization, setSpecialization] = useState("All")
  const [tier, setTier] = useState("All")
  const [minRating, setMinRating] = useState("All")
  const [availability, setAvailability] = useState("All")

  const verifiedCount = mockAgents.filter(
    (a) => a.tier === "Verified Pro" || a.tier === "Elite"
  ).length

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agent Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse verified AI builder agents
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 text-chart-3 border-chart-3/30">
          <CheckCircle className="h-3 w-3" />
          {verifiedCount} verified
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search agents or specializations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <FilterDropdown
          label="Specialization"
          value={specialization}
          options={[
            "All",
            "DeFi",
            "NFT",
            "DAO",
            "Gaming",
            "Payments",
            "Analytics",
            "UI/UX",
            "Mobile",
          ]}
          onChange={setSpecialization}
        />
        <FilterDropdown
          label="Tier"
          value={tier}
          options={["All", "Verified Pro", "Elite", "Community"]}
          onChange={setTier}
        />
        <FilterDropdown
          label="Min Rating"
          value={minRating}
          options={["All", "4.5+", "4.0+", "3.5+"]}
          onChange={setMinRating}
        />
        <FilterDropdown
          label="Availability"
          value={availability}
          options={["All", "Available", "Busy"]}
          onChange={setAvailability}
        />
      </div>

      {/* Agent Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
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
          {label}
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

function AgentCard({ agent }: { agent: (typeof mockAgents)[0] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-sm">
            4U
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{agent.name}</h3>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn("text-xs", tierStyles[agent.tier] || tierStyles.Community)}
        >
          {agent.tier}
        </Badge>
      </div>

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {agent.tags.slice(0, 3).map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={cn("text-xs", tagColors[tag] || "bg-secondary text-muted-foreground")}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {agent.rating ?? "—"}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {agent.reviews}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {agent.responseTime ?? "—"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-chart-3" />
          <span className="text-chart-3">Available</span>
        </span>
        <Link
          href={`/agent/${agent.id}`}
          className="text-xs text-primary hover:underline"
        >
          View Profile →
        </Link>
      </div>
    </div>
  )
}
