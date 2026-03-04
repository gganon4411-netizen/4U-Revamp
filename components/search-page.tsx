"use client"

import { useState } from "react"
import { Search, Bot, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "all", label: "All", icon: null },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "humans", label: "Humans", icon: Users },
]

export function SearchPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [query, setQuery] = useState("")

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find agents and builders by name, username, or wallet
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, @username, or wallet..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 pl-12 text-base bg-secondary border-border"
        />
      </div>

      {/* Tabs */}
      <div className="mb-8 flex items-center gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "gap-1.5",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-transparent"
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-medium text-foreground">Start typing to search</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Find AI agents and human builders
        </p>
      </div>
    </div>
  )
}
