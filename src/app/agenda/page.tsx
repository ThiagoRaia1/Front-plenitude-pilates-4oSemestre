"use client"
import { useState } from "react";
import { callCreateAlunoAula, callCreateAula, getAula, getAulas, IAula, IUpdateAula, updateAula, verificaAlunoAula } from "./api";
import Calendar from "../../components/calendar";
import { useAuth } from "@/context/auth";
import { getInstrutor, IInstrutor } from "../equipe/api";
import { getAluno, IAluno } from "../alunos/api";
import { z } from "zod";
import AulaList from "../../components/aulalist";

const formSchemaCpf = z.object({
  cpf: z.string()
    // Verifica se esta no formato XXX.XXX.XXX-XX
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF deve conter o formato indicado", })
    // Verifica o tamanho
    .length(14, { message: "CPF deve ter 14 dígitos" }),
});

const formSchemaAula = z.object({
  // Verifica se a data digita é válida e se está no formato 99/99/9999
  dataAula: z.string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      { message: "Data inválida" }
    )
    .length(10, { message: "A data deve estar no formato dd/mm/aaaa" }),

  // Verifica se o horário é valido
  horario: z.string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, { message: "Horário inválido", }),

  cpf: z.string()
    // Verifica se esta no formato XXX.XXX.XXX-XX
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF deve conter o formato indicado", })
    // Verifica o tamanho
    .length(14, { message: "CPF deve ter 14 dígitos" }),
});

const opcoes = ['Aula Normal', 'Aula Experimental'];

const formSchemaAlunoAula = z.object({
  // Verifica se a data digita é válida e se está no formato 99/99/9999
  dataAula: z.string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      { message: "Data inválida" }
    )
    .length(10, { message: "A data deve estar no formato dd/mm/aaaa " }),

  // Verifica se o horário é valido
  horario: z.string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, { message: "Horário inválido", }),

  // Valida se o tipo de aula foi escolhido
  tipoDeAula: z.string()
    .refine((value) => opcoes.includes(value), {
      message: `Selecione o tipo de aula`,
    }),
});

const Page = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuscar, setIsBuscar] = useState(false);
  const [isJanelaAdicionarAlunoAula, setIsJanelaAdicionarAlunoAula] = useState(false);
  const [isJanelaAulasSeguintes, setIsJanelaAulasSeguintes] = useState(false);
  const [cpf, setCpf] = useState('');

  const [dia, setDia] = useState(new Date().getUTCDate().toString().padStart(2, '0'))
  const [mes, setMes] = useState((new Date().getUTCMonth() + 1).toString().padStart(2, '0'))
  const [ano, setAno] = useState(new Date().getUTCFullYear().toString())
  const [tipoDeAula, setTipoDeAula] = useState('')
  const [instrutorCpf, setInstrutorCpf] = useState('')
  const [dadosInstrutor, setDadosInstrutor] = useState<IInstrutor | null>(null)
  const [aluno, setAluno] = useState<IAluno | null>(null)

  const [aulas, setAulas] = useState<IAula[] | null>(null)

  const [horario, setHorario] = useState('')

  const [hora, minuto] = horario.split(':'); // Divide o horário no formato HH:MM
  const data = new Date(
    parseInt(ano),
    parseInt(mes) - 1,
    parseInt(dia)
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const registraAula = async (event: React.FormEvent) => {
    event.preventDefault();
    let horaComeco = new Date();
    let horaFim = new Date();
    try {
      // Validação dos dados com o Zod
      formSchemaAula.parse({
        dataAula: `${dia}/${mes}/${ano}`,
        horario: horario,
        cpf: instrutorCpf,
      });

      try {
        setErrors({});
        horaComeco = new Date(
          parseInt(ano),
          parseInt(mes) - 1,
          parseInt(dia),
          parseInt(hora),
          parseInt(minuto)
        );

        horaFim = new Date(
          parseInt(ano),
          parseInt(mes) - 1,
          parseInt(dia),
          parseInt(hora) + 1,
          parseInt(minuto)
        );
        // Verifica se a data/hora da aula já passou
        if (horaComeco < new Date()) {
          throw new Error("Não é permitido registrar uma aula em um dia ou horário que já passou.");
        }

        const aula = await getAula(horaComeco); // Retorna erro "Not Found" se a aula não estiver registrada
        if (aula != null) {
          throw new Error("Aula já registrada"); // Se a aula já existir, não faz um novo cadastro
        }
      } catch (error: any) {
        if (error.message === "Not Found") {
          if (usuario != null) {
            try {
              setDadosInstrutor(await getInstrutor(instrutorCpf));
              if (dadosInstrutor != null) {
                const instrutor = dadosInstrutor.id;
                await callCreateAula(
                  {
                    data, // remover
                    horaComeco,
                    horaFim,
                    qtdeVagas: 5,
                    qtdeVagasDisponiveis: 5,
                    status: "Ativo",
                    instrutor,
                  }
                );
                setIsModalOpen(!isModalOpen);
              }
            } catch (error: any) {
              if (error.message === "Not Found") {
                alert("CPF não registrado")
              }
            }
          }
        }
        if (error.message === "Aula já registrada") {
          alert("Erro: Aula já registrada.");
        }
        if (error.message === "Não é permitido registrar uma aula em um dia ou horário que já passou.") {
          alert(error.message); // Exibe a mensagem para o usuário
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Se ocorrer um erro de validação, configuramos os erros de campo
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors); // Atualiza o estado de erros
      }
      // console.error(error)
    }
  };


  const registraAlunoAula = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validação inicial para verificar se o horário já passou
      const horaComeco = new Date(
        parseInt(ano),
        parseInt(mes) - 1,
        parseInt(dia),
        parseInt(hora),
        parseInt(minuto)
      );
      if (horaComeco < new Date()) {
        throw new Error("Não é permitido agendar em um dia ou horário que já passou.");
      }

      // Validação dos dados com o Zod
      formSchemaAlunoAula.parse({
        dataAula: `${dia}/${mes}/${ano}`,
        horario: horario,
        tipoDeAula: tipoDeAula,
      });
      setErrors({});

      if (usuario != null) {
        const aula = await getAula(horaComeco);
        if (aula.qtdeVagasDisponiveis == 0) {
          throw new Error("Vagas ocupadas");
        }
        if (aula != null && aluno != null) {
          const verificaSeJaExiste = await verificaAlunoAula(aluno.id, aula.id);
          if (verificaSeJaExiste) {
            alert("Aluno já cadastrado para essa aula.");
          } else {
            await callCreateAlunoAula({
              aluno,
              aula,
              tipoDeAula,
            });
            aula.qtdeVagasDisponiveis -= 1; // Reduz a quantidade de vagas disponíveis
            const updateData: IUpdateAula = {
              qtdeVagasDisponiveis: aula.qtdeVagasDisponiveis,
            };
            await updateAula(aula.id, updateData); // Atualiza a quantidade de vagas disponíveis na aula
            setIsJanelaAdicionarAlunoAula(!isJanelaAdicionarAlunoAula);
          }
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Se ocorrer um erro de validação, configuramos os erros de campo
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors); // Atualiza o estado de erros
      }
      if (error.message === "Not Found") {
        alert("Erro: Não há aula registrada para o horário informado.");
      }
      if (error.message === "Vagas ocupadas") {
        alert("Erro: Não há vagas para o horário informado.");
      }
      if (error.message === "Não é permitido agendar em um dia ou horário que já passou.") {
        alert(error.message); // Exibe a mensagem de erro caso o horário já tenha passado
      }
    }
  };


  const handlePesquisarAluno = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchemaCpf.parse({
        cpf: cpf,
      });
      setAluno(await getAluno(cpf))
      if (aluno != null) {
        setIsBuscar(!isBuscar); // Fecha a janela de busca de aluno por cpf
        setIsJanelaAdicionarAlunoAula(!isJanelaAdicionarAlunoAula)
        // Exibe os dados na janela
        setErrors({});
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Se ocorrer um erro de validação, configuramos os erros de campo
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors); // Atualiza o estado de erros
      }
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
    setHorario("08:00")
    setErrors({})
    setIsModalOpen(!isModalOpen);
  }
  const buscar = () => {
    setErrors({})
    setIsBuscar(!isBuscar);
  }

  const abreFechaJanelaPesquisarAluno = () => {
    setErrors({});
    setIsBuscar(!isBuscar);
  }

  const abreFechaJanelaRegistrarAlunoAula = () => {
    setErrors({});
    setIsJanelaAdicionarAlunoAula(!isJanelaAdicionarAlunoAula);
  }

  const abreFechaJanelaAulasSeguintes = () => {
    try {
      const fetchTodos = async () => {
        const data = await getAulas()
        setAulas(data) // Atualiza o estado com os dados obtidos
      }
      fetchTodos() // Chama a função fetchTodos
    } catch (error) {
      console.error(error)
    }
    setErrors({});
    setIsJanelaAulasSeguintes(!isJanelaAulasSeguintes);
  }

  const [selectedAula, setSelectedAula] = useState<IAula | null>(null);
  const [isModalAlunosAula, setIsModalAlunosAula] = useState(false);
  const handleSelectAula = (aula: IAula) => {
    setSelectedAula(aula); // Define a aula selecionada
    setIsModalAlunosAula(true);  // Abre o modal
  };

  return (
    <section>
      <div className="grid md:h-screen md:grid-cols-[350px_1fr]">
        <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
          <div className="max-w-lg text-center md:px-10 md:py-24 lg:py-32">
            <img alt="" src="/usuario.png" className="relative  inline-block w-100 h-100" />
            <div className="mx-auto w-full mt-12 mb-[600px] pb-4 ">
              <div className="relative">
                <h1
                  className="font-bold font-spartan text-[30px] text-white">
                  Usuario: {usuario?.nome}
                </h1>
                <a href="/agenda">
                  <button
                    className=" font-bold font-spartan text-[40px] mb-4 block   w-full  text-[#ffffff]  border-2 border-transparent bg-white bg-opacity-20 focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
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
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Adicionar aluno a aula
            </button>
            <button
              onClick={abreFechaJanelaAulasSeguintes}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-5">
              Consultar aulas
            </button>
          </div>
          <div className="mt-8" >
            <Calendar onDateChange={handleDateChange} />
            {isJanelaAulasSeguintes && (
              <AulaList aulas={aulas} onSelectAula={handleSelectAula}></AulaList>
            )}
          </div>

          <div>
            {isModalOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <label
                      htmlFor="first_name"
                      className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                      Cadastro de aula:
                    </label>
                    <div className="w-full  mx-auto mt-8">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data da aula: dd/mm/aaaa
                            </label>
                            <input
                              type="text"
                              id="dia"
                              placeholder="dd"
                              value={dia}
                              onChange={(e) => setDia(e.target.value)}
                              className="w-[100px] rounded-lg text-black border py-2 px-[8px] mr-2"
                            />
                            <input
                              type="text"
                              id="mes"
                              placeholder="mm"
                              value={mes}
                              onChange={(e) => setMes(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px] "
                            />
                            <input
                              type="text"
                              id="ano"
                              placeholder="aaaa"
                              value={ano}
                              onChange={(e) => setAno(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
                            />
                            {errors.dataAula && <p style={{ color: "red" }}>{errors.dataAula}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Horário:
                            </label>
                            <select
                              value={horario}
                              onChange={(e) => setHorario(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            >
                              <option value="08:00">08:00</option>
                              <option value="09:00">09:00</option>
                              <option value="10:00">10:00</option>
                              <option value="11:00">11:00</option>
                              <option value="12:00">12:00</option>
                              <option value="13:00">13:00</option>
                              <option value="14:00">14:00</option>
                              <option value="15:00">15:00</option>
                              <option value="16:00">16:00</option>
                              <option value="17:00">17:00</option>
                              <option value="18:00">18:00</option>
                            </select>
                            {errors.horario && <p style={{ color: "red" }}>{errors.horario}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-40 mt-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Instrutor (CPF):
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              placeholder="999.999.999-99"
                              value={instrutorCpf}
                              onChange={(e) => setInstrutorCpf(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3" />
                            {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
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
                        placeholder="999.999.999-99"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className="ml-3 w-[400] text-black mt-8 rounded-lg border py-2 px-3"
                      />
                      {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
                      <div className="flex mt-10 gap-4">
                        <button
                          onClick={handlePesquisarAluno}
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
                              Data da aula: dd/mm/aaaa
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
                            {errors.dataAula && <p style={{ color: "red" }}>{errors.dataAula}</p>}
                          </div>
                          <div>
                            <label
                              htmlFor="first_name"
                              className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Tipo de aula:
                            </label>
                            <select
                              id="tipoDeAula"
                              value={tipoDeAula}
                              onChange={(e) => setTipoDeAula(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3">
                              <option value="">Selecione um tipo</option>
                              {opcoes.map((opcao, index) => (
                                <option key={index} value={opcao}>
                                  {opcao}
                                </option>
                              ))}
                            </select>
                            {errors.tipoDeAula && <p style={{ color: "red" }}>{errors.tipoDeAula}</p>}
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
                              min="08:00"
                              max="18:00"
                              value={horario}
                              onChange={(e) => setHorario(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                            {errors.horario && <p style={{ color: "red" }}>{errors.horario}</p>}
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