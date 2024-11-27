export interface ICreatPagamento {
  id: number;
  cliente: string;
  ultimaAlteracao: string;
  dataUltimaDeclaracao: Date;
  status: string;
  formaDePagamento: string;
  data: Date;
  valorpago: number; 
}

export const callCreatePagamento = async (data: ICreatPagamento): Promise<ICreatPagamento> => {
  try {
    const response = await fetch('http://localhost:3001/pagamento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        dataUltimaDeclaracao: data.dataUltimaDeclaracao.toISOString(), // Garantindo que a data esteja em formato ISO
        data: data.data.toISOString(), // Convertendo a data para o formato ISO
      }),
    });

    // Verifica se a resposta foi ok (status 200-299)
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Erro ao criar pagamento: ${errorResponse.message || response.statusText}`);
    }

    // Se tudo correr bem, parseia a resposta JSON
    const result = await response.json();

    return result;
  } catch (error) {
    // Captura de qualquer erro ocorrido no processo
    console.error('Erro na criação do pagamento', error);
    throw error;  // Re-lança o erro para ser tratado em outro lugar
  }
};

