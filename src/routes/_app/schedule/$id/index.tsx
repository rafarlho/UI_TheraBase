import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/schedule/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/schedule/$id/"!</div>
}
