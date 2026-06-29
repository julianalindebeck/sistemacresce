export interface Nota {
    id?: string;
    turmaId: string;
    alunoId: string;
    disciplina: string;
    bim1: number | null;
    bim2: number | null;
    bim3: number | null;
    bim4: number | null;
}