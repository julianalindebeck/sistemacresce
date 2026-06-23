import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EscolasService {
    private url = 'http://localhost:3001/escolas';

    async findAll() {
        try {
            const response = await axios.get(this.url);
            return response.data;
        } catch (error: any) {
            console.log('ERRO ESCOLAS');
            console.log(error.response?.status);
            console.log(error.response?.data);
            console.log(error.message);
            throw error;
        }
    }

    async remove(id: string) {
        const response = await axios.delete(`${this.url}/${id}`);
        return response.data;
    }
}