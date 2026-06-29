export interface Frequencia {
    id?: string;
    turmaId: string;
    disciplinaId: string;
    data: string;
    chamada: Array<{
        alunoId: string;
        presente: boolean;
    }>;
}