-- Create enum types for better data consistency
CREATE TYPE public.cliente_status AS ENUM ('novo', 'em_andamento', 'fechado', 'perdido');
CREATE TYPE public.interacao_canal AS ENUM ('whatsapp', 'email', 'telefone', 'chat', 'presencial');
CREATE TYPE public.tarefa_status AS ENUM ('pendente', 'em_andamento', 'concluida', 'cancelada');
CREATE TYPE public.cargo_usuario AS ENUM ('admin', 'vendedor', 'supervisor', 'atendente');
CREATE TYPE public.tipo_autenticacao AS ENUM ('api_key', 'bearer_token', 'basic_auth', 'oauth');

-- Create clientes table
CREATE TABLE public.clientes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    cpf TEXT UNIQUE,
    status cliente_status NOT NULL DEFAULT 'novo',
    tags TEXT[],
    origem TEXT,
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usuarios table
CREATE TABLE public.usuarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    cargo cargo_usuario NOT NULL DEFAULT 'atendente',
    login TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interacoes table
CREATE TABLE public.interacoes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    usuario_id UUID REFERENCES public.usuarios(id),
    canal interacao_canal NOT NULL,
    mensagem TEXT NOT NULL,
    resposta TEXT,
    data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tarefas table
CREATE TABLE public.tarefas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    usuario_id UUID REFERENCES public.usuarios(id),
    descricao TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    status tarefa_status NOT NULL DEFAULT 'pendente',
    data_limite TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create apis_conectadas table
CREATE TABLE public.apis_conectadas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_api TEXT NOT NULL,
    descricao TEXT,
    url_base TEXT NOT NULL,
    tipo_autenticacao tipo_autenticacao NOT NULL,
    chave_token TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apis_conectadas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clientes
CREATE POLICY "Users can view all clientes" 
ON public.clientes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create clientes" 
ON public.clientes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update clientes" 
ON public.clientes 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete clientes" 
ON public.clientes 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for usuarios
CREATE POLICY "Users can view all usuarios" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create their own profile" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update all usuarios" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for interacoes
CREATE POLICY "Users can view all interacoes" 
ON public.interacoes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create interacoes" 
ON public.interacoes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update interacoes" 
ON public.interacoes 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for tarefas
CREATE POLICY "Users can view all tarefas" 
ON public.tarefas 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create tarefas" 
ON public.tarefas 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update tarefas" 
ON public.tarefas 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete tarefas" 
ON public.tarefas 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for apis_conectadas
CREATE POLICY "Users can view all apis_conectadas" 
ON public.apis_conectadas 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create apis_conectadas" 
ON public.apis_conectadas 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update apis_conectadas" 
ON public.apis_conectadas 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete apis_conectadas" 
ON public.apis_conectadas 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tarefas_updated_at
    BEFORE UPDATE ON public.tarefas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_apis_conectadas_updated_at
    BEFORE UPDATE ON public.apis_conectadas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_clientes_status ON public.clientes(status);
CREATE INDEX idx_clientes_data_cadastro ON public.clientes(data_cadastro);
CREATE INDEX idx_interacoes_cliente_id ON public.interacoes(cliente_id);
CREATE INDEX idx_interacoes_data ON public.interacoes(data);
CREATE INDEX idx_tarefas_cliente_id ON public.tarefas(cliente_id);
CREATE INDEX idx_tarefas_status ON public.tarefas(status);
CREATE INDEX idx_tarefas_data_limite ON public.tarefas(data_limite);