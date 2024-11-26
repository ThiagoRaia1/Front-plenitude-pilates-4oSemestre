"use client"
import { useState } from "react";
import { callCreateAlunoAula, callCreateAula, getAula, IAula } from "./api";
import Calendar from "../calendar/page";
import { useAuth } from "@/context/auth";
import { getInstrutor, IInstrutor } from "../equipe/api";
import { getAluno, IAluno } from "../alunos/api";

const Page = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuscar, setIsBuscar] = useState(false);
  const [isJanelaAdicionarAlunoAula, setIsJanelaAdicionarAlunoAula] = useState(false);
  const [cpf, setCpf] = useState('');

  const [dia, setDia] = useState('')
  const [mes, setMes] = useState('')
  const [ano, setAno] = useState('')
  const [instrutorCpf, setInstrutorCpf] = useState('')
  const [dadosInstrutor, setDadosInstrutor] = useState<IInstrutor | null>(null)
  const [aluno, setAluno] = useState<IAluno | null>(null)
  const [aula, setAula] = useState<IAula | null>(null)

  const [horario, setHorario] = useState('')

  const [hora, minuto] = horario.split(':'); // Divide o horário no formato HH:MM
  const data = new Date(
    parseInt(ano),
    parseInt(mes) - 1,
    parseInt(dia)
  );

  const registraAula = async () => {
    const horaComeco = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      parseInt(hora),
      parseInt(minuto)
    )

    const horaFim = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      parseInt(hora) + 1,
      parseInt(minuto)
    )

    try {
      if (usuario != null) {
        setDadosInstrutor(await getInstrutor(instrutorCpf))
        if (dadosInstrutor != null) {
          const instrutor = dadosInstrutor.id
          await callCreateAula(
            {
              data, // remover
              horaComeco,
              horaFim,
              qtdeVagas: 5,
              qtdeVagasDisponiveis: 5,
              status: "Ativo",
              instrutor
            }
          );
          setIsModalOpen(!isModalOpen)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const registraAlunoAula = async () => {
    const horaComeco = new Date(
      parseInt(ano),
      parseInt(mes) - 1,
      parseInt(dia),
      parseInt(hora),
      parseInt(minuto)
    );

    try {
      if (usuario != null) {
        setAula(await getAula(horaComeco))
        if (aula != null && aluno != null) {
          await callCreateAlunoAula({
            aluno,
            aula
          })
          setIsJanelaAdicionarAlunoAula(!isJanelaAdicionarAlunoAula)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handlePesquisar = async () => {
    try {
      setAluno(await getAluno(cpf))
      if (aluno != null) {
        setIsBuscar(!isBuscar); // Fecha a janela de busca de aluno por cpf
        setIsJanelaAdicionarAlunoAula(!isJanelaAdicionarAlunoAula)
        // Exibe os dados na janela
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleDateChange = (dataSelecionada: Date | null) => {
    if (dataSelecionada != null) {
      setDia(dataSelecionada.getUTCDate().toString().padStart(2, '0')) // Garante que o dia tenha 2 dígitos)
      setMes((dataSelecionada.getUTCMonth() + 1).toString().padStart(2, '0')); // Ajusta o mês (adiciona 1))
      setAno(dataSelecionada.getUTCFullYear().toString())
    }
  };

  const cadFunc = () => {
    setIsModalOpen(!isModalOpen);
  }
  const buscar = () => {
    setIsBuscar(!isBuscar);
  }

  const abreFechaJanelaPesquisarAluno = () => {
    setIsBuscar(!isBuscar);
  }

  const abreFechaJanelaRegistrarAlunoAula = () => {
    setIsJanelaAdicionarAlunoAula(!isJanelaAdicionarAlunoAula);
  }

  return (
    <section>
      <div className="grid md:h-screen md:grid-cols-[350px_1fr]">
        <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
          <div className="max-w-lg text-center md:px-10 md:py-24 lg:py-32">
            <img alt="" src="/usuario.png" className="relative  inline-block w-100 h-100" />
            <div className="mx-auto w-full mt-12 mb-4 pb-4 ">
              <div className="relative">
                <h1
                  className="font-bold font-spartan text-[30px] text-white">
                  Usuario: {usuario?.nome}
                </h1>
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
              Registrar nova aula
            </button>
            <button
              onClick={buscar}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-5">
              Adicionar aluno a aula
            </button>
          </div>
          <div className="mt-8" >
            <Calendar onDateChange={handleDateChange} />
          </div>
          <div >

            {isModalOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <label
                      htmlFor="first_name"
                      className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                      Cadastro de aula:
                    </label>
                    <div className="w-full  mx-auto my-16">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data da aula: dd/mm/yyyy
                            </label>
                            <input
                              type="text"
                              id="dia"
                              value={dia}
                              onChange={(e) => setDia(e.target.value)}
                              className="w-[100px] rounded-lg text-black border py-2 px-[8px] mr-2"
                            />
                            <input
                              type="text"
                              id="mes"
                              value={mes}
                              onChange={(e) => setMes(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px] "
                            />
                            <input
                              type="text"
                              id="ano"
                              value={ano}
                              onChange={(e) => setAno(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Horário:
                            </label>
                            <input
                              id="time-input"
                              type="time"
                              placeholder="00:00"
                              min="08:00"
                              max="18:00"
                              value={horario}
                              onChange={(e) => setHorario(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Instrutor:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={instrutorCpf}
                              onChange={(e) => setInstrutorCpf(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-17 flex justify-end gap-4">
                        <button
                          onClick={cadFunc}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] px-8 py-2 rounded-lg hover:bg-teal-700">
                          Cancelar
                        </button>
                        <button
                          onClick={registraAula}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] px-10 py-2 rounded-lg hover:bg-teal-700 mr-8">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Janela para pesquisar o aluno que será registrado a aula */}
            {isBuscar && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6  ">
                  <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">
                    <div className="flex flex-col items-center justify-center h-full">
                      <label
                        htmlFor="first_name"
                        className=" ml-4 text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">
                        Digite o CPF do aluno que quer adicionar:
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="ml-3 w-[400] text-black mt-8 rounded-lg border py-2 px-3"
                      />
                      <div className="flex mt-10 gap-4">
                        <button
                          onClick={handlePesquisar}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Pesquisar
                        </button>
                        <button
                          onClick={abreFechaJanelaPesquisarAluno}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-8 py-2 rounded-lg hover:bg-teal-700 ">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isJanelaAdicionarAlunoAula && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <label
                      htmlFor="first_name"
                      className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                      Registrar aluno a aula:
                    </label>
                    <div className="w-full  mx-auto my-16">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data da aula: dd/mm/yyyy
                            </label>
                            <input
                              type="text"
                              id="dia"
                              value={dia}
                              onChange={(e) => setDia(e.target.value)}
                              className="w-[100px] rounded-lg text-black border py-2 px-[8px] mr-2"
                            />
                            <input
                              type="text"
                              id="mes"
                              value={mes}
                              onChange={(e) => setMes(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px] "
                            />
                            <input
                              type="text"
                              id="ano"
                              value={ano}
                              onChange={(e) => setAno(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Horário:
                            </label>
                            <input
                              id="time-input"
                              type="time"
                              placeholder="00:00"
                              min="08:00"
                              max="18:00"
                              value={horario}
                              onChange={(e) => setHorario(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Aluno:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={aluno?.nome}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-17 flex justify-end gap-4">
                        <button
                          onClick={abreFechaJanelaRegistrarAlunoAula}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] px-8 py-2 rounded-lg hover:bg-teal-700">
                          Cancelar
                        </button>
                        <button
                          onClick={registraAlunoAula}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] px-10 py-2 rounded-lg hover:bg-teal-700 mr-8">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

export default Page