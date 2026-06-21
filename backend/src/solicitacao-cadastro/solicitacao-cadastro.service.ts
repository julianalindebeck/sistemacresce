import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SolicitacaoCadastro } from '../classes/SolicitacaoCadastro';

@Injectable()
export class SolicitacaoCadastroService {
    private url = 'http://localhost:3001/solicitacoesCadastro';
    
    async create(data: SolicitacaoCadastro) {
        const { id, ...cleanData } = data;

        const payload = {
            ...cleanData,
            status: 'PENDENTE',
            dataSolicitacao: new Date(),
        };
        const response = await axios.post(this.url, payload);
        return response.data;
    }
    
    async findAll() {
        const response = await axios.get(this.url);
        return response.data;
    }

    async findOne(id: number) {
        const response = await axios.get(`${this.url}/${id}`);
        return response.data;
    }
}