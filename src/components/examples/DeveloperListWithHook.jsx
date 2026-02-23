import { useEffect } from 'react';
import { useCrud } from '../../hooks/useApi';
import developerService from '../../services/developerService';

/**
 * Exemplo de componente que usa o hook useCrud
 * Mais limpo e reutilizável
 */
export function DeveloperListWithHook() {
  const { items: developers, loading, error, readAll, create, update, delete: deleteDev } = useCrud(developerService);

  // Carregar dados ao montar
  useEffect(() => {
    readAll();
  }, [readAll]);

  const handleCreate = async () => {
    const name = prompt('Nome:');
    const email = prompt('Email:');
    const dateOfBirth = prompt('Data de Nascimento (YYYY-MM-DD):');

    if (name && email && dateOfBirth) {
      try {
        await create({ name, email, dateOfBirth });
        alert('Desenvolvedor criado com sucesso!');
      } catch (err) {
        alert('Erro ao criar: ' + err.message);
      }
    }
  };

  const handleUpdate = async (id) => {
    const name = prompt('Novo nome:');
    if (name) {
      try {
        await update(id, { name });
        alert('Desenvolvedor atualizado!');
      } catch (err) {
        alert('Erro ao atualizar: ' + err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await deleteDev(id);
        alert('Desenvolvedor deletado!');
      } catch (err) {
        alert('Erro ao deletar: ' + err.message);
      }
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Desenvolvedores</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Novo
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid gap-4">
        {developers.map(dev => (
          <div key={dev.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{dev.name}</h3>
            <p className="text-gray-600">{dev.email}</p>
            <p className="text-sm text-gray-500">{dev.dateOfBirth}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleUpdate(dev.id)}
                className="text-blue-500 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(dev.id)}
                className="text-red-500 hover:underline"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeveloperListWithHook;
