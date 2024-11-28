"use client"
import { useEffect, useState } from "react";
import { callCreateInstrutor, callCreateUsuario, getInstrutor, getTodos, IInstrutor, ICreateInstrutor, updateInstrutor } from "./api";
import { useAuth } from "@/context/auth";
import { z } from "zod";
import { formataDataBr } from "../alunos/page";

const formSchemaCpf = z.object({
  cpf: z.string()
    // Verifica se esta no formato XXX.XXX.XXX-XX
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF deve conter o formato indicado", })
    // Verifica o tamanho
    .length(14, { message: "CPF deve ter 14 dígitos" }),
});

const formSchemaInstrutor = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome não pode ser maior que 50 caracteres"),

  // Verifica se a data digita é válida e se está no formato 99/99/9999
  dataNascimento: z.string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      { message: "Data inválida" }
    )
    .length(10, { message: "A data deve estar no formato dd/mm/aaaa " }),

  cpf: z.string()
    // Verifica se esta no formato XXX.XXX.XXX-XX
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF deve conter o formato indicado", })
    // Verifica o tamanho
    .length(14, { message: "CPF deve ter 14 dígitos" }),

  telefone: z.string()
    // Verifica o tamanho
    .length(14, { message: "Telefone deve ter 14 dígitos" })
    // Verifica se esta no formato (99)99999-9999
    .regex(/^\(\d{2}\)\d{5}-\d{4}$/, { message: "Telefone deve conter o formato indicado", }),

  rua: z.string().min(1, { message: "Rua é obrigatória" }),

  cep: z.string()
    // Verifica se esta no formato 99999-999
    .regex(/^\d{5}-\d{3}$/, { message: "CEP deve conter o formato indicado", })
    // Verifica o tamanho
    .length(9, { message: "CEP deve ter 9 dígitos" }),

  bairro: z.string().min(1, { message: "Bairro é obrigatório" }),

  cidade: z.string().min(1, { message: "Cidade é obrigatória" }),

  numeroRua: z.string()
    .regex(/^\d+$/, { message: "O número da rua deve conter apenas números" })
    .min(1, { message: "Número da rua é obrigatório" }),

  numeroCasa: z.string()
    .regex(/^\d+$/, { message: "O número da casa deve conter apenas números" })
    .min(1, { message: "Número da casa é obrigatório" }),
});

const formSchemaCreateUsuario = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(50, "Nome não pode ser maior que 50 caracteres"),

  login: z
    .string()
    .email("Login deve ser um e-mail válido"),

  senha: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[\W_]/, "Senha deve conter pelo menos um caractere especial"),

  nivelDeAcesso: z
    .string()
    .refine(
      (val) => ["1", "2", "3"].includes(val),
      "Nível de acesso deve ser um dos valores: 1, 2 ou 3"
    ),
});

const Page = () => {
  const { usuario, isAuthenticated, logout } = useAuth();

  const [isJanelaCadastro, setIsJanelaCadastro] = useState(false);
  const [isJanelaCadastroUsuario, setIsJanelaCadastroUsuario] = useState(false);

  const [isJanelaDadosInstrutorPesquisado, setIsJanelaDadosInstrutorPesquisado] = useState(false);
  const [isBuscarPesquisa, setIsBuscarPesquisa] = useState(false);

  const [isBuscarEditar, setIsBuscarEditar] = useState(false);
  const [isJanelaEditarInstrutor, setIsJanelaEditarInstrutor] = useState(false);

  const [isBuscarExcluir, setIsBuscarExcluir] = useState(false);
  const [isJanelaExcluirInstrutor, setIsJanelaExcluirInstrutor] = useState(false);

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
  const [numeroRua, setNumeroRua] = useState('')
  const [numeroCasa, setNumeroCasa] = useState('')

  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [nivelDeAcesso, setNivelDeAcesso] = useState('')

  const [instrutor, setInstrutor] = useState<ICreateInstrutor | null>(null); // Inicialmente vazio
  const [buscaCpf, setBuscaCpf] = useState('')
  const [cpfAtual, setCpfAtual] = useState('')

  const [todos, setTodos] = useState<IInstrutor[]>([]) // Inicializa o estado com um array vazio

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getTodos()
      setTodos(data) // Atualiza o estado com os dados obtidos
    }
    fetchTodos() // Chama a função fetchTodos
  })

  function limpaCampos() {
    setNome('')
    setDia('')
    setMes('')
    setAno('')
    setCpf('')
    setRua('')
    setTelefone('')
    setBairro('')
    setCep('')
    setCidade('')
    setNumeroRua('')
    setNumeroCasa('')
    setLogin('')
    setSenha('')
    setNivelDeAcesso('')
    setBuscaCpf('')
    setInstrutor(null)
  }

  const abreFechaJanelaCadastro = () => {
    setErrors({});
    limpaCampos()
    setIsJanelaCadastro(!isJanelaCadastro);
  }

  const abreFechaJanelaCadastroUsuario = () => {
    setErrors({});
    limpaCampos()
    setIsJanelaCadastroUsuario(!isJanelaCadastroUsuario);
  }

  const abreFechaJanelaDadosinstrutorPesquisado = () => {
    setErrors({});
    setIsJanelaDadosInstrutorPesquisado(!isJanelaDadosInstrutorPesquisado);
  }

  const abreFechaJanelaPesquisarinstrutor = () => {
    limpaCampos()
    setErrors({});
    setIsBuscarPesquisa(!isBuscarPesquisa);
  }

  const abreFechaJanelaPesquisarinstrutorParaEditar = () => {
    limpaCampos()
    setErrors({});
    setIsBuscarEditar(!isBuscarEditar);
  }

  const abreFechaJanelaEditarinstrutor = () => {
    setErrors({});
    setIsJanelaEditarInstrutor(!isJanelaEditarInstrutor);
  }

  const abreFechaJanelaPesquisarInstrutorParaExcluir = () => {
    setBuscaCpf('')
    setErrors({});
    setIsBuscarExcluir(!isBuscarExcluir);
  }

  const abreFechaJanelaExcluirInstrutor = () => {
    setIsJanelaExcluirInstrutor(!isJanelaExcluirInstrutor);
  }

  const handlePesquisar = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchemaCpf.parse({
        cpf: buscaCpf,
      });
      const instrutor: IInstrutor = await getInstrutor(buscaCpf)
      limpaCampos()
      if (instrutor != null) {
        setIsBuscarPesquisa(!isBuscarPesquisa); // Fecha a janela de busca de instrutor por cpf
        setIsJanelaDadosInstrutorPesquisado(!isJanelaDadosInstrutorPesquisado); // Abre a janela de registro de instrutor para exibir os dados, alterar para uma nova janela de exibicao apenas
        // Exibe os dados na janela
        setNome(instrutor.nome)
        const dataNascimento = new Date(instrutor.dataNascimento)
        setDia(dataNascimento.getUTCDate().toString().padStart(2, '0'))
        setMes((dataNascimento.getUTCMonth() + 1).toString().padStart(2, '0'))
        setAno(dataNascimento.getUTCFullYear().toString())
        setCpf(instrutor.cpf)
        setRua(instrutor.rua)
        setTelefone(instrutor.telefone)
        setBairro(instrutor.bairro)
        setCep(instrutor.cep)
        setCidade(instrutor.cidade)
        setNumeroRua(instrutor.numeroRua.toString())
        setNumeroCasa(instrutor.numeroCasa.toString())
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

  const handlePesquisarParaEditar = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchemaCpf.parse({
        cpf: buscaCpf,
      });
      const instrutor: IInstrutor = await getInstrutor(buscaCpf)
      limpaCampos()
      if (instrutor != null) {
        setCpfAtual(instrutor.cpf)
        setErrors({})
        setIsBuscarEditar(!isBuscarEditar); // Fecha a janela de busca de instrutor por cpf
        setIsJanelaEditarInstrutor(!isJanelaEditarInstrutor); // Abre a janela de edicao de instrutor para exibir os dados
        // Exibe os dados na janela
        setNome(instrutor.nome)
        const dataNascimento = new Date(instrutor.dataNascimento)
        setDia(dataNascimento.getUTCDate().toString().padStart(2, '0'))
        setMes((dataNascimento.getUTCMonth() + 1).toString().padStart(2, '0'))
        setAno(dataNascimento.getUTCFullYear().toString())
        setCpf(instrutor.cpf)
        setRua(instrutor.rua)
        setTelefone(instrutor.telefone)
        setBairro(instrutor.bairro)
        setCep(instrutor.cep)
        setCidade(instrutor.cidade)
        setNumeroRua(instrutor.numeroRua.toString())
        setNumeroCasa(instrutor.numeroCasa.toString())
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
        alert("CPF não registrado.")
      }
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchemaInstrutor.parse({
        name: nome,
        dataNascimento: `${dia}/${mes}/${ano}`,
        cpf: cpf,
        telefone: telefone,
        rua: rua,
        numeroRua: numeroRua,
        numeroCasa: numeroCasa,
        cep: cep,
        bairro: bairro,
        cidade: cidade,
      });
      const instrutor = await getInstrutor(cpfAtual)
      if (usuario != null) {
        const updateData = {
          nome,
          dataNascimento: new Date(instrutor.dataNascimento),
          cpf,
          rua,
          telefone,
          ultimaAlteracao: usuario.login,
          dataUltimaAlteracao: new Date(),
          numeroRua,
          numeroCasa,
          cep,
          bairro,
          cidade,
        }; // Cria o DTO com os dados a serem enviados
        await updateInstrutor(cpfAtual, updateData);
        setIsJanelaEditarInstrutor(!isJanelaEditarInstrutor)
        limpaCampos()
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

  const registraInstrutor = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validação dos dados com o Zod
      formSchemaInstrutor.parse({
        name: nome,
        dataNascimento: `${dia}/${mes}/${ano}`,
        cpf: cpf,
        telefone: telefone,
        rua: rua,
        numeroRua: numeroRua,
        numeroCasa: numeroCasa,
        cep: cep,
        bairro: bairro,
        cidade: cidade,
        // Ajuste conforme necessário
      });
      // Subtrai 1 do mês por causa do índice. Ex: mes[0] = janeiro, mes[1] = fevereiro [...]
      const dataNascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
      if (usuario != null) {
        await callCreateInstrutor(
          {
            nome,
            dataNascimento,
            cpf,
            rua,
            telefone,
            status: "Ativo",
            ultimaAlteracao: usuario.login, // usuario logado
            dataUltimaAlteracao: new Date(),
            numeroRua,
            numeroCasa,
            cep,
            bairro,
            cidade,
            usuario: usuario.id
          }
        );
        setErrors({});
        limpaCampos()
        setIsJanelaCadastro(!isJanelaCadastro)
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
  }

  const registraUsuario = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validação dos dados com o Zod
      formSchemaCreateUsuario.parse({
        nome: nome,
        login: login,
        senha: senha,
        nivelDeAcesso: nivelDeAcesso
        // Ajuste conforme necessário
      });
      if (usuario != null) {
        await callCreateUsuario(
          {
            login,
            senha,
            nome,
            status: "Ativo",
            // ultimaAlteracao: usuario.login, // usuario logado
            // dataUltimaAlteracao: new Date(),
            // usuario: usuario.id
            nivelDeAcesso
          }
        );
        limpaCampos()
        setIsJanelaCadastroUsuario(!isJanelaCadastroUsuario)
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
  }

  const handlePesquisarParaExcluir = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchemaCpf.parse({
        cpf: buscaCpf,
      });
      const instrutor: IInstrutor = await getInstrutor(buscaCpf)
      if (instrutor != null) {
        setIsBuscarExcluir(!isBuscarExcluir); // Fecha a janela de busca de instrutor por cpf
        setIsJanelaExcluirInstrutor(!isJanelaExcluirInstrutor); // Abre a janela com os dados do instrutor a ser excluído
        // Exibe os dados na janela
        setNome(instrutor.nome)
        const dataNascimento = new Date(instrutor.dataNascimento)
        setDia(dataNascimento.getUTCDate().toString().padStart(2, '0'))
        setMes((dataNascimento.getUTCMonth() + 1).toString().padStart(2, '0'))
        setAno(dataNascimento.getUTCFullYear().toString())
        setCpf(instrutor.cpf)
        setRua(instrutor.rua)
        setTelefone(instrutor.telefone)
        setBairro(instrutor.bairro)
        setCep(instrutor.cep)
        setCidade(instrutor.cidade)
        setNumeroRua(instrutor.numeroRua.toString())
        setNumeroCasa(instrutor.numeroCasa.toString())
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
        alert("CPF não registrado")
      }
    }
  };

  const excluirInstrutor = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (usuario != null) {
        const updateData = {
          ultimaAlteracao: usuario.login,
          dataUltimaAlteracao: new Date(),
          status: "X",
        }; // Cria o DTO com os dados a serem enviados
        await updateInstrutor(cpf, updateData);
        setIsJanelaExcluirInstrutor(!isJanelaExcluirInstrutor)
        limpaCampos()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section>
      <div className="grid md:h-screen md:grid-cols-[350px_1fr]">
        <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
          <div className="max-w-lg text-center md:px-10 md:py-24 lg:py-32">
            <img alt="" src="/usuario.png" className="relative inline-block w-100 h-100" />
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
                    className="font-bold font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent bg-white bg-opacity-20 focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
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

        <div className="bg-no-repeat bg-cover" style={{ backgroundImage: "url('fundo.png')" }}>
          <div className="flex justify-end gap-4">
            <button
              onClick={abreFechaJanelaCadastro}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-8">
              Registrar novo funcionario
            </button>
            <button
              onClick={abreFechaJanelaCadastroUsuario}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Registrar novo usuario
            </button>
            <button
              onClick={abreFechaJanelaPesquisarinstrutorParaEditar}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Editar registro de instrutor
            </button>
            <button
              onClick={abreFechaJanelaPesquisarinstrutor}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Pesquisar funcionario
            </button>
            <button
              onClick={abreFechaJanelaPesquisarInstrutorParaExcluir}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-[40px]">
              Excluir funcionario
            </button>
          </div>
          <div>
            <table
              className="bg-white w-full max-w-xl mt-16 mx-auto
                      [&_td]:border-collapse [&_td]:border [&_td]:border-blue-500
                      [&_th]:border-collapse [&_th]:border [&_th]:border-black [&_th]:py-2 [&_th]:px-4 [&_th]:text-centered">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Data de nascimento</th>
                  <th>CPF</th>
                  <th>Status</th>
                  <th>Última Alteração</th>
                  <th>Data da Última Alteração</th>
                  {/* <th>Número Rua</th>
                  <th>Número Casa</th> */}
                  <th>CEP</th>
                  <th>Bairro</th>
                  <th>Cidade</th>
                </tr>
              </thead>
              <tbody>
                {todos
                  .filter((todo) => todo.status !== "X")
                  .map((todo) => (
                    <tr
                      className="text-black text-center align-middle"
                      key={todo.id}
                    >
                      <td>{todo.id}</td>
                      <td>{todo.nome}</td>
                      <td>{formataDataBr(new Date(todo.dataNascimento))}</td>
                      <td>{todo.cpf}</td>
                      <td>{todo.status}</td>
                      <td>{todo.ultimaAlteracao}</td>
                      <td>{formataDataBr(new Date(todo.dataUltimaAlteracao))}</td>
                      <td>{todo.cep}</td>
                      <td>{todo.bairro}</td>
                      <td>{todo.cidade}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Janela de Cadastro */}
            {isJanelaCadastro && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[630px] border-4 border-[#ececec] p-6">
                  <div className="absolute top-[45px] left-1/2 transform -translate-x-1/2 bg-white rounded-lg border-4 border-[#9f968a] px-4 py-1 z-10">
                    <label
                      htmlFor="first_name"
                      className="text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]">
                      Cadastro de instrutor:
                    </label>
                  </div>
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <div className="w-full  mx-auto">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Nome:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3"
                            />
                            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CPF - 999.999.999-99:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={cpf}
                              onChange={(e) => setCpf(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3"
                            />
                            {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data de nascimento: dd/mm/aaaa</label>
                            <input
                              type="text"
                              id="dia"
                              value={dia}
                              onChange={(e) => setDia(e.target.value)}
                              className="w-[100px] rounded-lg text-black border py-1 px-[8px] mr-2"
                            />
                            <input
                              type="text"
                              id="mes"
                              value={mes}
                              onChange={(e) => setMes(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-1 mr-2 px-[8px]"
                            />
                            <input
                              type="text"
                              id="ano"
                              value={ano}
                              onChange={(e) => setAno(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-1 mr-2 px-[8px]"
                            />
                            {errors.dataNascimento && <p style={{ color: "red" }}>{errors.dataNascimento}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Rua:</label>
                            <input
                              type="text"
                              id="rua"
                              value={rua}
                              onChange={(e) => setRua(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.rua && <p style={{ color: "red" }}>{errors.rua}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Telefone - (99)99999-9999:</label>
                            <input
                              type="text"
                              id="telefone"
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3" />
                            {errors.telefone && <p style={{ color: "red" }}>{errors.telefone}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Bairro:</label>
                            <input
                              type="text"
                              id="bairro"
                              value={bairro}
                              onChange={(e) => setBairro(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.bairro && <p style={{ color: "red" }}>{errors.bairro}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CEP - 99999-999:</label>
                            <input
                              type="text"
                              id="cep"
                              value={cep}
                              onChange={(e) => setCep(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3"
                            />
                            {errors.cep && <p style={{ color: "red" }}>{errors.cep}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Cidade:</label>
                            <input
                              type="text"
                              id="cidade"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.cidade && <p style={{ color: "red" }}>{errors.cidade}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Rua:</label>
                            <input
                              type="text"
                              id="numeroRua"
                              value={numeroRua}
                              onChange={(e) => setNumeroRua(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.numeroRua && <p style={{ color: "red" }}>{errors.numeroRua}</p>}

                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Casa:</label>
                            <input
                              type="text"
                              id="numeroCasa"
                              value={numeroCasa}
                              onChange={(e) => setNumeroCasa(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.numeroCasa && <p style={{ color: "red" }}>{errors.numeroCasa}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-15 flex justify-end gap-4 ml-[800px]">
                        <button
                          onClick={abreFechaJanelaCadastro}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]  px-4 py-1 rounded-lg hover:bg-teal-700">
                          Cancelar
                        </button>
                        <button
                          onClick={registraInstrutor}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]  px-8 py-1 rounded-lg hover:bg-teal-700">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Janela para pesquisar o instrutor e apenas exibir seus dados */}
            {isBuscarPesquisa && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
                  <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">
                    <div className="flex flex-col items-center justify-center h-full">
                      <label
                        htmlFor="first_name"
                        className=" ml-4 text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">
                        Digite o CPF do instrutor que quer encontrar:
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        placeholder="999.999.999-99"
                        value={buscaCpf}
                        onChange={(e) => setBuscaCpf(e.target.value)}
                        className="ml-3 w-[400] text-black mt-8 rounded-lg border py-2 px-3"
                      />
                      {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
                      <div className="flex mt-10 gap-4">
                        <button
                          onClick={handlePesquisar}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Pesquisar
                        </button>
                        <button
                          onClick={abreFechaJanelaPesquisarinstrutor}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-8 py-2 rounded-lg hover:bg-teal-700 ">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Janela para mostrar os dados do instrutor pesquisado */}
            {isJanelaDadosInstrutorPesquisado && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <label
                      htmlFor="first_name"
                      className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                      instrutor pesquisado:
                    </label>
                    <div className="w-full  mx-auto">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Nome:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={nome}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CPF:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={cpf}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data de nascimento: dd/mm/yyyy
                            </label>
                            <input
                              type="text"
                              id="dia"
                              value={dia}
                              disabled
                              className="w-[100px] rounded-lg text-black border py-2 px-[8px] mr-2"
                            />
                            <input
                              type="text"
                              id="mes"
                              value={mes}
                              disabled
                              className="w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
                            />
                            <input
                              type="text"
                              id="ano"
                              value={ano}
                              disabled
                              className="w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Rua:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={rua}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Telefone:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={telefone}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Bairro:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={bairro}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CEP:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={cep}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Cidade:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={cidade}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Rua:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={numeroRua}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Casa:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={numeroCasa}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-17 flex justify-end gap-4 ml-[936px]">
                        <button
                          onClick={abreFechaJanelaDadosinstrutorPesquisado}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Fechar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Janela para buscar instrutor a ser editado */}
            {isBuscarEditar && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
                  <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">
                    <div className="flex flex-col items-center justify-center h-full">
                      <label
                        htmlFor="first_name"
                        className=" ml-4 text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">
                        Digite o CPF do instrutor que quer editar:
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        placeholder="999.999.999-99"
                        value={buscaCpf}
                        onChange={(e) => setBuscaCpf(e.target.value)}
                        className="ml-3 w-[400] text-black mt-8 rounded-lg border py-2 px-3"
                      />
                      {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
                      <div className="flex mt-10 gap-4">
                        <button
                          onClick={handlePesquisarParaEditar}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Pesquisar
                        </button>
                        <button
                          onClick={abreFechaJanelaPesquisarinstrutorParaEditar}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-8 py-2 rounded-lg hover:bg-teal-700 ">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isJanelaEditarInstrutor && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[630px] border-4 border-[#ececec] p-6">
                  <div className="absolute top-[45px] left-1/2 transform -translate-x-1/2 bg-white rounded-lg border-4 border-[#9f968a] px-4 py-1 z-10">
                    <label
                      htmlFor="first_name"
                      className="text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]">
                      Editar Instrutor:
                    </label>
                  </div>
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <div className="w-full  mx-auto">
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Nome:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3"
                            />
                            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CPF - 999.999.999-99:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={cpf}
                              onChange={(e) => setCpf(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3"
                            />
                            {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data de nascimento: dd/mm/aaaa</label>
                            <input
                              type="text"
                              id="dia"
                              value={dia}
                              onChange={(e) => setDia(e.target.value)}
                              className="w-[100px] rounded-lg text-black border py-1 px-[8px] mr-2"
                            />
                            <input
                              type="text"
                              id="mes"
                              value={mes}
                              onChange={(e) => setMes(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-1 mr-2 px-[8px]"
                            />
                            <input
                              type="text"
                              id="ano"
                              value={ano}
                              onChange={(e) => setAno(e.target.value)}
                              className=" w-[100px] rounded-lg text-black border py-1 mr-2 px-[8px]"
                            />
                            {errors.dataNascimento && <p style={{ color: "red" }}>{errors.dataNascimento}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Rua:</label>
                            <input
                              type="text"
                              id="rua"
                              value={rua}
                              onChange={(e) => setRua(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.rua && <p style={{ color: "red" }}>{errors.rua}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Telefone - (99)99999-9999:</label>
                            <input
                              type="text"
                              id="telefone"
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3" />
                            {errors.telefone && <p style={{ color: "red" }}>{errors.telefone}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Bairro:</label>
                            <input
                              type="text"
                              id="bairro"
                              value={bairro}
                              onChange={(e) => setBairro(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.bairro && <p style={{ color: "red" }}>{errors.bairro}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CEP - 99999-999:</label>
                            <input
                              type="text"
                              id="cep"
                              value={cep}
                              onChange={(e) => setCep(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3"
                            />
                            {errors.cep && <p style={{ color: "red" }}>{errors.cep}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Cidade:</label>
                            <input
                              type="text"
                              id="cidade"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.cidade && <p style={{ color: "red" }}>{errors.cidade}</p>}
                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Rua:</label>
                            <input
                              type="text"
                              id="numeroRua"
                              value={numeroRua}
                              onChange={(e) => setNumeroRua(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.numeroRua && <p style={{ color: "red" }}>{errors.numeroRua}</p>}

                          </div>
                          <div className="min-h-[90px]">
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Casa:</label>
                            <input
                              type="text"
                              id="numeroCasa"
                              value={numeroCasa}
                              onChange={(e) => setNumeroCasa(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3 "
                            />
                            {errors.numeroCasa && <p style={{ color: "red" }}>{errors.numeroCasa}</p>}
                          </div>
                        </div>
                      </div>
                      <div className=" flex justify-end gap-4 ml-[600px]">
                        <button
                          onClick={abreFechaJanelaEditarinstrutor}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]  px-4 py-2 rounded-lg hover:bg-teal-700">
                          Cancelar
                        </button>
                        <button
                          onClick={handleUpdate}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]  px-8 py-2 rounded-lg hover:bg-teal-700">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isJanelaCadastroUsuario && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <label
                      htmlFor="first_name"
                      className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                      Cadastro de usuário:
                    </label>
                    <div className="w-full mx-auto mt-20">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Login:
                            </label>
                            <input
                              type="email"
                              id="first_name"
                              placeholder="Email"
                              value={login}
                              onChange={(e) => setLogin(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                            {errors.login && <p style={{ color: "red" }}>{errors.login}</p>}
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Senha:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={senha}
                              onChange={(e) => setSenha(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                            {errors.senha && <p style={{ color: "red" }}>{errors.senha}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Nome:</label>
                            <input
                              type="text"
                              id="first_name"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3" />
                            {errors.nome && <p style={{ color: "red" }}>{errors.nome}</p>}
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Nivel de acesso:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={nivelDeAcesso}
                              onChange={(e) => setNivelDeAcesso(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                            {errors.nivelDeAcesso && <p style={{ color: "red" }}>{errors.nivelDeAcesso}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={abreFechaJanelaCadastroUsuario}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Cancelar
                        </button>
                        <button
                          onClick={registraUsuario}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-8 py-2 rounded-lg hover:bg-teal-700">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Janela para pesquisar o instrutor e apenas exibir seus dados */}
            {isBuscarExcluir && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
                  <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">
                    <div className="flex flex-col items-center justify-center h-full">
                      <label
                        htmlFor="first_name"
                        className=" ml-4 text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">
                        Digite o CPF do instrutor que quer encontrar:
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        placeholder="999.999.999-99"
                        value={buscaCpf}
                        onChange={(e) => setBuscaCpf(e.target.value)}
                        className="ml-3 w-[400] text-black mt-8 rounded-lg border py-2 px-3"
                      />
                      {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
                      <div className="flex mt-10 gap-4">
                        <button
                          onClick={handlePesquisarParaExcluir}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Pesquisar
                        </button>
                        <button
                          onClick={abreFechaJanelaPesquisarInstrutorParaExcluir}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-8 py-2 rounded-lg hover:bg-teal-700 ">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Janela para mostrar os dados do aluno a ser excluído */}
            {isJanelaExcluirInstrutor && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <label
                      htmlFor="first_name"
                      className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                      Instrutor a ser excluído:
                    </label>
                    <div className="w-full  mx-auto">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="first_name"
                              className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Nome:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={nome}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CPF:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={cpf}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data de nascimento: dd/mm/yyyy
                            </label>
                            <input
                              type="text"
                              id="dia"
                              value={dia}
                              disabled
                              className="w-[100px] rounded-lg text-black border py-2 px-[8px] mr-2"
                            />
                            <input
                              type="text"
                              id="mes"
                              value={mes}
                              disabled
                              className="w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
                            />
                            <input
                              type="text"
                              id="ano"
                              value={ano}
                              disabled
                              className="w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Rua:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={rua}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Telefone:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={telefone}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Bairro:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={bairro}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CEP:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={cep}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Cidade:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={cidade}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Rua:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={numeroRua}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Casa:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={numeroCasa}
                              disabled
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-17 flex justify-end gap-4 ml-[936px]">
                        <button
                          onClick={abreFechaJanelaExcluirInstrutor}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Fechar
                        </button>
                        <button
                          onClick={excluirInstrutor}
                          className="bg-red-500 text-[24px] font-[Garet] font-sans font-bold text-white mt-[60px] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Excluir
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