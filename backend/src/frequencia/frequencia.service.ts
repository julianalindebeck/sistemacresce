import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Frequencia } from '../classes/Frequencia';

@Injectable()
export class FrequenciaService {
    private url = 'http://localhost:3001/frequencia';

    async findByTurmaEData(turmaId: string, data: string) {
        try {
            const response = await axios.get(`${this.url}?turmaId=${turmaId}&data=${data}`);
            return response.data[0] || null;
        } catch (error) {
            return null;
        }
    }

    async registrarFrequencia(payload: Frequencia) {
        try {
            const { turmaId, data, chamada } = payload;

            const responseExistente = await axios.get(`${this.url}?turmaId=${turmaId}&data=${data}`);
            const frequenciaExistente = responseExistente.data[0];

            if (frequenciaExistente && frequenciaExistente.id) {
                const response = await axios.put(`${this.url}/${frequenciaExistente.id}`, payload);
                return response.data;
            } else {
                const response = await axios.post(this.url, payload);
                return response.data;
            }
        } catch (error: any) {
            console.error('Erro ao registrar frequência:', error.message);
            throw error;
        }
    }
}