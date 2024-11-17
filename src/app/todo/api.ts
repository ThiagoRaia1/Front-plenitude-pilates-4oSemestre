export interface ITodo {
    id: number
    login: string
    senha: string
    nome: string
    status: string
    nivelDeAcesso: number
}
  

export const getTodos = async (): Promise<ITodo[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch('https://plenitude-pilates-4osemestre.onrender.com/usuario', {
        headers: {
        Authorization: `Bearer ${token}` // Adiciona o token no header da requisição
        }
    })
    return await response.json()
}