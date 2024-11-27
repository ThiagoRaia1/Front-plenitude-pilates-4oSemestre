export interface ILoginRequest {
  email: string
  password: string
}

export interface ILoginResponse {
  token: string
}

export interface IUsuario {
  id: number
  login: string
  senha: string
  nome: string
  status: string
  nivelDeAcesso: number
}

export const login = async (data: ILoginRequest): Promise<ILoginResponse> => {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const text = await response.text();
  const json = await JSON.parse(text);
  return { token: json.access_token }; // Retorna o token desestruturado
};

export const getDadosUsuarioLogado = async (data: ILoginRequest): Promise<IUsuario> => {
  const response = await fetch('http://localhost:3001/auth/getDadosUsuarioLogado', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const text = await response.text();
  const json = await JSON.parse(text);
  return json; // Retorna os dados do usuario
};