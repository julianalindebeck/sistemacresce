export function validarTelefone(telefone: string) {
    return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone);
}

export function validarCPF(cpf: string) {
    return /^\d{11}$/.test(cpf.replace(/\D/g, ""));
}

export function validarCNPJ(cnpj: string) {
    return /^\d{14}$/.test(cnpj.replace(/\D/g, ""));
}