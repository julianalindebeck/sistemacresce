export class Turma{
    nomeTurma: string;
    capacidade: number;
    alunos: string[] = [];
    anoSerie: string;
    disciplinas: string[] = [];
    turno: string;
    //professores: string[] = [];

    constructor(nomeTurma: string, capacidade: number, anoSerie: string, turno: string){
        this.nomeTurma = nomeTurma;
        this.capacidade = capacidade;
        this.anoSerie = anoSerie;
        this.turno = turno;
    }
}