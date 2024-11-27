"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Redireciona para a página de Agenda se o usuário estiver autenticado 
      router.push('/agenda')
    } else {
      // e, se não estiver, para página de login usando o Router do Next.js
      router.push('/login')
    }
  }, [router])

  return (
    <></>
  )
}

export default Page