#!/usr/bin/env bash
# PostToolUse (matcher: Edit|Write). Depois que o agente edita algo em src/ ou test/,
# roda a suíte e devolve as falhas para ele (exit 2 = o stderr vira feedback para o Claude).
# É o "fechar o loop" do harness: o agente não precisa lembrar de testar.
set -uo pipefail

# stdin: {"tool_name":"Edit","tool_input":{"file_path":"/caminho/absoluto",...},"tool_response":{...},...}
# Usa tool_input.file_path (igual no Edit e no Write); tool_response muda de uma ferramenta para outra.
FILE="$(node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{process.stdout.write(JSON.parse(d).tool_input?.file_path??"")}catch{}})')"

ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"
REL="${FILE#"$ROOT"/}"   # caminho relativo à raiz do projeto (se o arquivo estiver fora, fica absoluto)

case "$REL" in
  src/*|test/*) ;;
  *) exit 0 ;;   # SPEC.md, docs/, CLAUDE.md...: nada a testar
esac

cd "$ROOT" || exit 0
OUT="$(npm test --silent 2>&1)"
STATUS=$?

if [ $STATUS -ne 0 ]; then
  echo "npm test falhou depois de editar $REL. Corrija antes de seguir:" >&2
  printf '%s\n' "$OUT" | grep -E "FAIL|×|✗|Error|error TS|expected|Received|Expected|Test Files|Tests " | head -n 25 >&2
  exit 2
fi

echo "npm test verde depois de editar $REL."
exit 0
