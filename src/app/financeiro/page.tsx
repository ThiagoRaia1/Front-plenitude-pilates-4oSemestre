"use client";
import { useState } from "react";
import { callCreatePagamento, ICreatPagamento } from "./api";

const PagamentoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuscar, setIsBuscar] = useState(false);

  // Dados de pagamento
  const [id, setId] = useState<number>(1);  // ID será incrementado automaticamente
  const [cliente, setCliente] = useState('');
  const [formaDePagamento, setFormaDePagamento] = useState(''); // Campo de seleção
  const [status] = useState('Aprovado'); // Valor fixo como "Aprovado"
  const [valorpago, setValorPago] = useState<number>(0);
  const [data, setData] = useState<string>('');  // Data como string
  const [ultimaAlteracao, setUltimaAlteracao] = useState('');  // Usuário logado
  const [dataUltimaDeclaracao, setDataUltimaDeclaracao] = useState<Date>(new Date());  // Data da última modificação

  // Simulação de um usuário logado
  const usuarioLogado = "usuario_exemplo";  // Substitua isso pela lógica real de usuário logado

  // Incrementar o ID automaticamente ao criar um pagamento
  const gerarNovoId = () => {
    setId(prevId => prevId + 1);  // Incrementa o ID a cada novo pagamento
  };

  const cadFunc = () => {
    setIsModalOpen(!isModalOpen);
  };

  const buscar = () => {
    setIsBuscar(!isBuscar);
  };

  const validaCampos = () => {
    if (!cliente || !formaDePagamento || !data || valorpago <= 0) {
      alert("Todos os campos são obrigatórios e o valor pago deve ser maior que zero!");
      return false;
    }
    return true;
  };

  const registraPagamento = async () => {
    if (!validaCampos()) return;

    try {
      // Verificando a data para garantir que é válida
      const dataPagamento = new Date(data); // Convertendo string de data para Date
      if (isNaN(dataPagamento.getTime())) {
        alert("Data inválida");
        return;
      }

      console.log("Dados do pagamento", {
        id,
        cliente,
        ultimaAlteracao: usuarioLogado,  // Usuário logado
        dataUltimaDeclaracao: new Date(),  // Data da última modificação
        status,  // Sempre "Aprovado"
        formaDePagamento,
        data: dataPagamento,
        valorpago,
      });

      // Dados do pagamento
      const pagamento: ICreatPagamento = {
        id,
        cliente,
        ultimaAlteracao: usuarioLogado,  // Utilizando o usuário logado
        dataUltimaDeclaracao: new Date(),  // A data da última modificação
        status,  // Sempre "Aprovado"
        formaDePagamento,
        data: dataPagamento,
        valorpago,
      };

      // Chamada à API para registrar o pagamento
      await callCreatePagamento(pagamento);

      alert("Pagamento registrado com sucesso!");
      gerarNovoId();  // Incrementa o ID para o próximo pagamento
      setIsModalOpen(false);  // Fecha o modal após sucesso
    } catch (error) {
      console.error("Erro ao registrar pagamento", error);
      alert("Erro ao registrar pagamento");
    }
  };

  return (
    <section>
      <div className="grid md:h-screen md:grid-cols-[350px_1fr]">
        <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
          <div className="max-w-lg text-center md:px-10 md:py-24 lg:py-32">
            <img alt="" src="/usuario.png" className="relative inline-block w-100 h-100" />
            <div className="mx-auto w-full mt-12 mb-4 pb-4">
              {/* Botões de Navegação */}
              <div className="relative">
                <a href="/agenda">
                  <button className="font-bold font-spartan text-[40px] mb-4 block w-full text-[#ffffff] border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                    AGENDA
                  </button>
                </a>
              </div>
              <div className="relative">
                <a href="/alunos">
                  <button className="font-bold font-spartan text-[40px] mb-4 block w-full text-[#ffffff] border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                    ALUNOS
                  </button>
                </a>
              </div>
              <div className="relative">
                <a href="/equipe">
                  <button className="font-bold font-spartan text-[40px] mb-4 block w-full text-[#ffffff] border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                    EQUIPE
                  </button>
                </a>
              </div>
              <div className="relative">
                <a href="/financeiro">
                  <button className="font-bold font-spartan text-[40px] mb-4 block w-full text-[#ffffff] border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                    FINANCEIRO
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-no-repeat bg-cover" style={{ backgroundImage: "url('fundo.png')" }}>
          <div className="flex flex justify-end gap-4">
            <button onClick={cadFunc} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Registrar novo pagamento
            </button>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Editar registro
            </button>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-[100px]">
              Pesquisar pagamento
            </button>
          </div>

          {/* Tabela de pagamentos */}
          <table className="w-full border-collapse border border-blue-500 max-w-xl mt-16 mx-auto">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Cliente</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Forma de Pagamento</th>
                <th className="py-2 px-4 text-left">Data</th>
                <th className="py-2 px-4 text-left">Valor Pago</th>
              </tr>
            </thead>
            <tbody>
              {/* Dados da tabela (exemplo) */}
              <tr className="bg-white border-b border-blue-500">
                <td className="py-2 px-4">1</td>
                <td className="py-2 px-4">João Silva</td>
                <td className="py-2 px-4">Pago</td>
                <td className="py-2 px-4">Cartão de Crédito</td>
                <td className="py-2 px-4">12/11/2024</td>
                <td className="py-2 px-4">R$ 150,00</td>
              </tr>
            </tbody>
          </table>

          {/* Modal de Registro de Pagamento */}
          {isModalOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px] border-4 border-[#ececec] p-6">
                <div className="w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">
                  {/* Formulário de Pagamento */}
                  <div className="w-full mx-auto mt-8">
                    <div className="mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cliente" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Cliente:</label>
                          <input
                            type="text"
                            id="cliente"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            className="w-80 rounded-lg text-black border py-2 px-3"
                          />
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
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="data" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Data:</label>
                      <input
                        type="date"
                        id="data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-80 rounded-lg text-black border py-2 px-3"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="valorpago" className="text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Valor Pago:</label>
                      <input
                        type="number"
                        id="valorpago"
                        value={valorpago}
                        onChange={(e) => setValorPago(Number(e.target.value))}
                        className="w-80 rounded-lg text-black border py-2 px-3"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        onClick={registraPagamento}
                        className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600"
                      >
                        Registrar Pagamento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PagamentoPage;