export function formataDataBr(data: Date) {
    const dia = data.getUTCDate().toString().padStart(2, '0'); // Garante que o dia tenha 2 dígitos
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); // Ajusta o mês (adiciona 1)
    const ano = data.getUTCFullYear().toString();

    const dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada;
}