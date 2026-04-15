-- Adicionar coluna para rastrear o tablet/operador que enviou a NC
ALTER TABLE public.nao_conformidades
  ADD COLUMN IF NOT EXISTS terminal_id TEXT DEFAULT NULL;

-- Adicionar flag na tabela chamados para guardar histórico de divergência (peça não recebida)
ALTER TABLE public.chamados
  ADD COLUMN IF NOT EXISTS teve_divergencia BOOLEAN DEFAULT FALSE;
