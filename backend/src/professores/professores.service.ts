import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { initCounter, getNextId } from '../utils/id-manager';
import { Professor } from '../classes/Professor';

@Injectable()
export class ProfessoresService {
    private url = 'http://localhost:3001/professores';
    
    constructor() {
        this.initCounter();
    }
    private async initCounter() {
        const response = await axios.get<Professor[]>(this.url);
        const professores = response.data;

        const maxId =
            professores.length > 0
            ? Math.max(...professores.map(p => p.id))
            : 0;
        initCounter('professores', maxId);
    }
    
    async findAll() {
        const response = await axios.get(this.url);
        return response.data;
    }
    async create(data: any) {
    const novoProfessor = {
        ...data,
        id: getNextId('professores'),
    };
    delete novoProfessor.id;
    const response = await axios.post(this.url, novoProfessor);
        return response.data;
    }
    
    async findOne(id: number) {
        const response = await axios.get(`${this.url}/${id}`);
        return response.data;
    }
    
    async update(id: number, data: any) {
        const response = await axios.put(`${this.url}/${id}`, data);
        return response.data;
    }
    
    async remove(id: number) {
        await axios.delete(`${this.url}/${id}`);
        return { message: 'Professor removido' };
    }
}