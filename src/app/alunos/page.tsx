"use client"
import { useEffect, useState } from "react";
import { callCreate, getAluno, getTodos, IAluno, updateAluno } from "./api";
import { useAuth } from "@/context/auth";
import { z } from 'zod';
import { formataDataBr } from "@/utils/formataDataBr";
import MenuPrincipal from "@/components/menuPrincipal";

const formSchemaCpf = z.object({
  cpf: z.string()
    // Verifica se esta no formato XXX.XXX.XXX-XX
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF deve conter o formato indicado", })
    // Verifica o tamanho
    .length(14, { message: "CPF deve ter 14 dígitos" }),
});

const formSchema = z.object({
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

const Page = () => {
  const { usuario, isAuthenticated, logout } = useAuth();

  const [isJanelaCadastro, setIsJanelaCadastro] = useState(false);

  const [isJanelaDadosAlunoPesquisado, setIsJanelaDadosAlunoPesquisado] = useState(false);
  const [isBuscarPesquisa, setIsBuscarPesquisa] = useState(false);

  const [isBuscarEditar, setIsBuscarEditar] = useState(false);
  const [isJanelaEditarAluno, setIsJanelaEditarAluno] = useState(false);

  const [isBuscarExcluir, setIsBuscarExcluir] = useState(false);
  const [isJanelaExcluirAluno, setIsJanelaExcluirAluno] = useState(false);

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

  const [buscaCpf, setBuscaCpf] = useState('')
  const [cpfAtual, setCpfAtual] = useState('')

  const [todos, setTodos] = useState<IAluno[]>([]) // Inicializa o estado com um array vazio

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
    setBuscaCpf('')
  }

  const abreFechaJanelaCadastro = () => {
    limpaCampos()
    setIsJanelaCadastro(!isJanelaCadastro);
    setErrors({});
  }

  const abreFechaJanelaDadosAlunoPesquisado = () => {
    setIsJanelaDadosAlunoPesquisado(!isJanelaDadosAlunoPesquisado);
  }

  const abreFechaJanelaPesquisarAluno = () => {
    setBuscaCpf('')
    setErrors({});
    setIsBuscarPesquisa(!isBuscarPesquisa);
  }

  const abreFechaJanelaPesquisarAlunoParaEditar = () => {
    setBuscaCpf('')
    setErrors({});
    setIsBuscarEditar(!isBuscarEditar);
  }

  const abreFechaJanelaEditarAluno = () => {
    setIsJanelaEditarAluno(!isJanelaEditarAluno);
  }

  const abreFechaJanelaPesquisarAlunoParaExcluir = () => {
    setBuscaCpf('')
    setErrors({});
    setIsBuscarExcluir(!isBuscarExcluir);
  }

  const abreFechaJanelaExcluirAluno = () => {
    setIsJanelaExcluirAluno(!isJanelaExcluirAluno);
  }

  const handlePesquisar = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchemaCpf.parse({
        cpf: buscaCpf,
      });
      const aluno: IAluno = await getAluno(buscaCpf)
      if (aluno != null) {
        setIsBuscarPesquisa(!isBuscarPesquisa); // Fecha a janela de busca de aluno por cpf
        setIsJanelaDadosAlunoPesquisado(!isJanelaDadosAlunoPesquisado); // Abre a janela de registro de aluno para exibir os dados, alterar para uma nova janela de exibicao apenas
        // Exibe os dados na janela
        setNome(aluno.nome)
        const dataNascimento = new Date(aluno.dataNascimento)
        setDia(dataNascimento.getUTCDate().toString().padStart(2, '0'))
        setMes((dataNascimento.getUTCMonth() + 1).toString().padStart(2, '0'))
        setAno(dataNascimento.getUTCFullYear().toString())
        setCpf(aluno.cpf)
        setRua(aluno.rua)
        setTelefone(aluno.telefone)
        setBairro(aluno.bairro)
        setCep(aluno.cep)
        setCidade(aluno.cidade)
        setNumeroRua(aluno.numeroRua.toString())
        setNumeroCasa(aluno.numeroCasa.toString())
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

  const handlePesquisarParaExcluir = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchemaCpf.parse({
        cpf: buscaCpf,
      });
      const aluno: IAluno = await getAluno(buscaCpf)
      if (aluno != null) {
        setIsBuscarExcluir(!isBuscarExcluir); // Fecha a janela de busca de aluno por cpf
        setIsJanelaExcluirAluno(!isJanelaExcluirAluno); // Abre a janela com os dados do aluno a ser excluído
        // Exibe os dados na janela
        setNome(aluno.nome)
        const dataNascimento = new Date(aluno.dataNascimento)
        setDia(dataNascimento.getUTCDate().toString().padStart(2, '0'))
        setMes((dataNascimento.getUTCMonth() + 1).toString().padStart(2, '0'))
        setAno(dataNascimento.getUTCFullYear().toString())
        setCpf(aluno.cpf)
        setRua(aluno.rua)
        setTelefone(aluno.telefone)
        setBairro(aluno.bairro)
        setCep(aluno.cep)
        setCidade(aluno.cidade)
        setNumeroRua(aluno.numeroRua.toString())
        setNumeroCasa(aluno.numeroCasa.toString())
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

  const excluirAluno = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (usuario != null) {
        const updateData = {
          ultimaAlteracao: usuario.login,
          dataUltimaAlteracao: new Date(),
          status: "X",
        }; // Cria o DTO com os dados a serem enviados
        await updateAluno(cpf, updateData);
        setIsJanelaExcluirAluno(!isJanelaExcluirAluno)
        limpaCampos()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handlePesquisarParaEditar = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchemaCpf.parse({
        cpf: buscaCpf,
      });
      limpaCampos()
      try {
        const aluno: IAluno = await getAluno(buscaCpf)
        setCpfAtual(aluno.cpf)
        setIsBuscarEditar(!isBuscarEditar); // Fecha a janela de busca de aluno por cpf
        setIsJanelaEditarAluno(!isJanelaEditarAluno); // Abre a janela de edicao de aluno para exibir os dados
        // Exibe os dados na janela
        setNome(aluno.nome)
        const dataNascimento = new Date(aluno.dataNascimento)
        setDia(dataNascimento.getUTCDate().toString().padStart(2, '0'))
        setMes((dataNascimento.getUTCMonth() + 1).toString().padStart(2, '0'))
        setAno(dataNascimento.getUTCFullYear().toString())
        setCpf(aluno.cpf)
        setRua(aluno.rua)
        setTelefone(aluno.telefone)
        setBairro(aluno.bairro)
        setCep(aluno.cep)
        setCidade(aluno.cidade)
        setNumeroRua(aluno.numeroRua.toString())
        setNumeroCasa(aluno.numeroCasa.toString())
      } catch (error) {
        alert("CPF nao registrado.")
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

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      formSchema.parse({
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
      const aluno = await getAluno(cpfAtual)
      if (usuario != null) {
        const updateData = {
          nome,
          dataNascimento: new Date(aluno.dataNascimento),
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
        await updateAluno(cpfAtual, updateData);
        setIsJanelaEditarAluno(!isJanelaEditarAluno)
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSubmitCriarAluno = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validação dos dados com o Zod
      formSchema.parse({
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
      try {
        const aluno: IAluno = await getAluno(cpf)
        alert("CPF ja cadastrado.")
      } catch (error: any) {
        // Se passar pela validação, a execução segue
        const dataNascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        if (usuario != null) {
          await callCreate({
            nome,
            dataNascimento,
            cpf,
            telefone,
            status: "Ativo",
            ultimaAlteracao: usuario.login,
            dataUltimaAlteracao: new Date(),
            rua,
            numeroRua,
            numeroCasa,
            cep,
            bairro,
            cidade,
            usuario: usuario.id,
          });
          // Limpa os campos e fecha o modal
          limpaCampos();
          setErrors({});
          setIsJanelaCadastro(!isJanelaCadastro);
        }
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

  return (
    <section className="flex h-screen">
      <div style={{ overflow: "hidden", height: "100vh" }}>
        <MenuPrincipal/>
      </div>
      <div className="flex-grow p-6 bg-no-repeat bg-cover" style={{ backgroundImage: "url('fundo.png')" }}>
        <div className="flex justify-end gap-4">
          <button
            onClick={abreFechaJanelaCadastro}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Registrar novo aluno
          </button>
          <button
            onClick={abreFechaJanelaPesquisarAlunoParaEditar}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Editar registro
          </button>
          <button
            onClick={abreFechaJanelaPesquisarAluno}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Pesquisar aluno
          </button>
          <button
            onClick={abreFechaJanelaPesquisarAlunoParaExcluir}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-[40px]">
            Excluir aluno
          </button>
        </div>
        <div className="overflow-x-auto max-h-[650px]">
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
                    Cadastro de aluno:
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
                        onClick={handleSubmitCriarAluno}
                        className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]  px-8 py-1 rounded-lg hover:bg-teal-700">
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Janela para pesquisar o aluno e apenas exibir seus dados */}
          {isBuscarPesquisa && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
              <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
                <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">
                  <div className="flex flex-col items-center justify-center h-full">
                    <label
                      htmlFor="first_name"
                      className=" ml-4 text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">
                      Digite o CPF do aluno que quer encontrar:
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

          {/* Janela para mostrar os dados do aluno pesquisado */}
          {isJanelaDadosAlunoPesquisado && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                  <label
                    htmlFor="first_name"
                    className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                    Aluno pesquisado:
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
                        onClick={abreFechaJanelaDadosAlunoPesquisado}
                        className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-4 py-2 rounded-lg hover:bg-teal-700">
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Janela para buscar aluno a ser editado */}
          {isBuscarEditar && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
              <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
                <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">
                  <div className="flex flex-col items-center justify-center h-full">
                    <label
                      htmlFor="first_name"
                      className=" ml-4 text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">
                      Digite o CPF do aluno que quer editar:
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
                        onClick={abreFechaJanelaPesquisarAlunoParaEditar}
                        className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-8 py-2 rounded-lg hover:bg-teal-700 ">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isJanelaEditarAluno && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-[#ececec] rounded-lg w-[1000px] h-[630px] border-4 border-[#ececec] p-6">
                <div className="absolute top-[45px] left-1/2 transform -translate-x-1/2 bg-white rounded-lg border-4 border-[#9f968a] px-4 py-1 z-10">
                  <label
                    htmlFor="first_name"
                    className="text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]">
                    Editar Aluno:
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
                        onClick={abreFechaJanelaEditarAluno}
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

          {/* Janela para pesquisar o aluno e apenas exibir seus dados */}
          {isBuscarExcluir && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
              <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
                <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">
                  <div className="flex flex-col items-center justify-center h-full">
                    <label
                      htmlFor="first_name"
                      className=" ml-4 text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">
                      Digite o CPF do aluno que quer encontrar:
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
                        onClick={abreFechaJanelaPesquisarAlunoParaExcluir}
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
          {isJanelaExcluirAluno && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                  <label
                    htmlFor="first_name"
                    className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                    Aluno a ser excluído:
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
                        onClick={abreFechaJanelaExcluirAluno}
                        className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-4 py-2 rounded-lg hover:bg-teal-700">
                        Fechar
                      </button>
                      <button
                        onClick={excluirAluno}
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
      </div >
    </section >
  )
}

export default Page