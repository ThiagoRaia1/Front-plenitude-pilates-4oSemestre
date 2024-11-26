"use client"
import { useEffect, useState } from "react";
import { callCreate, getAluno, getTodos, IAluno, ICreateAluno, updateAluno } from "./api";
import { useAuth } from "@/context/auth";
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome não pode ser maior que 50 caracteres"),
  datanascimento: z.string().email("data de nascimento inválido"),
  cpf: z.string().min(1,{message: "CPF é obrigatório"}),
  telefone: z.string().length(11, { message: "Telefone deve ter 11 dígitos" }).regex(/^\d+$/, {
    message: "Telefone deve conter apenas números",
  }),
  rua: z.string().min(1, { message: "Rua é obrigatória" }),
  numeroRua: z.string().min(1, { message: "Número da rua é obrigatório" }),
  numeroCasa: z.string().min(1, { message: "Número da casa é obrigatório" }),
  cep: z.string().length(8, { message: "CEP deve ter 8 dígitos" }).regex(/^\d+$/, {
    message: "CEP deve conter apenas números",
  }),
  bairro: z.string().min(1, { message: "Bairro é obrigatório" }),
  cidade: z.string().min(1, { message: "Cidade é obrigatória" }),
});

const cpfRegex = /^[0-9]{11}$/;


function formataDataBr(data: Date) {
  const dia = data.getUTCDate().toString().padStart(2, '0'); // Garante que o dia tenha 2 dígitos
  const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); // Ajusta o mês (adiciona 1)
  const ano = data.getUTCFullYear().toString();

  const dataFormatada = `${dia}/${mes}/${ano}`;
  return dataFormatada;
}

const Page = () => {
  const { usuario, isAuthenticated, logout } = useAuth();

  const [isJanelaCadastro, setIsJanelaCadastro] = useState(false);

  const [isJanelaDadosAlunoPesquisado, setIsJanelaDadosAlunoPesquisado] = useState(false);
  const [isBuscarPesquisa, setIsBuscarPesquisa] = useState(false);

  const [isBuscarEditar, setIsBuscarEditar] = useState(false);
  const [isJanelaEditarAluno, setIsJanelaEditarAluno] = useState(false);

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

  const [aluno, setAluno] = useState<ICreateAluno | null>(null); // Inicialmente vazio
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
    setAluno(null)
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
    setIsBuscarPesquisa(!isBuscarPesquisa);
  }

  const abreFechaJanelaPesquisarAlunoParaEditar = () => {
    setIsBuscarEditar(!isBuscarEditar);
  }

  const abreFechaJanelaEditarAluno = () => {
    setIsJanelaEditarAluno(!isJanelaEditarAluno);
  }

  const handlePesquisar = async () => {
    try {
      setAluno(await getAluno(buscaCpf))
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
    } catch (error) {
      console.error(error)
    }
  };

  const handlePesquisarParaEditar = async () => {
    try {
      limpaCampos()
      setAluno(await getAluno(buscaCpf))
      if (aluno != null) {
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
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleUpdate = async () => {
    try {
      if (aluno != null && usuario != null) {
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
      console.error('Erro ao atualizar aluno:', error);
    }
  };

  const registraAluno = async () => {
    try {
      // Subtrai 1 do mês por causa do índice. Ex: mes[0] = janeiro, mes[1] = fevereiro [...]
      const dataNascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
      if (usuario != null) {
        await callCreate(
          {
            nome,
            dataNascimento,
            cpf,
            telefone,
            status: "Ativo",
            ultimaAlteracao: usuario.login, // usuario logado
            dataUltimaAlteracao: new Date(),
            rua,
            numeroRua,
            numeroCasa,
            cep,
            bairro,
            cidade,
            usuario: usuario.id
          }
        );
        limpaCampos()
        setIsJanelaCadastro(!isJanelaCadastro)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      // Validação dos dados com o Zod
      const validatedData = formSchema.parse({
        name: nome,
        datanascimento: `${dia}/${mes}/${ano}`,
        cpf: cpf,
        telefone: telefone,
        rua: rua,
        numeroCasa: numeroCasa,
        cep: cep,
        bairro: bairro,
        cidade: cidade,

        
        // Ajuste conforme necessário
      });
  
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
              onClick={abreFechaJanelaPesquisarAluno}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-[55px]">
              Excluir aluno
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
                {todos.map((todo) => (
                  <tr className="text-black text-center align-middle"
                    key={todo.id}>
                    <td>{todo.id}</td>
                    <td>{todo.nome}</td>
                    <td>{formataDataBr(new Date(todo.dataNascimento))}</td>
                    <td>{todo.cpf}</td>
                    <td>{todo.status}</td>
                    <td>{todo.ultimaAlteracao}</td>
                    <td>{formataDataBr(new Date(todo.dataUltimaAlteracao))}</td>
                    {/* <td>{todo.numeroRua}</td>
                    <td>{todo.numeroCasa}</td> */}
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
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <label
                      htmlFor="first_name"
                      className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                      Cadastro de aluno:
                    </label>
                    <div className="w-full  mx-auto">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Nome:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                             {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CPF:
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              value={cpf}
                              onChange={(e) => setCpf(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                            {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data de nascimento: dd/mm/yyyy</label>
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
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
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
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Rua:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={rua}
                              onChange={(e) => setRua(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                             {errors.rua && <p style={{ color: "red" }}>{errors.rua}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Telefone:</label>
                            <input
                              type="text"
                              id="first_name"
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3" />
                               {errors.telefone && <p style={{ color: "red" }}>{errors.telefone}</p>}
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Bairro:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={bairro}
                              onChange={(e) => setBairro(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                             {errors.bairro && <p style={{ color: "red" }}>{errors.bairro}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CEP:</label>
                            <input
                              type="text"
                              id="first_name"
                              value={cep}
                              onChange={(e) => setCep(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                             {errors.cep && <p style={{ color: "red" }}>{errors.cep}</p>}
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Cidade:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                             {errors.cidade && <p style={{ color: "red" }}>{errors.cidade}</p>}
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Rua:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={numeroRua}
                              onChange={(e) => setNumeroRua(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                             {errors.numerorua && <p style={{ color: "red" }}>{errors.numerorua}</p>}
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Casa:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={numeroCasa}
                              onChange={(e) => setNumeroCasa(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                             {errors.numerocasa && <p style={{ color: "red" }}>{errors.numerocasa}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-17 flex justify-end gap-4 ml-[936px]">
                        <button
                          onClick={abreFechaJanelaCadastro}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Cancelar
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-8 py-2 rounded-lg hover:bg-teal-700">
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
                        value={buscaCpf}
                        onChange={(e) => setBuscaCpf(e.target.value)}
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
                        value={buscaCpf}
                        onChange={(e) => setBuscaCpf(e.target.value)}
                        className="ml-3 w-[400] text-black mt-8 rounded-lg border py-2 px-3"
                      />
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
                <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                  <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                    <label
                      htmlFor="first_name"
                      className="text-[20px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-2">
                      Edição de aluno:
                    </label>
                    <div className="w-full  mx-auto">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Nome:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
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
                              onChange={(e) => setCpf(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Data de nascimento: dd/mm/yyyy</label>
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
                              className=" w-[100px] rounded-lg text-black border py-2 mr-2 px-[8px]"
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
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Rua:</label>
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
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Telefone:</label>
                            <input
                              type="text"
                              id="first_name"
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3" />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Bairro:</label>
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
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              CEP:</label>
                            <input
                              type="text"
                              id="first_name"
                              value={cep}
                              onChange={(e) => setCep(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Cidade:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={cidade}
                              onChange={(e) => setCidade(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Rua:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={numeroRua}
                              onChange={(e) => setNumeroRua(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                          </div>
                          <div>
                            <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Numero da Casa:</label>
                            <input
                              type="text"
                              id="last_name"
                              value={numeroCasa}
                              onChange={(e) => setNumeroCasa(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3 "
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-17 flex justify-end gap-4 ml-[936px]">
                        <button
                          onClick={abreFechaJanelaEditarAluno}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-4 py-2 rounded-lg hover:bg-teal-700">
                          Cancelar
                        </button>
                        <button
                          onClick={handleUpdate}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a] mt-[60px] px-8 py-2 rounded-lg hover:bg-teal-700">
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