export class Turma{
    nomeTurma: String;
    capacidade: number;
    alunos: string[] = [];
    anoSerie: String;
    disciplinas: string[] = [];
    turno: String;
    //professores: String[] = [];

    constructor(nomeTurma: String, capacidade: number, anoSerie: String, turno: String){
        this.nomeTurma = nomeTurma;
        this.capacidade = capacidade;
        this.anoSerie = anoSerie;
        this.turno = turno;
    }
}