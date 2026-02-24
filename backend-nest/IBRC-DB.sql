-- Habilitar extensão para gerar UUIDs (opcional, mas recomendado)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Tabela de Admins
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tabela de Alunos (Students)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    registered_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Tabela de Chamadas (Attendances)
CREATE TABLE attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent')),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    recorded_by VARCHAR(255) NOT NULL
);
-- Tabela de Relatórios (Reports)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    present_students JSONB, -- Armazena a lista como JSON (semelhante ao MongoDB)
    absent_students JSONB,
    total_present INTEGER,
    total_absent INTEGER,
    recorded_by VARCHAR(255),
    assembly_name VARCHAR(255) DEFAULT 'Chamada Geral'
);
-- Tabela de Status do Sistema
CREATE TABLE system_status (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    is_call_active BOOLEAN DEFAULT FALSE
);