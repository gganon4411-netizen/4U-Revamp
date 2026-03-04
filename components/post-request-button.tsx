"use client"

import Link from "next/link"
import { FileEdit } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PostRequestButton() {
  return (
    <Link href="/post-request">
      <Button className="fixed bottom-6 right-6 z-50 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
        <FileEdit className="h-4 w-4" />
        Post Request
      </Button>
    </Link>
  )
}
