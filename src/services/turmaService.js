import { request } from './api.js';

export const turmaService = {
  create: async (data) => {
    const response = await request({
      method: 'POST',
      url: '/turmas',
      data,
    });
    return response.data;
  },

  findAll: async () => {
    const response = await request({
      method: 'GET',
      url: '/turmas',
    });
    return response.data;
  },

  findOne: async (id) => {
    const response = await request({
      method: 'GET',
      url: `/turmas/${id}`,
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await request({
      method: 'PATCH',
      url: `/turmas/${id}`,
      data,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await request({
      method: 'DELETE',
      url: `/turmas/${id}`,
    });
    return response.data;
  },
};

export default turmaService;
