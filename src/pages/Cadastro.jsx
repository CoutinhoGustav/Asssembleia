import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const usuario = {
            nome: nome.trim(),
            email: email.trim(),
            senha: senha,
        };

        // Simulating backend registration by saving to local storage
        localStorage.setItem('usuario', JSON.stringify(usuario));

        alert('Cadastro realizado com sucesso!');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

                {/* Voltar */}
                <Link
                    to="/login"
                    className="absolute top-4 left-4 text-gray-400 hover:text-primary transition"
                    title="Voltar para login"
                >
                    <span className="material-symbols-outlined text-2xl">
                        arrow_back
                    </span>
                </Link>

                <h1 className="text-2xl font-black mb-2 text-center text-gray-800">
                    Cadastro IBRC
                </h1>

                <p className="text-sm text-gray-500 text-center mb-6">
                    Crie sua conta para acessar o sistema
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Nome completo"
                        required
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    />

                    <input
                        type="email"
                        placeholder="E-mail"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        required
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                    />

                    <button
                        type="submit"
                        className="w-full h-11 bg-primary hover:brightness-110 text-white rounded-xl font-bold transition"
                    >
                        Cadastrar
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Já tem conta?{' '}
                    <Link
                        to="/login"
                        className="text-primary font-bold hover:underline"
                    >
                        Entrar
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Cadastro;
