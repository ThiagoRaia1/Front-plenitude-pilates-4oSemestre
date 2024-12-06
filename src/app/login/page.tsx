"use client"

import { useAuth } from "@/context/auth"
import { useEffect, useState } from "react"
import { getDadosUsuarioLogado, IUsuario, login as loginApi } from "./api"
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const { isAuthenticated, login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Redireciona para a página de Agenda se o usuário estiver autenticado 
      router.push('/agenda')
    }
  }, [router])

  const handleLogin = async () => {
    try {
      const { token } = await loginApi({ email, password });
      if (!token) {
        throw new Error("Token não encontrado");
      }

      localStorage.setItem("token", token);

      const usuario: IUsuario = await getDadosUsuarioLogado({ email, password });

      login(usuario, token); // Atualiza o contexto com os dados do usuário e o token
      router.push('/agenda');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <></>
      ) : (
        <section>
          <div className="grid md:h-screen md:grid-cols-2">
            <div className="flex flex-col items-center justify-center  " style={{ backgroundImage: "url('logo.jpg')" }}>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
              <div className="max-w-lg px-5 py-16 text-center md:px-10 md:py-24 lg:py-32">
                <div className="relative">
                  <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f190b7e37f878_EnvelopeSimple.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
                  <input
                    type="email"
                    className="mt-20 mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-20 py-6 pl-14 text-sm text-[#333333] rounded-full"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative mb-4">
                  <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
                  <input
                    type="password"
                    className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-20 py-6 pl-14 text-sm text-[#333333] rounded-full"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button onClick={handleLogin}>
                  <div className="flex items-center justify-center bg-[#276ef1] px-[120px] py-4 text-center font-semibold text-white rounded-full">
                    <p className="mr-6 font-bold">Login</p>
                    <svg className="h-4 w-4 flex-none" fill="currentColor" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                      <title>Arrow Right</title>
                      <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Page