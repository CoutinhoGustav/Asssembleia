import axios from 'axios';

/**
 * Serviço para integração com a API ViaCEP
 * Documentação: https://viacep.com.br/
 */
const cepService = {
    /**
     * Busca dados de endereço através do CEP
     * @param {string} cep - O CEP a ser buscado (apenas números ou com hífen)
     * @returns {Promise<Object>} - Dados do endereço ou objeto com erro
     */
    buscarCep: async (cep) => {
        try {
            // Remove caracteres não numéricos para garantir a formatação correta
            const cleanCep = cep.replace(/\D/g, '');

            if (cleanCep.length !== 8) {
                throw new Error('Formato de CEP inválido. Deve conter 8 dígitos.');
            }

            // IMPORTANTE: Aqui usamos o axios diretamente para evitar a baseURL
            // configurada no nosso apiClient global (que aponta para o nosso próprio backend)
            const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);

            // A API ViaCEP retorna 200 OK mesmo quando o CEP não existe, 
            // mas inclui um campo 'erro: true' no JSON.
            if (response.data.erro) {
                return { erro: true, mensagem: 'CEP não encontrado.' };
            }

            return response.data;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            return {
                erro: true,
                mensagem: error.message || 'Falha na conexão com o serviço de CEP.'
            };
        }
    }
};

export default cepService;
