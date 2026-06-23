import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Disciplina } from '../classes/Disciplina';

@Injectable()
export class DisciplinasService {
  private url = 'http://localhost:3001/disciplinas';

  async findAll() {
    const response = await axios.get(this.url);
    return response.data;
  }

  async create(disciplina: Disciplina) {
    const response = await axios.get(this.url);
    const disciplinas = response.data;

    const maiorId =
      disciplinas.length > 0 ? Math.max(...disciplinas.map((d: any) => Number(d.id))) : 0;

    const payload = {
      id: maiorId + 1,
      nomeDisciplina: disciplina.nome,
      codigo: disciplina.codigo,
      cargaHoraria: disciplina.cargaHorarioSemanal,
      areaConhecimento: disciplina.areaConhecimento,
      descricao: disciplina.descricao,
      professor: disciplina.professor, 
    };

    const novo = await axios.post(this.url, payload);
    return novo.data;
  }

  async findOne(id: number) {
    const response = await axios.get(`${this.url}/${id}`);
    return response.data;
  }

  async update(id: number, data: any) {
    const response = await axios.put(`${this.url}/${id}`, {
      ...data,
      id,
    });
    return response.data;
  }

  async remove(id: number) {
    await axios.delete(`${this.url}/${id}`);
    return { message: 'Disciplina removida' };
  }
}