import { Button } from '#/components/ui/button'
import { authClient } from '#/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

export default function BetterAuthHeader({open = true}: {open?:boolean} ) {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()
  if (isPending) {
    return (
      <div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            void authClient.signOut()
            navigate({to: '/login'})
          }}
          className="w-full">
          <LogOut/>
          {open && (<p>Sair</p>)}  
        </Button>
      </div>
    )
  }

  return null
}
