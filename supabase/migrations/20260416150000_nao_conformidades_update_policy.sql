-- Política para permitir atualização na tabela nao_conformidades
-- Necessária para que a logística mude o status para 'resolucao_pendente_validacao'
-- e o operador mude para 'concluido'.

CREATE POLICY "Permitir atualização de nao_conformidades" ON public.nao_conformidades
  FOR UPDATE USING (true) WITH CHECK (true);
