"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Rss,
  Search,
  FileEdit,
  Bot,
  Compass,
  LayoutDashboard,
  Bell,
  User,
  Code,
  LogOut,
  ChevronLeft,
  Menu,
  Wallet,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAuth } from "@/contexts/WalletContext"

const navItems = [
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/search", label: "Search", icon: Search },
  { href: "/post-request", label: "Post Request", icon: FileEdit },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/developer", label: "Developer", icon: Code },
]

function truncateWallet(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

function WalletSection({ collapsed = false }: { collapsed?: boolean }) {
  const { wallets, select, publicKey, connected } = useWallet()
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  const detectedWallets = wallets.filter(
    (w) => w.readyState === "Installed" || w.readyState === "Loadable"
  )

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : publicKey
    ? publicKey.toBase58().slice(0, 2).toUpperCase()
    : "??"

  const displayAddress = publicKey ? truncateWallet(publicKey.toBase58()) : null

  if (!connected) {
    return (
      <div className="border-t border-sidebar-border p-4">
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
              disabled={isConnecting}
            >
              <Wallet className="h-4 w-4" />
              {!collapsed && (isConnecting ? "Connecting..." : "Connect Wallet")}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-sidebar border-sidebar-border rounded-t-xl pb-8">
            <SheetHeader>
              <SheetTitle className="text-sidebar-foreground">Select Wallet</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-2">
              {detectedWallets.length === 0 ? (
                <div className="rounded-lg border border-border bg-secondary p-4 text-center">
                  <p className="text-sm font-medium text-foreground mb-1">No wallets found</p>
                  <p className="text-xs text-muted-foreground">
                    Install Phantom or Solflare browser extension, then refresh.
                  </p>
                </div>
              ) : (
                detectedWallets.map((w) => (
                  <Button
                    key={w.adapter.name}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 border-border hover:border-primary/50 hover:bg-primary/5"
                    disabled={isConnecting}
                    onClick={async () => {
                      setConnectError(null)
                      setIsConnecting(true)
                      setPickerOpen(false)
                      try {
                        select(w.adapter.name)
                        // Call connect directly on the adapter while still in the
                        // click handler — wallet extensions require a user gesture
                        await w.adapter.connect()
                      } catch (e: unknown) {
                        const msg = e instanceof Error ? e.message : "Connection failed"
                        setConnectError(msg)
                        console.error(e)
                      } finally {
                        setIsConnecting(false)
                      }
                    }}
                  >
                    {w.adapter.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={w.adapter.icon} alt={w.adapter.name} className="h-5 w-5 rounded" />
                    )}
                    <span className="text-sm font-medium">{w.adapter.name}</span>
                  </Button>
                ))
              )}
              {connectError && (
                <p className="text-xs text-destructive text-center pt-1">{connectError}</p>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  if (connected && !isAuthenticated) {
    return (
      <div className="border-t border-sidebar-border p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-medium text-foreground flex-shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <p className="text-xs text-muted-foreground truncate">{displayAddress}</p>
          )}
        </div>
        {!collapsed && (
          <Button
            onClick={login}
            disabled={isLoading}
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-medium text-foreground flex-shrink-0">
          {initials}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {displayAddress}
            </p>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3 w-3" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            4U
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">4U</span>
          )}
        </Link>
        {!collapsed && (
          <button className="ml-auto text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Wallet / User Section */}
      <WalletSection collapsed={collapsed} />
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:border-r lg:border-sidebar-border">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 left-4 z-50"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0 bg-sidebar">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}
