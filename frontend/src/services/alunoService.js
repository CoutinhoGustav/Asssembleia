import { request } from './api.js';

export const alunoService = {
  create: async (data) => {
    const response = await request({
      method: 'POST',
      url: '/alunos',
      data,
    });
    return response.data;
  },

  findAll: async () => {
    const response = await request({
      method: 'GET',
      url: '/alunos',
    });
    return response.data;
  },

  findOne: async (id) => {
    const response = await request({
      method: 'GET',
      url: `/alunos/${id}`,
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await request({
      method: 'PATCH',
      url: `/alunos/${id}`,
      data,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await request({
      method: 'DELETE',
      url: `/alunos/${id}`,
    });
    return response.data;
  },
};

export default alunoService;
