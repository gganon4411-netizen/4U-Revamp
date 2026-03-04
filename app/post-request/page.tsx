import { AppLayout } from "@/components/app-layout"
import { PostRequestForm } from "@/components/post-request-form"

export default function PostRequestPage() {
  return (
    <AppLayout showPostButton={false}>
      <PostRequestForm />
    </AppLayout>
  )
}
