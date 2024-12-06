import { IAluno } from "../alunos/api"
import { IInstrutor } from "../equipe/api"

export interface ICreateAula {
  data: Date
  horaComeco: Date
  horaFim: Date
  qtdeVagas: number
  qtdeVagasDisponiveis: number
  status: string
  instrutor: number
}

export const callCreateAula = async (data: ICreateAula): Promise<ICreateAula> => {
  const response = await fetch('https://plenitude-pilates-4osemestre.onrender.com/aula', {
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

export interface ICreateAlunoAula {
  aluno: IAluno
  aula: IAula
  tipoDeAula: string
}

export const callCreateAlunoAula = async (data: ICreateAlunoAula): Promise<ICreateAlunoAula> => {
  const response = await fetch('https://plenitude-pilates-4osemestre.onrender.com/alunoaula', {
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

export interface IAula {
  id: number
  data: Date
  horaComeco: Date
  horaFim: Date
  qtdeVagas: number
  qtdeVagasDisponiveis: number
  status: string
  instrutor: IInstrutor
  alunos: IAluno[]
}

export const getAulas = async (): Promise<IAula[]> => {
  const response = await fetch('https://plenitude-pilates-4osemestre.onrender.com/aula')
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json()
}

export interface IAlunoAula {
  id: number
  aluno: number
  instrutor: number
}

export const getAlunoAulas = async (id: number): Promise<IAlunoAula[]> => {
  // Faz a requisição ao servidor
  try {
    const response = await fetch(`https://plenitude-pilates-4osemestre.onrender.com/alunoaula/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // Retorna os dados do aula
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getAula = async (horaComeco: Date): Promise<any> => {
  // Faz a requisição ao servidor
  try {
    const response = await fetch(`https://plenitude-pilates-4osemestre.onrender.com/aula/${horaComeco}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Not Found");
    }

    // Retorna os dados do aula
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export interface IUpdateAula {
  qtdeVagasDisponiveis: number
}

export const updateAula = async (id: number, data: IUpdateAula) => {
  try {
    const response = await fetch(`https://plenitude-pilates-4osemestre.onrender.com/aula/${id}`, {
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
    console.error('Erro ao atualizar aula:', error);
    throw error; // Repassa o erro para ser tratado onde a função for chamada
  }
};

export const verificaAlunoAula = async (alunoId: number, aulaId: number): Promise<boolean> => {
  try {
    const response = await fetch(`https://plenitude-pilates-4osemestre.onrender.com/alunoaula/verifica`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aluno: alunoId, aula: aulaId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar aluno e aula');
    }

    const data = await response.json();
    return data.existe; // Retorna true se existir, false caso contrário
  } catch (error) {
    console.error('Erro na verificação:', error);
    throw error;
  }
};