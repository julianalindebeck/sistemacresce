export class Disciplina {
    nome: string;
    codigo: string;
    cargaHorarioSemanal: number;
    areaConhecimento: string;
    descricao: string;
    professor: string;
    // nota: number=0;
    // frequencia: boolean=true;

    constructor(
        nome: string, codigo: string,cargaHorarioSemanal: number, areaConhecimento: string, descricao: string, professor: string) {
        this.nome = nome;
        this.codigo = codigo;
        this.cargaHorarioSemanal = cargaHorarioSemanal;
        this.areaConhecimento = areaConhecimento;
        this.descricao = descricao;
        this.professor = professor;
    }
}