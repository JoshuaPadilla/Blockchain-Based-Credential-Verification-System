import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signer/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/signer/history"!</div>
}
