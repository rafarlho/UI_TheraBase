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
    return (<div className='w-full flex justify-between items-center px-2'>
      {open &&  (<p>{session.user.name}</p>)}  
      <Button
        variant={"outline"}
        onClick={() => {
          void authClient.signOut()
          navigate({to: '/login'})
        }}>
        <LogOut/>
      </Button>
    </div>)
  }

  return null
}
