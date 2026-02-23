import { useState, useEffect } from 'react';
import developerService from '../../services/developerService';

/**
 * Exemplo de componente que usa o Developer Service
 * Demonstra como usar a API integrada com mock/real
 */
export function DeveloperListExample() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar desenvolvedores
  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        setLoading(true);
        const data = await developerService.findAll();
        setDevelopers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDevelopers();
  }, []);

  // Deletar desenvolvedor
  const handleDeleteDeveloper = async (id) => {
    try {
      await developerService.delete(id);
      setDevelopers(developers.filter(dev => dev.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Desenvolvedores</h1>
      <ul>
        {developers.map(dev => (
          <li key={dev.id}>
            {dev.name} ({dev.email})
            <button onClick={() => handleDeleteDeveloper(dev.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeveloperListExample;
