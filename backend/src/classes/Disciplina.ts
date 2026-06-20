export class Disciplina {
    nome: String;
    codigo: String;
    cargaHorarioSemanal: number;
    areaConhecimento: String;
    descricao: String;
    professor: String;
    nota: number=0;
    frequencia: boolean=true;

    constructor(
        nome: String, codigo: String,cargaHorarioSemanal: number, areaConhecimento: String, descricao: String, professor: String) {
        this.nome = nome;
        this.codigo = codigo;
        this.cargaHorarioSemanal = cargaHorarioSemanal;
        this.areaConhecimento = areaConhecimento;
        this.descricao = descricao;
        this.professor = professor;
    }
}