#!/usr/bin/env bash
# PreToolUse (matcher: Bash). Bloqueia comandos que o CLAUDE.md diz "nunca".
# Exit 2 = bloqueia a ferramenta e devolve o stderr para o Claude ler.
set -euo pipefail

INPUT="$(cat)"
CMD="$(printf '%s' "$INPUT" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{process.stdout.write((JSON.parse(d).tool_input||{}).command||"")}catch{}})')"

bloquear() {
  echo "🛑 guard.sh bloqueou: $CMD" >&2
  echo "Motivo: $1. Veja a seção 'Nunca' do CLAUDE.md e escolha outro caminho." >&2
  exit 2
}

case "$CMD" in
  *"rm -rf"*|*"rm -fr"*)                     bloquear "remoção recursiva" ;;
  *"git push"*"--force"*|*"git push -f"*)    bloquear "push forçado" ;;
  *"git reset --hard"*)                      bloquear "reset destrutivo" ;;
  *"npm install"*|*"npm i "*|*"npm add"*|*"yarn add"*|*"pnpm add"*) bloquear "instalar dependência sem confirmar" ;;
  *".env"*)                                  bloquear "acesso a segredos (.env)" ;;
  *"vendure.sqlite"*|*"migration"*|*"synchronize"*) bloquear "mexer no banco (vendure.sqlite, migrations)" ;;
esac

exit 0
