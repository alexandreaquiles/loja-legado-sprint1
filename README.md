# loja-legado · Projeto prático da Sprint 1

Conecta+ #11 · Engenharia de Software com IA · **Do prompt ao harness: contexto, spec e loop no Claude Code**

Este é o repositório do projeto prático da Sprint 1: a loja da empresa, migrada em 2024 para o [Vendure](https://vendure.io) (framework de e-commerce headless em TypeScript, NestJS e GraphQL) e deixada do jeito que o time deixou: `CLAUDE.md` inchado, pastas com nomes vagos, helpers do sistema antigo, README que manda perguntar ao Fulano. As tarefas estão no board do Trello; na aula ao vivo o professor resolve as tarefas essenciais neste mesmo repositório.

| | |
|---|---|
| Board do projeto (Trello) | https://trello.com/b/9SfihUG4 |
| Curso base na Alura | [Engenharia de software na era da IA: context engineering, workflows e controle de custo](https://cursos.alura.com.br/course/context-engineering-workflows) (10h estimadas) |
| Lançamento | segunda, 21/09/2026 |
| Aula ao vivo | quinta, 01/10/2026, 9h–10h |
| Entrega do Desafio | sexta, 02/10/2026, no Discord da turma |

## Preparar o ambiente

Você precisa de Node.js 22.12 ou mais novo, git e [Claude Code](https://code.claude.com) (com conta Claude Pro ou chave de API). Não precisa de Docker nem de banco de dados: a loja usa SQLite.

```bash
git clone https://github.com/alexandreaquiles/loja-legado-sprint1.git
cd loja-legado-sprint1
npm install       # ~2 minutos e ~800 MB: o Vendure inteiro vem em node_modules
npm run setup     # branches locais, .env (segredos falsos) e vendure.sqlite (54 produtos de exemplo)
npm test          # 5 testes verdes (vitest, cerca de 1 segundo)
npm run conferir  # confere os cards 00 a 04: no começo só o 00 fica todo ✔
npm run dev       # sobe a loja: http://localhost:3000/dashboard (superadmin / superadmin)
claude            # abre o agente na raiz do projeto
```

Com a loja no ar: `http://localhost:3000/dashboard` é o admin, `http://localhost:3000/graphiql` tem o Shop API e o Admin API para consultar. Pare com `Ctrl+C`. Se o `better-sqlite3` não compilar na sua máquina, avise no Discord: há um plano B com `sql.js`.

## As tarefas

Copie o board do Trello para a sua conta e mova os cards. Resumo:

| # | tarefa | etiqueta |
|---|---|---|
| 00 | Preparar o ambiente | Essencial |
| 01 | Sentir o problema: pedido vago com o `CLAUDE.md` inchado, medindo contexto e custo estimado (statusline e `/context`) | Essencial |
| 02 | Harness: `CLAUDE.md` enxuto (até 1.500 tokens estimados) com as regras no `AGENTS.md`, hooks que bloqueiam e que testam, subagente `revisor-codigo` | Essencial |
| 03 | Spec e plano: `SPEC.md` do cupom com teto, `docs/plano.md` e `test/cupom.test.ts` como critério de aceite | Essencial |
| 04 | Loop: implementar `src/plugins/cupons/` com o loop fechado e comparar com o card 01 | Essencial |
| 05 | Intermediária: spec de 5 linhas para o cupom de frete grátis (feito na aula ao vivo) | Intermediária |
| 06 | Desafio em 3 níveis, no seu repositório ou no `loja-legado` | Desafio |

Cada card termina com `npm run conferir -- NN` (por exemplo `npm run conferir -- 02`): ✔ feito, ✘ falta, … depende de outro card. É feedback, não nota: nada ali usa LLM nem lê o seu `.env`.

As tarefas essenciais são as que o professor resolve ao vivo na quinta. Tente antes: a aula rende muito mais quando você já esbarrou no problema.

## Branches

- `main`: o estado inicial, como o time deixou.
- `gabarito`: uma solução de referência para os cards 02 a 04 (harness, spec, plano e implementação) e a referência da Intermediária em `docs/intermediaria/`. Vale mais espiar depois de tentar: `git show gabarito:<arquivo>`.

## Como entregar o Desafio

Poste no Discord da turma até a sexta que fecha a sprint, com o template do card "Como entregar" no Trello. Quem terminar antes da aula pode mostrar ao vivo, se der tempo.

## Licença

O Vendure é GPLv3. Este repositório de exercício segue a mesma licença.

## Notas do time anterior

Loja no Vendure. Rodar com `npm run dev`. O dashboard é o antigo admin.

Os helpers de `src/misc/` são do relatório do financeiro, não mexer.

Ver com o Fulano antes de mexer no preco.
