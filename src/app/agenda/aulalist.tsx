import { useState } from 'react';
import { formataDataBr } from '../alunos/page';
import { getAlunoAulas, IAula } from './api';
import { IAlunoAula } from './api';

const AulaList = ({ aulas, onSelectAula }: { aulas: IAula[] | null; onSelectAula: (aula: IAula) => void }) => {
    const [selectedAula, setSelectedAula] = useState<IAula | null>(null);
    const [alunoAulas, setAlunoAulas] = useState<IAlunoAula[] | null>(null);
    const [alunos, setAlunos] = useState<any[]>([]); // Novo estado para armazenar alunos

    const aulasFiltradas = aulas?.filter((aula) => {
        const hoje = new Date();
        const dataAula = new Date(aula.data);
        // Comparar apenas a data (ignorando o horário)
        return dataAula.setHours(0, 0, 0, 0) >= hoje.setHours(0, 0, 0, 0);
    });

    const handleSelectAula = (aula: IAula) => {
        setSelectedAula(aula);

        const fetchTodos = async () => {
            try {
                const data = await getAlunoAulas(aula.id); // Pega todos os alunoaula no id aula passado
                setAlunoAulas(data); // Atualiza o estado com os dados obtidos

                // Extrai os alunos do campo `aluno` de cada `alunoAula`
                const alunosExtraidos = data.map((alunoAula: IAlunoAula) => alunoAula.aluno);
                setAlunos(alunosExtraidos); // Armazena apenas os alunos
            } catch (error: any) {
                if (error.message === 'Not Found') {
                    alert('Não há alunos registrados para essa aula');
                }
            }
        };

        fetchTodos(); // Chama a função fetchTodos
        onSelectAula(aula);
    };

    return (
        <div className="flex flex-col h-screen p-4">
            {/* Lista de Aulas */}
            <div className="flex flex-col bg-gray-100 border border-gray-300 rounded-md shadow-md overflow-y-auto max-h-[60vh] p-4">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Aulas Disponíveis</h2>
                {aulasFiltradas?.map((aula) => (
                    <div
                        key={aula.id}
                        className={`flex flex-col p-4 mb-2 rounded-md border [&_p]:text-black ${selectedAula?.id === aula.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'
                            } hover:bg-gray-50 cursor-pointer`}
                        onClick={() => handleSelectAula(aula)}
                    >
                        <p><strong>Data:</strong> {new Date(aula.data).toLocaleDateString()}</p>
                        <p><strong>Hora de Início:</strong> {new Date(aula.horaComeco).toLocaleTimeString()}</p>
                        <p><strong>Hora de Fim:</strong> {new Date(aula.horaFim).toLocaleTimeString()}</p>
                        <p><strong>Vagas:</strong> {aula.qtdeVagas}</p>
                        <p><strong>Vagas Disponíveis:</strong> {aula.qtdeVagasDisponiveis}</p>
                        <p><strong>Instrutor:</strong> {aula.instrutor.nome}</p>
                    </div>
                ))}


            </div>

            {/* Detalhes da Aula Selecionada */}
            <div className="flex flex-col bg-gray-50 border border-gray-300 rounded-md shadow-md mt-4 p-4">
                <h2 className="text-lg font-bold text-black">
                    Alunos registrados na aula do dia {selectedAula && new Date(selectedAula.data).toLocaleDateString()} às {selectedAula && new Date(selectedAula.horaComeco).toLocaleTimeString()}
                </h2>
                <h2 className="text-lg font-bold text-black mb-4">
                    Instrutor: {selectedAula && selectedAula.instrutor.nome}
                </h2>
                {selectedAula ? (
                    <ul>
                        {alunos && alunos.length > 0 ? (
                            alunos.map((aluno, index) => (
                                <li key={index} className="mb-2 [&_p]:text-black">
                                    <p><strong>ID:</strong> {aluno.id}</p>
                                    <p><strong>Nome:</strong> {aluno.nome}</p>
                                    <p><strong>Data de Nascimento:</strong> {formataDataBr(new Date(aluno.dataNascimento))}</p>
                                    <p><strong>CPF:</strong> {aluno.cpf}</p>
                                </li>
                            ))
                        ) : (
                            <p className="text-black">Nenhum aluno registrado nesta aula.</p>
                        )}
                    </ul>
                ) : (
                    <p className="text-black">Selecione uma aula para ver os detalhes.</p>
                )}
            </div>
        </div>
    );
};

export default AulaList;
