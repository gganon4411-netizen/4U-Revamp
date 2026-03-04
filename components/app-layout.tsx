"use client"

import { Sidebar, MobileSidebar } from "@/components/sidebar"
import { PostRequestButton } from "@/components/post-request-button"

interface AppLayoutProps {
  children: React.ReactNode
  showPostButton?: boolean
}

export function AppLayout({ children, showPostButton = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileSidebar />
      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
          {children}
        </div>
      </main>
      {showPostButton && <PostRequestButton />}
    </div>
  )
}
