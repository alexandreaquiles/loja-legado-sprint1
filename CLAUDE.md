@AGENTS.md

## Claude Code neste repositório

- Hooks em `.claude/settings.json`: `guard.sh` bloqueia comandos da lista "Nunca"; `test-after-edit.sh` roda `npm test` depois de cada Edit/Write em `src/` ou `test/`; `stop-gate.sh` não deixa encerrar com teste vermelho (até 3 voltas; em plan mode não roda). Se um hook devolver erro, leia o motivo e corrija; não tente contornar.
- O `.env` está negado em `permissions.deny`: não tente ler por outro caminho.
- Tarefa com spec: planeje em `docs/plano.md` antes de implementar. Antes de dizer pronto, peça ao subagente `revisor-codigo` para revisar o diff contra a spec.
