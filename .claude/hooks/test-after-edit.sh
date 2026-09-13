#!/usr/bin/env bash
# PostToolUse (matcher: Edit|Write). Depois que o agente edita src/ ou test/,
# roda a suíte e devolve as falhas para ele (exit 2 = stderr vira feedback).
# É o "fechar o loop" do harness: o agente não precisa lembrar de testar.
set -uo pipefail

INPUT="$(cat)"
FILE="$(printf '%s' "$INPUT" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{process.stdout.write((JSON.parse(d).tool_input||{}).file_path||"")}catch{}})')"

case "$FILE" in
  */src/*|*/test/*) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}"
OUT="$(npm test --silent 2>&1)"
STATUS=$?

if [ $STATUS -ne 0 ]; then
  echo "🔴 npm test falhou após editar $(basename "$FILE"). Corrija antes de seguir:" >&2
  printf '%s\n' "$OUT" | grep -E "FAIL|×|Error|error TS|expected|Received|Expected|Test Files|Tests " | head -n 25 >&2
  exit 2
fi

echo "🟢 npm test verde após editar $(basename "$FILE")."
exit 0
