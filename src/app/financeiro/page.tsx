"use client"
import { useState } from "react";
import { callCreate, ICreateAluno } from "./api";
import { useAuth } from "@/context/auth";

const Page = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isbuscar, setisbuscar] = useState(false);

  const [nome, setNome] = useState('')
  const [dia, setDia] = useState('')
  const [mes, setMes] = useState('')
  const [ano, setAno] = useState('')
  const [cpf, setCpf] = useState('')
  const [rua, setRua] = useState('')
  const [telefone, setTelefone] = useState('')
  const [bairro, setBairro] = useState('')
  const [cep, setCep] = useState('')
  const [cidade, setCidade] = useState('')


  const cadFunc = () => {
    setIsModalOpen(!isModalOpen);
  }
  const buscar = () => {
    setisbuscar(!isbuscar);
  }

  const registraAluno = async () => {
    try {
      const dataNascimento = new Date(parseInt(ano, 10), parseInt(mes, 10), parseInt(dia, 10))
      await callCreate(
        {
          nome,
          dataNascimento,
          cpf,
          telefone,
          status: "Ativo",
          ultimaAlteracao: "a", // usuario logado
          dataUltimaAlteracao: new Date(),
          numeroRua: 0, // inserir campo na interface
          numeroCasa: 0,  // inserir campo na interface
          cep,
          bairro,
          cidade
        }
      );

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section>
      <div className="grid md:h-screen md:grid-cols-[350px_1fr]">
        <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
          <div className="max-w-lg text-center md:px-10 md:py-24 lg:py-32">
            <img alt="" src="/usuario.png" className="relative  inline-block w-100 h-100" />
            <div className="mx-auto w-full mt-12 mb-4 pb-4 ">
              <div className="relative">
                <a href="/agenda">
                  <button
                    className=" font-bold font-spartan text-[40px] mb-4 block   w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                    AGENDA
                  </button>
                </a>
              </div>
              <div className="relative">
                <a href="/alunos">
                  <button
                    className="font-bold font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">

                    ALUNOS
                  </button>
                </a>
              </div>
              <div className="relative">
                <a href="/equipe">
                  <button
                    className="font-bold font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                    EQUIPE
                  </button>
                </a>
              </div>
              <div className="relative">
                <a href="/financeiro">
                  <button
                    className="font-bold px-18 font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                    FINANCEIRO
                  </button>
                </a>
              </div>
              <div className="relative">
                <a href="/login">
                  <button
                    onClick={logout}
                    className="font-bold px-18 font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                    LOGOUT
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-no-repeat bg-cover  " style={{ backgroundImage: "url('fundo.png')" }}>
          <div className="flex flex justify-end gap-4">
            <button
              onClick={cadFunc}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Registrar novo aluno
            </button>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Editar registro
            </button>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-[100px]">
              Pesquisar aluno
            </button>
          </div>

          <div >
            <table className="w-full border-collapse border border-blue-500 max-w-xl mt-16 mx-auto">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-2 px-4 text-left">id</th>
                  <th className="py-2 px-4 text-left">Cpf</th>
                  <th className="py-2 px-4 text-left">status</th>
                  <th className="py-2 px-4 text-left">Ultima Alteracao</th>
                  <th className="py-2 px-4 text-left">Data ultima Alteracao</th>
                  <th className="py-2 px-4 text-left">numero Rua</th>
                  <th className="py-2 px-4 text-left">numero Casa</th>
                  <th className="py-2 px-4 text-left">cep</th>
                  <th className="py-2 px-4 text-left">bairro</th>
                  <th className="py-2 px-4 text-left">cidade</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-blue-500">
                  <td className="py-2 px-4">John Doe</td>
                  <td className="py-2 px-4">25</td>
                  <td className="py-2 px-4">New York</td>
                </tr>
                <tr className="bg-white border-b border-blue-500">
                  <td className="py-2 px-4">Jane Smith</td>
                  <td className="py-2 px-4">30</td>
                  <td className="py-2 px-4">Los Angeles</td>
                </tr>
                <tr className="bg-white border-b border-blue-500">
                  <td className="py-2 px-4">Bob Johnson</td>
                  <td className="py-2 px-4">40</td>
                  <td className="py-2 px-4">Chicago</td>
                </tr>
              </tbody>
            </table>


            {isModalOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
                  <div className=" w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">

                    <div className="w-full  mx-auto mt-8">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Nome:</label>
                            <input
                              type="text"
                              id="first_name"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">CPF:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={cpf}
                              onChange={(e) => setCpf(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Data de nascimento: dd/mm/yyyy</label>
                            <input
                              type="text"
                              id="dia"
                              value={dia}
                              onChange={(e) => setDia(e.target.value)}
                              className="w-[50px] rounded-lg text-black border py-2 px-[8px] mr-2 "
                            />
                            <input
                              type="text"
                              id="mes"
                              value={mes}
                              onChange={(e) => setMes(e.target.value)}
                              className=" w-[70px] rounded-lg text-black border py-2 mr-2 px-[8px] "
                            />
                            <input
                              type="text"
                              id="ano"
                              value={ano}
                              onChange={(e) => setAno(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Rua:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={rua}
                              onChange={(e) => setRua(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Telefone:</label>
                            <input
                              type="text"
                              id="first_name"
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3" />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Bairro:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={bairro}
                              onChange={(e) => setBairro(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Cep:</label>
                            <input
                              type="text"
                              id="first_name"
                              value={cep}
                              onChange={(e) => setCep(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Cidade:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                          </div>
                        </div>




                      </div>




                      <div className="mt-17 flex justify-end gap-4">
                        <button
                          onClick={cadFunc}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Cancelar</button>
                        <button
                          onClick={registraAluno}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">
                          Salvar
                        </button>

                      </div>
                    </div>
                  </div>
                </div>

              </div>


            )}

            {isbuscar && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
                  <div className=" w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">

                    <div className="w-full  mx-auto mt-8">

                      <div className="mb-6">
                        <div className="center">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Nome:</label>
                            <input type="text" id="first_name" className="w-80 rounded-lg border py-2 px-3" />
                          </div>

                        </div>




                      </div>




                      <div className="mt-17 flex justify-end gap-4">
                        <button className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Cancelar</button>
                        <button className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Salvar</button>

                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={buscar}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Fechar
                </button>
              </div>


            )}

          </div>



        </div>


      </div>
    </section>

  )
}

export default Page