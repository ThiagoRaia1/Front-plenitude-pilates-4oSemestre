export interface IPagamento {
  id: number
  aluno: number;
  formaDePagamento: string;
  status: string;
  valorPago: number;
  data: Date;
  ultimaAlteracao: string;
  dataUltimaAlteracao: Date;
  usuario: number
}

export interface ICreatePagamento {
  aluno: number;
  formaDePagamento: string;
  status: string;
  valorPago: number; // mudar para number 
  data: Date;
  ultimaAlteracao: string;
  dataUltimaAlteracao: Date;
  usuario: number
}

export const callCreate = async (data: ICreatePagamento): Promise<ICreatePagamento> => {
  try {
    const response = await fetch('http://localhost:3001/pagamento', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.error("deu erro")
      throw new Error(`${response.statusText}`);
    }

    // Retorna os dados do aluno
    return await response.json();
  } catch (error) {
    throw error;
  }
};


export const getTodos = async (): Promise<IPagamento[]> => {
  const response = await fetch('http://localhost:3001/pagamento')
  return await response.json()
}

export const getPagamento = async (id: number): Promise<IPagamento> => {
  // Faz a requisição ao servidor
  try {
    const response = await fetch(`http://localhost:3001/alunos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }

    // Retorna os dados do aluno
    return await response.json();
  } catch (error) {
    throw error;
  }
};