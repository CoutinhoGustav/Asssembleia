import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar requisições à API
 * Abstraindo loading, error e retry
 * 
 * Uso:
 * const { data, loading, error, execute } = useApiCall(developerService.findAll);
 */
export function useApiCall(apiFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Hook para gerenciar CRUD (Create, Read, Update, Delete)
 * 
 * Uso:
 * const { items, loading, error, create, update, delete: deleteItem } = useCrud(developerService);
 */
export function useCrud(service, initialData = []) {
  const [items, setItems] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const newItem = await service.create(data);
      setItems([...items, newItem]);
      return newItem;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, service]);

  const read = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const item = await service.findOne(id);
      return item;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const readAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.findAll();
      setItems(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao listar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const update = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await service.update(id, data);
      setItems(items.map(item => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, service]);

  const deleteItem = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await service.delete(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao deletar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, service]);

  const reset = useCallback(() => {
    setItems(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    items,
    loading,
    error,
    create,
    read,
    readAll,
    update,
    delete: deleteItem,
    reset,
  };
}

export default { useApiCall, useCrud };
