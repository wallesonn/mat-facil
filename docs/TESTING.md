# Testes — MAT Fácil

## Status Atual

A plataforma ainda não possui testes automatizados configurados. Este documento serve como guia para implementação futura.

## Testes Planejados

### Unitários
- Funções de gamificação (cálculo de nível, XP)
- Funções de geometria (ray-casting, classificação de células)
- Helpers e utilitários

### Integração
- Fluxo de autenticação (login, cadastro, logout)
- CRUD de matérias, assuntos e aulas
- Conclusão de aula e ganho de XP

### E2E (End-to-End)
- Fluxo completo do aluno: cadastro → login → navegar → concluir aula
- Fluxo admin: login → criar matéria → criar assunto → criar aula
- Canvas interativo: desenhar forma → ajustar malha → verificar cálculo

## Ferramentas Recomendadas

| Tipo | Ferramenta |
|------|------------|
| Unitário | Vitest |
| Componente | React Testing Library |
| E2E | Playwright |

## Testes Manuais (Checklist)

### Autenticação
- [ ] Cadastro com nome, email, senha e série
- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas (mensagem de erro)
- [ ] Recuperação de senha
- [ ] Logout

### Dashboard
- [ ] Exibe nome, nível e XP corretos
- [ ] Barra de progresso atualiza após ganho de XP

### Perfil
- [ ] Editar nome e série
- [ ] Alterar senha
- [ ] Email não editável

### Conteúdo Interativo
- [ ] Desenhar forma no canvas (mouse)
- [ ] Desenhar forma no canvas (touch/mobile)
- [ ] Auto-fechamento da forma
- [ ] Slider de quadrículas funciona
- [ ] Campo de lado do quadrinho aceita decimais
- [ ] Seletor de unidade (mm, cm, m) muda o resultado
- [ ] Resultado da área calculado corretamente
- [ ] Botão "Concluir aula" ganha XP

### Admin
- [ ] CRUD matérias
- [ ] CRUD assuntos (com série)
- [ ] CRUD aulas
- [ ] Filtro por série nos assuntos
- [ ] Lista de alunos com filtro por série
- [ ] Busca por nome/email

### Responsividade
- [ ] Landing page em mobile
- [ ] Dashboard em mobile
- [ ] Canvas interativo em mobile
- [ ] Admin em mobile (sidebar oculto)
