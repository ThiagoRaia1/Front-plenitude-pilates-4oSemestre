export interface ICreateInstrutor {
  nome: string
  dataNascimento: Date
  cpf: string
  rua: string
  telefone: string
  status: string
  ultimaAlteracao: string
  dataUltimaAlteracao: Date
  numeroRua: string // alterar para number
  numeroCasa: string // alterar para number
  cep: string
  bairro: string
  cidade: string
  usuario: number
}

export interface IUpdateInstrutor {
  nome?: string
  dataNascimento?: Date
  cpf?: string
  rua?: string
  telefone?: string
  ultimaAlteracao: string
  dataUltimaAlteracao: Date
  numeroRua?: string; // alterar para number
  numeroCasa?: string; // alterar para number
  cep?: string;
  bairro?: string;
  cidade?: string;
}

export interface IInstrutor {
  id: number
  nome: string
  dataNascimento: Date
  cpf: string
  rua: string
  telefone: string
  status: string
  ultimaAlteracao: string
  dataUltimaAlteracao: Date
  numeroRua: number;
  numeroCasa: number;
  cep: string;
  bairro: string;
  cidade: string;
}

export const callCreate = async (data: ICreateInstrutor): Promise<ICreateInstrutor> => {
  const response = await fetch('http://localhost:3001/instrutor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (response.ok) {

  } else {
    throw new Error(`Erro ao criar instrutor: ${response.statusText}`);
  }

  return await response.json()
}

export const getTodos = async (): Promise<IInstrutor[]> => {
  const response = await fetch('http://localhost:3001/instrutor')
  return await response.json()
}

export const getInstrutor = async (cpf: string): Promise<any> => {
  // Faz a requisição ao servidor
  try {
    const response = await fetch(`http://localhost:3001/instrutor/${cpf}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar instrutor: ${response.statusText}`);
    }

    // Retorna os dados do instrutor
    const data = await response.text();
    const json = await JSON.parse(data)
    console.error('Dados do instrutor:', ); // Adicione este console.log
    return await json;
  } catch (error) {
    console.error('Erro ao buscar instrutor:', error);
    throw error;
  }
};

export const updateInstrutor = async (cpf: string, data: IUpdateInstrutor) => {
  try {
    const response = await fetch(`http://localhost:3001/instrutor/${cpf}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Resultado da API
  } catch (error) {
    console.error('Erro ao atualizar instrutor:', error);
    throw error; // Repassa o erro para ser tratado onde a função for chamada
  }
};