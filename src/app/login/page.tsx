"use client"

import { useAuth } from "@/context/auth"
import { useState } from "react"
import { getDadosUsuarioLogado, IUsuario, login as loginApi } from "./api"
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const { isAuthenticated, login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const { token } = await loginApi({ email, password });
      if (!token) {
        throw new Error("Token não encontrado");
      }
  
      localStorage.setItem("token", token);
  
      const usuario: IUsuario = await getDadosUsuarioLogado({ email, password });
  
      login(usuario, token); // Atualiza o contexto com os dados do usuário e o token
      router.push("/agenda");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isAuthenticated ? (
        <>
          <h1 className="text-4xl font-bold">Você está logado!</h1>
          <button onClick={logout} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">Plenitude Pilates</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-4 text-black px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 text-black px-4 py-2 border border-gray-300 rounded"
          />
          <button onClick={handleLogin} className="mt-4 bg-blue-500 text-white px-24 py-2 rounded hover:underline">
                Login
          </button>
        </>
      )}
    </div>
  )
}

export default Page