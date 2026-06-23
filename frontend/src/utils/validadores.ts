export function validarTelefone(telefone: string) {
    return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone);
}

export function validarCPF(cpf: string) {
    return /^\d{11}$/.test(cpf.replace(/\D/g, ""));
}

export function validarCNPJ(cnpj: string) {
    return /^\d{14}$/.test(cnpj.replace(/\D/g, ""));
}

export function validarDataNascimento(data: string): boolean {
    const apenasNumeros = data.replace(/\D/g, "");

    if (apenasNumeros.length !== 8) return false;

    const dia = Number(apenasNumeros.substring(0, 2));
    const mes = Number(apenasNumeros.substring(2, 4));
    const ano = Number(apenasNumeros.substring(4, 8));

    const dataObj = new Date(ano, mes - 1, dia);

    if (
        dataObj.getFullYear() !== ano ||
        dataObj.getMonth() !== mes - 1 ||
        dataObj.getDate() !== dia
    ) {
        return false;
    }

    const hoje = new Date();
    if (dataObj > hoje) return false;

    return true;
}

export function validarCargaHoraria(cargaHoraria: string) {
    const numero = Number(cargaHoraria);

    return (
        Number.isInteger(numero) &&
        numero >= 0 &&
        numero <= 168
    );
}