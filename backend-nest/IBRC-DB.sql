-- Habilitar IDs automáticos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Limpar tabelas para novo fluxo
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Aluno" CASCADE;
DROP TABLE IF EXISTS "Turma" CASCADE;
DROP TABLE IF EXISTS "Developer" CASCADE;

-- Criar Tabela de Usuários (com Controle de Acesso)
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    avatar TEXT DEFAULT 'https://ui-avatars.com/api/?name=Admin+IBRC',
    role VARCHAR(50) DEFAULT 'user',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Demais tabelas (Aluno e Turma)
CREATE TABLE "Aluno" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    turma VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Turma" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    turma VARCHAR(255),
    professor VARCHAR(255),
    data TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    presentes INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    visitantes TEXT DEFAULT '-',
    present_students JSONB,
    absent_students JSONB
);