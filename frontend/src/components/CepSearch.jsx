import React, { useState } from 'react';
import cepService from '../services/cepService';

/**
 * Componente de Busca de CEP
 * Demonstra a integração com API REST externa (ViaCEP)
 */
const CepSearch = () => {
    const [cep, setCep] = useState('');
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!cep) return;

        setLoading(true);
        setError('');
        setAddress(null);

        const result = await cepService.buscarCep(cep);

        if (result.erro) {
            setError(result.mensagem);
        } else {
            setAddress(result);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="p-2 bg-amber-500/20 rounded-lg">📍</span>
                Consulta de Endereço (ViaCEP)
            </h2>

            <form onSubmit={handleSearch} className="space-y-4">
                <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-300 mb-1">
                        Digite o CEP
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="cep"
                            type="text"
                            placeholder="00000-000"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold px-6 py-2 rounded-xl transition-all shadow-lg shadow-amber-500/20"
                        >
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {address && (
                <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div>
                            <span className="text-xs text-gray-400 uppercase font-semibold">Logradouro</span>
                            <p className="text-white">{address.logradouro || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-gray-400 uppercase font-semibold">Bairro</span>
                                <p className="text-white">{address.bairro || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase font-semibold">Localidade/UF</span>
                                <p className="text-white">{address.localidade} - {address.uf}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-gray-500 text-center uppercase tracking-widest">
                Exemplo Prático de API REST & JSON
            </div>
        </div>
    );
};

export default CepSearch;
