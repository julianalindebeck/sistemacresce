export interface Frequencia {
    id?: string;
    turmaId: string;
    data: string;
    chamada: {
        alunoId: string;
        presente: boolean;
    }[];
}