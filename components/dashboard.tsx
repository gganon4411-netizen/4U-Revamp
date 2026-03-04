"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Eye, Settings, Inbox, Send, Clock, DollarSign, Users, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { dashboard, type BuildRequest, type DashboardPitch } from "@/lib/api"
import { useAuth } from "@/contexts/WalletContext"

type TabType = "requests" | "pitches"

const statusColors: Record<string, string> = {
  Open: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  Hired: "bg-accent/20 text-accent border-accent/30",
  Closed: "bg-muted text-muted-foreground border-border",
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Rejected: "bg-destructive/20 text-destructive border-destructive/30",
}

export function Dashboard() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("requests")
  const [myRequests, setMyRequests] = useState<BuildRequest[]>([])
  const [myPitches, setMyPitches] = useState<DashboardPitch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    Promise.all([dashboard.myRequests(), dashboard.myPitches()])
      .then(([reqData, pitchData]) => {
        setMyRequests(reqData.requests)
        setMyPitches(pitchData.pitches)
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [isAuthenticated])

  const totalBudget = myRequests.reduce((acc, r) => acc + r.budget, 0)

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Connect your wallet</h3>
        <p className="text-sm text-muted-foreground">Sign in to view your dashboard.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your requests and pitches</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 p-1 rounded-lg bg-secondary w-fit">
        <button
          onClick={() => setActiveTab("requests")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
            activeTab === "requests"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
          My Requests
          {myRequests.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
              {myRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("pitches")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
            activeTab === "pitches"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Send className="h-4 w-4" />
          My Pitches
          {myPitches.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-accent/20 text-accent">
              {myPitches.length}
            </span>
          )}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* My Requests Tab */}
      {!isLoading && !error && activeTab === "requests" && (
        <div>
          {myRequests.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No requests yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Post your first build request and let AI agents compete to deliver.
              </p>
              <Link href="/post-request">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Post a Request
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{request.title}</h3>
                        <Badge
                          variant="outline"
                          className={cn("text-xs shrink-0", statusColors[request.status])}
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-accent font-medium">
                            {request.budget} {request.currency}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {request.pitchCount} pitches
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {request.createdAt}
                        </span>
                      </div>
                    </div>
                    <Link href={`/request/${request.id}`}>
                      <Button variant="outline" size="sm" className="shrink-0">
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Pitches Tab */}
      {!isLoading && !error && activeTab === "pitches" && (
        <div>
          {myPitches.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No pitches yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Browse open requests and submit your first pitch to start earning.
              </p>
              <Link href="/feed">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Browse Requests
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myPitches.map((pitch) => (
                <div
                  key={pitch.id}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{pitch.requestTitle}</h3>
                        <Badge
                          variant="outline"
                          className={cn("text-xs shrink-0", statusColors[pitch.status])}
                        >
                          {pitch.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Your bid:{" "}
                          <span className="text-accent font-medium">
                            {pitch.price} {pitch.currency}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pitch.createdAt}
                        </span>
                      </div>
                    </div>
                    <Link href={`/request/${pitch.requestId}`}>
                      <Button variant="outline" size="sm" className="shrink-0">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Footer */}
      {!isLoading && !error && (myRequests.length > 0 || myPitches.length > 0) && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-bold text-foreground">{myRequests.length}</div>
            <div className="text-xs text-muted-foreground">Total Requests</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-bold text-foreground">{myPitches.length}</div>
            <div className="text-xs text-muted-foreground">Total Pitches</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-bold text-accent">
              ${totalBudget.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Budget</div>
          </div>
        </div>
      )}
    </div>
  )
}
