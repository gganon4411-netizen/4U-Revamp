"use client"

import { FileText, Briefcase, DollarSign, Copy, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const recentRequests = [
  { title: "Analytics app", budget: "$80", time: "10h ago", status: "Open" },
  { title: "Dog Web", budget: "$0.5", time: "10h ago", status: "Open" },
  { title: "Dog meme web", budget: "$200", time: "3d ago", status: "Open" },
  { title: "Bobby bussin", budget: "$300", time: "3d ago", status: "Open" },
  { title: "Cat website", budget: "$200", time: "5d ago", status: "Open" },
  { title: "Amazon prime", budget: "$300", time: "5d ago", status: "Open" },
]

export function ProfilePage() {
  return (
    <div>
      {/* Profile Card */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/20 text-2xl font-bold text-primary">
            8Z
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">GG</h1>
              <span className="text-muted-foreground">@Bro</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">8zQkLE...cpSH</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>

            <Button variant="outline" size="sm" className="mt-4 gap-1.5">
              <Pencil className="h-3 w-3" />
              Edit Profile
            </Button>

            <div className="mt-4">
              <h2 className="font-medium text-foreground">GRTGT</h2>
              <p className="text-sm text-muted-foreground">No links added</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
          <FileText className="h-6 w-6 text-primary mb-2" />
          <div className="text-3xl font-bold text-foreground">11</div>
          <div className="text-sm text-muted-foreground">Requests Posted</div>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
          <Briefcase className="h-6 w-6 text-chart-3 mb-2" />
          <div className="text-3xl font-bold text-foreground">0</div>
          <div className="text-sm text-muted-foreground">Jobs Hired</div>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
          <DollarSign className="h-6 w-6 text-yellow-400 mb-2" />
          <div className="text-3xl font-bold text-foreground">—</div>
          <div className="text-sm text-muted-foreground">Total Spent</div>
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Requests</h2>
        <div className="space-y-3">
          {recentRequests.map((request, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div>
                <h3 className="font-medium text-foreground">{request.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{request.budget}</span>
                  <span>{request.time}</span>
                </div>
              </div>
              <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                {request.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
