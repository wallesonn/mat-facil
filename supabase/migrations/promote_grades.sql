-- ============================================================
-- AUTO-PROMOÇÃO DE SÉRIE — Executa na virada do ano letivo
-- Avança todos os alunos para a próxima série.
-- Alunos do 3º ano EM ficam como estão (formados).
-- ============================================================

-- Habilita pg_cron (já disponível no Supabase)
create extension if not exists pg_cron;

-- Função de promoção
create or replace function public.promote_student_grades()
returns void
language plpgsql
security definer
as $$
begin
  -- Promove cada série na ordem reversa para evitar conflitos
  update public.profiles set grade = '3º ano EM' where grade = '2º ano EM' and role = 'student';
  update public.profiles set grade = '2º ano EM' where grade = '1º ano EM' and role = 'student';
  update public.profiles set grade = '1º ano EM' where grade = '9º ano'    and role = 'student';
  update public.profiles set grade = '9º ano'    where grade = '8º ano'    and role = 'student';
  update public.profiles set grade = '8º ano'    where grade = '7º ano'    and role = 'student';
  update public.profiles set grade = '7º ano'    where grade = '6º ano'    and role = 'student';

  raise notice 'Grade promotion completed at %', now();
end;
$$;

comment on function public.promote_student_grades() is 'Promove todos os alunos para a próxima série. Executar na virada do ano letivo (janeiro/fevereiro).';

-- Agenda execução automática: 1º de fevereiro às 00:00 (horário UTC)
-- Ajuste o mês/dia conforme o calendário escolar
select cron.schedule(
  'promote-student-grades',      -- nome do job
  '0 3 1 2 *',                   -- cron: 1º de fevereiro às 03:00 UTC (00:00 BRT)
  $$select public.promote_student_grades()$$
);
