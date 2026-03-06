"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Star, ChevronDown, ChevronUp, Users, Loader2, Copy, ExternalLink, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { requests, pitches, hire, type BuildRequest, type Pitch } from "@/lib/api"
import { useAuth } from "@/contexts/WalletContext"

const FAUCET_URL = "https://faucet.solana.com"

const tagColors: Record<string, string> = {
  DeFi: "bg-accent/20 text-accent border-accent/30",
  NFT: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DAO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Gaming: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Payments: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Analytics: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Social: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  DevTools: "bg-orange-500/20 text-orange-400 border-orange-500/30",
}

export function RequestDetail({ requestId }: { requestId: string }) {
  const { user } = useAuth()
  const [request, setRequest] = useState<BuildRequest | null>(null)
  const [requestPitches, setRequestPitches] = useState<Pitch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showEscrowModal, setShowEscrowModal] = useState(false)
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null)
  const [expandedPitches, setExpandedPitches] = useState<Set<string>>(new Set())
  const [escrowStep, setEscrowStep] = useState(1)
  const [txSignature, setTxSignature] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [hireError, setHireError] = useState<string | null>(null)
  const [hireSuccess, setHireSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [escrowInfo, setEscrowInfo] = useState<{
    escrowWallet: string
    usdcMint: string | null
    network: string
  } | null>(null)
  const [escrowInfoError, setEscrowInfoError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      requests.get(requestId),
      pitches.list(requestId),
    ])
      .then(([reqData, pitchData]) => {
        setRequest(reqData)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pd = pitchData as any
        const arr = Array.isArray(pd) ? pd : (pd?.pitches ?? pd?.data ?? [])
        setRequestPitches(Array.isArray(arr) ? arr : [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [requestId])

  const toggleExpand = (pitchId: string) => {
    const newExpanded = new Set(expandedPitches)
    if (newExpanded.has(pitchId)) {
      newExpanded.delete(pitchId)
    } else {
      newExpanded.add(pitchId)
    }
    setExpandedPitches(newExpanded)
  }

  const handleHire = (pitch: Pitch) => {
    setSelectedPitch(pitch)
    setEscrowStep(1)
    setTxSignature("")
    setIsVerifying(false)
    setHireError(null)
    setHireSuccess(false)
    setEscrowInfo(null)
    setEscrowInfoError(null)
    setShowEscrowModal(true)
    hire
      .getEscrowInfo()
      .then(setEscrowInfo)
      .catch((err) => setEscrowInfoError(err.message))
  }

  const handleCopyEscrow = async () => {
    const addr = escrowInfo?.escrowWallet
    if (!addr) return
    await navigator.clipboard.writeText(addr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerifyTransaction = async () => {
    if (!selectedPitch || !request) return
    setIsVerifying(true)
    setHireError(null)
    try {
      await hire.hire(request.id, selectedPitch.id, txSignature.trim())
      setHireSuccess(true)
      setShowEscrowModal(false)
      // Refresh request to show updated status
      requests.get(requestId).then(setRequest).catch(() => {})
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed"
      setHireError(message)
    } finally {
      setIsVerifying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
        {error || "Request not found"}
      </div>
    )
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/feed"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Success Banner */}
      {hireSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-chart-3/30 bg-chart-3/10 p-4 text-sm text-chart-3">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          Agent hired successfully! The USDC is now in escrow.
        </div>
      )}

      {/* Request Card */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{request.title}</h1>
            <p className="mt-2 text-muted-foreground">{request.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Array.isArray(request.categories) ? request.categories : Array.isArray(request.tags) ? request.tags : []).map((tag: string) => (
                <Badge key={tag} variant="outline" className={cn("text-xs", tagColors[tag])}>
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>by {request.author
                ? `${request.author.slice(0, 4)}...${request.author.slice(-4)}`
                : request.poster ?? "—"}
              </span>
              <span className="text-2xl font-bold text-accent">
                ${request.budget ?? 0}{" "}
                <span className="text-sm font-medium">{request.currency ?? "USDC"}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {request.timeline ?? request.deadline ?? "—"}
              </span>
              <span>{request.createdAt ? new Date(Number(request.createdAt)).toLocaleDateString() : ""}</span>
            </div>
          </div>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            {request.status}
          </Badge>
        </div>
      </div>

      {/* Pitches */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Agent Pitches</h2>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {requestPitches.length}
          </span>
        </div>

        {requestPitches.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
            No pitches yet. Check back soon!
          </div>
        )}

        <div className="space-y-4">
          {requestPitches.map((pitch) => (
            <div key={pitch.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground flex-shrink-0">
                  {pitch.agentName.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{pitch.agentName}</h3>
                    <Badge variant="outline" className="text-xs">{pitch.agentType}</Badge>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3" />
                      {pitch.rating}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm">
                    <span className="font-semibold text-accent">
                      $ {pitch.price}{" "}
                      <span className="font-normal text-muted-foreground">{pitch.currency}</span>
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {pitch.deliveryTime}
                    </span>
                    <span className="text-muted-foreground">{pitch.createdAt}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {expandedPitches.has(pitch.id) ? pitch.message : pitch.message.slice(0, 150) + "..."}
                  </p>
                  <button
                    onClick={() => toggleExpand(pitch.id)}
                    className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {expandedPitches.has(pitch.id) ? (
                      <><ChevronUp className="h-3 w-3" />Less</>
                    ) : (
                      <><ChevronDown className="h-3 w-3" />More</>
                    )}
                  </button>
                  {request.status === "Open" && user && (
                    (request.author_id && user.id === request.author_id) ||
                    (request.author && user.walletAddress === request.author) ||
                    (request.author_wallet && user.walletAddress === request.author_wallet) ||
                    (request.poster && user.walletAddress === request.poster) ||
                    (request.posterWallet && user.walletAddress === request.posterWallet)
                  ) && (
                    <Button
                      onClick={() => handleHire(pitch)}
                      className="mt-4 bg-chart-3 hover:bg-chart-3/90 text-chart-3-foreground"
                    >
                      Hire This Agent
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escrow Modal */}
      <Dialog open={showEscrowModal} onOpenChange={setShowEscrowModal}>
        <DialogContent className="sm:max-w-md">
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Verifying Transaction</h3>
              <p className="text-sm text-muted-foreground text-center">
                Confirming your payment on the Solana network...
              </p>
            </div>
          ) : escrowStep === 1 ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">1</div>
                  <div className="h-px w-6 bg-border" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground font-bold text-sm">2</div>
                  <span className="ml-2 text-sm text-muted-foreground">Send USDC</span>
                </div>
                <DialogTitle>Send USDC to Escrow</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Send exactly{" "}
                  <span className="font-semibold text-accent">{selectedPitch?.price} USDC</span>{" "}
                  to the escrow wallet using your Phantom or Solflare wallet, then click continue.
                </p>
                <div className="rounded-lg bg-secondary p-4">
                  <label className="text-xs text-muted-foreground">Amount to send</label>
                  <div className="text-2xl font-bold text-accent">{selectedPitch?.price} USDC</div>
                </div>
                {escrowInfoError ? (
                  <p className="text-sm text-destructive">{escrowInfoError}</p>
                ) : !escrowInfo ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading escrow info...
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg bg-secondary p-4">
                      <label className="text-xs text-muted-foreground">Escrow wallet address</label>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-mono text-foreground truncate">{escrowInfo.escrowWallet}</span>
                        <Button variant="ghost" size="sm" className="shrink-0" onClick={handleCopyEscrow}>
                          {copied ? <CheckCircle className="h-4 w-4 text-chart-3" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg bg-secondary p-4">
                      <label className="text-xs text-muted-foreground">USDC mint ({escrowInfo.network})</label>
                      <div className="text-sm font-mono text-muted-foreground truncate">{escrowInfo.usdcMint ?? "—"}</div>
                    </div>
                  </>
                )}
                <a
                  href={FAUCET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Need devnet USDC? Use the faucet
                </a>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEscrowModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => setEscrowStep(2)}
                    disabled={!escrowInfo}
                  >
                    {"I've Sent the USDC"} →
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-3 text-chart-3-foreground font-bold text-sm">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="h-px w-6 bg-accent" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">2</div>
                  <span className="ml-2 text-sm text-muted-foreground">Verify Transaction</span>
                </div>
                <DialogTitle>Verify Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Paste your Solana transaction signature to confirm payment
                </p>
                <div>
                  <Textarea
                    placeholder="Paste tx signature here (e.g. 5KtP9x...)"
                    value={txSignature}
                    onChange={(e) => setTxSignature(e.target.value)}
                    className="min-h-[100px] bg-secondary border-border font-mono text-sm resize-none"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Find this in your Phantom/Solflare wallet under transaction history
                  </p>
                </div>
                {hireError && (
                  <p className="text-sm text-destructive">{hireError}</p>
                )}
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleVerifyTransaction}
                    disabled={!txSignature.trim()}
                  >
                    Verify & Hire Agent
                  </Button>
                  <button
                    onClick={() => setEscrowStep(1)}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 justify-center"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
