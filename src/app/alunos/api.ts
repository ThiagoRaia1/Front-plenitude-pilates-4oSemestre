export interface ICreateAluno {
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

export interface IAluno {
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

export const callCreate = async (data: ICreateAluno): Promise<ICreateAluno> => {
  const response = await fetch('http://localhost:3001/alunos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (response.ok) {

  } else {
    throw new Error(`Erro ao criar aluno: ${response.statusText}`);
  }

  return await response.json()
}

export const getTodos = async (): Promise<IAluno[]> => {
  const response = await fetch('http://localhost:3001/alunos')
  return await response.json()
}

export const getAluno = async (cpf: string): Promise<any> => {
  // Faz a requisição ao servidor
  try {
    const response = await fetch(`http://localhost:3001/alunos/${cpf}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar aluno: ${response.statusText}`);
    }

    // Retorna os dados do aluno
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    throw error;
  }
};