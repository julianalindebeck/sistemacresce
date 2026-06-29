import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Avisos } from '../classes/Avisos';

@Injectable()
export class AvisosService {
    private url = 'http://localhost:3001/avisos';

    async create(aviso: any) {
        const { escolaId, ...dadosFormulario } = aviso;

        const response = await axios.get(this.url);
        const avisos = response.data;

        const maiorId =
            avisos.length > 0 ? Math.max(...avisos.map((a: any) => Number(a.id))) : 0;

        const payload = {
            id: maiorId + 1,
            publico: dadosFormulario.publico,
            tipoAviso: dadosFormulario.tipoAviso,
            tituloAviso: dadosFormulario.tituloAviso,
            descricao: dadosFormulario.descricao,
            dataCriacao: new Date(),
        };

        const novo = await axios.post(this.url, payload);

        if (escolaId) {
            const escolaUrl = `http://localhost:3001/escolas/${escolaId}`;
            const escolaResponse = await axios.get(escolaUrl);
            const escolaDados = { ...escolaResponse.data };
    
            escolaDados.avisos = escolaDados.avisos || [];
            escolaDados.avisos.push(payload.dataCriacao); 
    
            await axios.put(escolaUrl, escolaDados);
        }

        return novo.data;
    }

    async findAll() {
        try {
            const response = await axios.get(this.url);
            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao buscar avisos.');
        }
    }

    async findOne(id: string) {
        try {
            const response = await axios.get(`${this.url}/${id}`);
            return response.data;
        } catch (error) {
            throw new NotFoundException('Aviso não encontrado.');
        }
    }
}