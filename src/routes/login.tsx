import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { authClient } from '#/lib/auth-client'
import z from 'zod'
import { getCurrentSession } from '#/server/functions/auth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/login')({
    validateSearch: z.object({redirect: z.string().optional()}),
    beforeLoad: async () => {
      const session = await getCurrentSession()
      if(session && session.isActive) throw redirect({to: "/"})
    },    
    component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    setError(null)
    setLoading(true)

    try {
      if (isRegistering) {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
        })

        if (result.error) {
          setError(result.error.message ?? 'Erro ao criar conta')
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })

        if (result.error) {
          setError(result.error.message ?? 'Email ou password inválidos')
          return
        }
      }
      const redirectTo = search.redirect ?? "/"
      await navigate({ to: redirectTo })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Ocorreu um erro inesperado',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-dvw h-dvh flex justify-center items-center bg-primary/50">
            <Card className='w-[50%] max-w-100'>
                <img alt="DB Logo" className='h-40 w-40 mx-auto' src={"/DB_Logo_Round.png"}/>
                <CardHeader>
                    <CardTitle>{isRegistering ? 'Criar conta' : 'Entrar'}</CardTitle>
                    <CardDescription>
                      { isRegistering
                        ? 'Cria uma conta para acederes à plataforma de suporte de terapeutas.'
                        : 'Entra com a tua conta.'
                      }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistering && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nome
                        </label>

                        <input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          required
                          className="w-full h-10 border rounded px-3"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>

                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="w-full h-10 border rounded px-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Password
                      </label>

                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        minLength={8}
                        className="w-full h-10 border rounded px-3"
                      />
                    </div>

                    {error && (
                      <div className="text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className='w-full'
                      disabled={loading}
                    >
                      {loading
                        ? 'A processar...'
                        : isRegistering
                          ? 'Criar conta'
                          : 'Entrar'}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className='flex gap-0.5'>
                    <p>{isRegistering ? "Já tens conta? Entra ": "Ainda não tens conta? Cria uma "}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering((value) => !value)
                        setError(null)
                      }}
                      className="underline cursor-pointer"
                    >
                      aqui
                    </button>
                </CardFooter>
            </Card> 
    
    
      </div>
    // <main className="min-h-screen flex items-center justify-center p-6">
    //   <div className="w-full max-w-md space-y-6">
    //     <div>
    //       <h1 className="text-2xl font-semibold">
    //         {isRegistering ? 'Criar conta' : 'Entrar'}
    //       </h1>

    //       <p className="text-sm text-neutral-500 mt-2">
    //         {isRegistering
    //           ? 'Cria uma conta para testar o Better Auth.'
    //           : 'Entra com a tua conta.'}
    //       </p>
    //     </div>

    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       {isRegistering && (
    //         <div>
    //           <label className="block text-sm font-medium mb-1">
    //             Nome
    //           </label>

    //           <input
    //             value={name}
    //             onChange={(event) => setName(event.target.value)}
    //             required
    //             className="w-full h-10 border rounded px-3"
    //           />
    //         </div>
    //       )}

    //       <div>
    //         <label className="block text-sm font-medium mb-1">
    //           Email
    //         </label>

    //         <input
    //           type="email"
    //           value={email}
    //           onChange={(event) => setEmail(event.target.value)}
    //           required
    //           className="w-full h-10 border rounded px-3"
    //         />
    //       </div>

    //       <div>
    //         <label className="block text-sm font-medium mb-1">
    //           Password
    //         </label>

    //         <input
    //           type="password"
    //           value={password}
    //           onChange={(event) => setPassword(event.target.value)}
    //           required
    //           minLength={8}
    //           className="w-full h-10 border rounded px-3"
    //         />
    //       </div>

    //       {error && (
    //         <div className="text-sm text-red-600">
    //           {error}
    //         </div>
    //       )}

    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className="w-full h-10 bg-black text-white rounded disabled:opacity-50"
    //       >
    //         {loading
    //           ? 'A processar...'
    //           : isRegistering
    //             ? 'Criar conta'
    //             : 'Entrar'}
    //       </button>
    //     </form>

    //     <button
    //       type="button"
    //       onClick={() => {
    //         setIsRegistering((value) => !value)
    //         setError(null)
    //       }}
    //       className="text-sm underline"
    //     >
    //       {isRegistering
    //         ? 'Já tenho uma conta'
    //         : 'Ainda não tenho uma conta'}
    //     </button>
    //   </div>
    // </main>
  )
}