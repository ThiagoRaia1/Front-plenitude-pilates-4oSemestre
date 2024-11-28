"use client"
import { useEffect, useState } from "react";
import { callCreate, getTodos, IPagamento } from "./api";
import { useAuth } from "@/context/auth";
import { z } from 'zod';
import { getAluno, getAlunoId } from "../alunos/api";
import { formataDataBr } from "../alunos/page";

const formSchema = z.object({
  cpf: z.string()
    // Verifica se esta no formato XXX.XXX.XXX-XX
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF deve conter o formato indicado", })
    // Verifica o tamanho
    .length(14, { message: "CPF deve ter 14 dígitos" }),

  data: z.string()
    .refine((value: string) => value !== null && value !== undefined && value !== '', { message: "Selecione uma data" }),

  formaDePagamento: z.enum(["Crédito", "Débito", "Dinheiro"], {
    errorMap: () => ({ message: "Forma de pagamento deve ser 'Crédito', 'Débito' ou 'Dinheiro'" }),
  }),

  valorPago: z.number()
    .min(1, { message: "O valor pago é obrigatório" })
    .refine(value => value > 0, { message: "O valor pago deve ser maior que 0" }),
});

const Page = () => {
  const { usuario, isAuthenticated, logout } = useAuth();

  const [isJanelaCadastro, setIsJanelaCadastro] = useState(false);

  const [cpf, setCpf] = useState('')
  const [dataPagamento, setDataPagamento] = useState('');
  const [valorPago, setValorPago] = useState<number>(0);
  const [formaDePagamento, setFormaDePagamento] = useState(''); // Campo de seleção

  const [todos, setTodos] = useState<IPagamento[]>([]) // Inicializa o estado com um array vazio
  const [alunos, setAlunos] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getTodos();
      setTodos(data);

      // Para cada pagamento, buscar o nome do aluno
      const alunosMap: { [id: number]: string } = {};
      for (const todo of data) {
        if (!alunosMap[todo.aluno]) {
          try {
            const aluno = await getAlunoId(todo.aluno);
            alunosMap[todo.aluno] = aluno.nome; // Armazena o nome do aluno
          } catch (error) {
            alunosMap[todo.aluno] = "Erro ao carregar"; // Caso haja erro ao buscar o aluno
          }
        }
      }
      setAlunos(alunosMap); // Atualiza o estado com os nomes dos alunos
    };

    fetchTodos();
  }, []);


  function limpaCampos() {
    setCpf('')
    setDataPagamento('')
    setValorPago(0)
    setFormaDePagamento('')
  }

  const abreFechaJanelaCadastro = () => {
    limpaCampos()
    setIsJanelaCadastro(!isJanelaCadastro);
    setErrors({});
  }

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSubmitCriarPagamento = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.error(dataPagamento)
      // Validação dos dados com o Zod
      formSchema.parse({
        cpf: cpf,
        formaDePagamento: formaDePagamento,
        data: dataPagamento,
        valorPago: valorPago,
        // Ajuste conforme necessário
      });
      const data = new Date(dataPagamento)
      // Se passar pela validação, a execução segue
      const aluno = (await getAluno(cpf)).id
      if (usuario != null) {
        await callCreate({
          aluno,
          formaDePagamento,
          status: "Aprovado",
          valorPago,
          data,
          ultimaAlteracao: usuario.login,
          dataUltimaAlteracao: new Date(),
          usuario: usuario.id,
        });
        // Limpa os campos e fecha o modal
        const updatedTodos = await getTodos(); // Chama novamente a API para pegar os pagamentos atualizados
        setTodos(updatedTodos); // Atualiza o estado com os dados mais recentes
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
      console.error(error)
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
                    className="font-bold px-18 font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent bg-white bg-opacity-20 focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
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
        <div className=" bg-no-repeat bg-cover" style={{ backgroundImage: "url('fundo.png')" }}>
          <div className="flex justify-end gap-4">
            <button
              onClick={abreFechaJanelaCadastro}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-[90px]">
              Registrar novo pagamento
            </button>
          </div>
          <div>
            <table
              className="bg-white w-full max-w-xl mt-16 mx-auto
                      [&_td]:border-collapse [&_td]:border [&_td]:border-blue-500
                      [&_th]:border-collapse [&_th]:border [&_th]:border-black [&_th]:py-2 [&_th]:px-4 [&_th]:text-centered">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th>ID Pagamento</th>
                  <th>Aluno</th>
                  <th>Status</th>
                  <th>Última Alteração</th>
                  <th>Data da Última Alteração</th>
                  <th>Data</th>
                  <th>Forma de pagamento</th>
                  <th>Valor pago</th>
                </tr>
              </thead>
              <tbody>
                {todos.filter(todo => todo.status !== "X").map(todo => (
                  <tr className="text-black text-center align-middle" key={todo.id}>
                    <td>{todo.id}</td>
                    <td>{alunos[todo.aluno] || "Carregando..."}</td>
                    <td>{todo.status}</td>
                    <td>{todo.ultimaAlteracao}</td>
                    <td>{formataDataBr(new Date(todo.dataUltimaAlteracao))}</td>
                    <td>{formataDataBr(new Date(todo.data))}</td>
                    <td>{todo.formaDePagamento}</td>
                    <td>{todo.valorPago}</td>
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
                      Registrar de pagamento:
                    </label>
                  </div>
                  <div className="w-full h-full flex justify-center items-center p-8 border-4 border-[#9f968a] rounded-lg">
                    <div className="w-full  mx-auto">
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="min-h-[90px]">
                            <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">
                              Aluno (CPF):
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              placeholder="999.999.999-99"
                              value={cpf}
                              onChange={(e) => setCpf(e.target.value)}
                              className="w-80 rounded-lg text-black border py-1 px-3"
                            />
                            {errors.cpf && <p style={{ color: "red" }}>{errors.cpf}</p>}
                          </div>
                          <div>
                            <label htmlFor="formaDePagamento" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Forma de Pagamento:</label>
                            <select
                              id="formaDePagamento"
                              value={formaDePagamento}
                              onChange={(e) => setFormaDePagamento(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            >
                              <option value="">Selecione...</option>
                              <option value="Crédito">Crédito</option>
                              <option value="Débito">Débito</option>
                              <option value="Dinheiro">Dinheiro</option>
                            </select>
                            {errors.formaDePagamento && <p style={{ color: "red" }}>{errors.formaDePagamento}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="data" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Data:</label>
                            <input
                              type="date"
                              id="data"
                              value={dataPagamento}
                              placeholder="dd/mm/aaaa"
                              onChange={(e) => setDataPagamento(e.target.value)}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                            {errors.data && <p style={{ color: "red" }}>{errors.data}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="mb-6">
                            <label htmlFor="valorpago" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Valor Pago:</label>
                            <input
                              type="number"
                              id="valorpago"
                              value={valorPago}
                              onChange={(e) => setValorPago(Number(e.target.value))}
                              className="w-80 rounded-lg text-black border py-2 px-3"
                            />
                            {errors.valorPago && <p style={{ color: "red" }}>{errors.valorPago}</p>}
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
                          onClick={handleSubmitCriarPagamento}
                          className="bg-white text-[24px] font-[Garet] font-sans font-bold text-[#9f968a]  px-8 py-1 rounded-lg hover:bg-teal-700">
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