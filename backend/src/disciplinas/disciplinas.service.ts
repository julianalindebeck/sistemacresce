import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Disciplina } from '../classes/Disciplina';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class DisciplinasService {
  private url = 'http://localhost:3001/disciplinas';

  async findAll() {
    const response = await axios.get(this.url);
    return response.data;
  }

  async create(disciplina: any) {
    const { escolaId, ...dadosFormulario } = disciplina;
    const response = await axios.get(this.url);
    const disciplinas = response.data;

    const maiorId =
      disciplinas.length > 0 ? Math.max(...disciplinas.map((d: any) => Number(d.id))) : 0;

    const payload = {
      id: maiorId + 1,
      nomeDisciplina: dadosFormulario.nomeDisciplina, 
      codigo: dadosFormulario.codigo,
      cargaHoraria: dadosFormulario.cargaHoraria, 
      areaConhecimento: dadosFormulario.areaConhecimento,
      descricao: dadosFormulario.descricao,
      professorId: dadosFormulario.professorId, 
    };

    const novo = await axios.post(this.url, payload);

    if (escolaId) {
      const escolaUrl = `http://localhost:3001/escolas/${escolaId}`;
      const escolaResponse = await axios.get(escolaUrl);
      const escolaDados = { ...escolaResponse.data };

      escolaDados.disciplinas = escolaDados.disciplinas || [];
      escolaDados.disciplinas.push(payload.codigo); 

      await axios.put(escolaUrl, escolaDados);
    }

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

  async remove(id: string, escolaId?: string) {
    const disciplinaResponse = await axios.get(`${this.url}/${id}`);
    const disciplina = disciplinaResponse.data;
    const turmas = await axios.get("http://localhost:3001/turmas");

    const disciplinaEmUso = turmas.data.some((turma: any) =>
        turma.disciplinas.includes(id)
    );

    if (disciplinaEmUso) {
        throw new ConflictException(
            "Disciplina está sendo dada em turma(s)."
        );
    }

    if (escolaId) {
      const escolaUrl = `http://localhost:3001/escolas/${escolaId}`;
      const escolaResponse = await axios.get(escolaUrl);
      const escolaData = { ...escolaResponse.data };

      if (escolaData.disciplinas) {
          escolaData.disciplinas = escolaData.disciplinas.filter((codigo: string) => codigo !== disciplina.codigo);
          await axios.put(escolaUrl, escolaData);
      }
    }

    await axios.delete(`${this.url}/${id}`);
    return { message: 'Disciplina removida' };
  }
}