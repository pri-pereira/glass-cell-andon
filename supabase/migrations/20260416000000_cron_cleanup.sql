-- Habilitar o pg_cron para automação de tarefas
-- Nota: Certifique-se de que a extensão está habilitada no Dashboard do Supabase (Database -> Extensions)

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Agendar a limpeza para rodar todo dia às 03:00 da manhã (horário de Brasília aprox.)
-- O cron usa UTC, então 06:00 UTC = 03:00 BRT
SELECT cron.schedule(
    'cleanup-old-tasks',
    '0 6 * * *',
    $$
    UPDATE public.chamados
    SET status = 'arquivado'
    WHERE created_at < NOW() - INTERVAL '24 hours'
    AND status NOT IN ('concluido', 'arquivado');
    
    UPDATE public.nao_conformidades
    SET status = 'arquivado'
    WHERE created_at < NOW() - INTERVAL '24 hours'
    AND status NOT IN ('concluido', 'arquivado');
    $$
);
