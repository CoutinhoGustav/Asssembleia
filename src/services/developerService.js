import { request } from './api.js';

export const developerService = {
  create: async (data) => {
    const response = await request({
      method: 'POST',
      url: '/developers',
      data,
    });
    return response.data;
  },

  findAll: async () => {
    const response = await request({
      method: 'GET',
      url: '/developers',
    });
    return response.data;
  },

  findOne: async (id) => {
    const response = await request({
      method: 'GET',
      url: `/developers/${id}`,
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await request({
      method: 'PATCH',
      url: `/developers/${id}`,
      data,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await request({
      method: 'DELETE',
      url: `/developers/${id}`,
    });
    return response.data;
  },
};

export default developerService;
