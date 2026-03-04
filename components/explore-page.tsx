"use client"

import { useState } from "react"
import { TrendingUp, Star, MessageSquare, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", label: "All", count: 340 },
  { id: "defi", label: "DeFi", count: 89 },
  { id: "nft", label: "NFT", count: 67 },
  { id: "dao", label: "DAO", count: 43 },
  { id: "gaming", label: "Gaming", count: 38 },
  { id: "payments", label: "Payments", count: 56 },
  { id: "analytics", label: "Analytics", count: 47 },
]

const trendingBuilds = [
  {
    id: "1",
    category: "DeFi",
    title: "Jupiter Swap Interface",
    rating: 4.8,
    reviews: 28,
    price: "~4.2 SOL",
    change: "+23%",
  },
  {
    id: "2",
    category: "NFT",
    title: "cNFT Minting Page",
    rating: 4.7,
    reviews: 19,
    price: "~2.8 SOL",
    change: "+18%",
  },
  {
    id: "3",
    category: "DAO",
    title: "DAO Voting Dashboard",
    rating: 4.9,
    reviews: 14,
    price: "~5.5 SOL",
    change: "+31%",
  },
  {
    id: "4",
    category: "Analytics",
    title: "Token Analytics Dashboard",
    rating: 4.6,
    reviews: 22,
    price: "~3.0 SOL",
    change: "+15%",
  },
  {
    id: "5",
    category: "Payments",
    title: "Solana Pay Widget",
    rating: 4.8,
    reviews: 16,
    price: "~3.5 SOL",
    change: "+20%",
  },
  {
    id: "6",
    category: "Gaming",
    title: "Play-to-Earn Leaderboard",
    rating: 4.5,
    reviews: 11,
    price: "~4.0 SOL",
    change: "+12%",
  },
]

const categoryColors: Record<string, string> = {
  DeFi: "bg-accent/20 text-accent border-accent/30",
  NFT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DAO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Gaming: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Payments: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Analytics: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
}

export function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Explore</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trending build categories and templates
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-chart-3 border-chart-3/30">
          <TrendingUp className="h-4 w-4" />
          Trending
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "gap-1.5",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-transparent"
            )}
          >
            {cat.label}
            <span className="text-xs opacity-70">{cat.count}</span>
          </Button>
        ))}
      </div>

      {/* Trending Builds Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {trendingBuilds.map((build) => (
          <div
            key={build.id}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-3">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  categoryColors[build.category] || "bg-secondary"
                )}
              >
                {build.category}
              </Badge>
              <span className="text-sm font-medium text-chart-3">
                {build.change}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-3">
              {build.title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400" />
                  {build.rating}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {build.reviews}
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-accent">
                <DollarSign className="h-3.5 w-3.5" />
                {build.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
