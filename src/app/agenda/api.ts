import { IAluno } from "../alunos/api"

export interface ICreateAula {
  data: Date
  horaComeco: Date
  horaFim: Date
  qtdeVagas: number
  qtdeVagasDisponiveis: number
  status: string
  instrutor: number
}

export interface IAula {
  id: number
  data: Date
  horaComeco: Date
  horaFim: Date
  qtdeVagas: number
  qtdeVagasDisponiveis: number
  status: string
  instrutor: number
}

export interface ICreateAlunoAula {
  aluno: IAluno
  aula: IAula
}

export const callCreateAula = async (data: ICreateAula): Promise<ICreateAula> => {
  const response = await fetch('http://localhost:3001/aula', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Erro ao criar aula: ${response.statusText}`);
  }

  return await response.json()
}

export const callCreateAlunoAula = async (data: ICreateAlunoAula): Promise<ICreateAlunoAula> => {
  const response = await fetch('http://localhost:3001/alunoaula', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Erro ao criar aula: ${response.statusText}`);
  }

  return await response.json()
}

export const getAula = async (horaComeco: Date): Promise<any> => {
  // Faz a requisição ao servidor
  try {
    const response = await fetch(`http://localhost:3001/aula/${horaComeco}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar aula: ${response.statusText}`);
    }

    // Retorna os dados do aula
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar aula:', error);
    throw error;
  }
};