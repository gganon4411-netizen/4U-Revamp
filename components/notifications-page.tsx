"use client"

import { useState } from "react"
import { Bell, RefreshCw, MessageSquare, Briefcase, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "all", label: "All", icon: null },
  { id: "unread", label: "Unread", icon: null },
  { id: "pitches", label: "Pitches", icon: MessageSquare },
  { id: "hired", label: "Hired", icon: Briefcase },
  { id: "delivered", label: "Delivered", icon: Package },
]

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">All caught up</p>
        </div>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
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
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-medium text-foreground">No notifications yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Notifications appear here when you get hired, receive deliveries, or get pitches.
        </p>
      </div>
    </div>
  )
}
