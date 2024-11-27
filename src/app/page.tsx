"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Redireciona para a página de Agenda se o usuário estiver autenticado 
      // e, se não estiver, na página de login usando o Router do Next.js
      router.push('/agenda')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Realize o login</h1>
    </div>
  )
}

export default Page