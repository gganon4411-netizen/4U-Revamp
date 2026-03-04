import { AppLayout } from "@/components/app-layout"
import { RequestDetail } from "@/components/request-detail"

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <AppLayout>
      <RequestDetail requestId={id} />
    </AppLayout>
  )
}
