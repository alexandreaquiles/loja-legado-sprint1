#!/usr/bin/env bash
# Stop hook. Quando o agente tenta encerrar, roda npm test.
# Falhou? exit 2 => o Claude NÃO para e recebe o motivo (loop até verde).
# Circuit breaker: no máximo MAX_VOLTAS tentativas, para não virar loop infinito.
set -uo pipefail

MAX_VOLTAS="${MAX_VOLTAS:-3}"
cd "${CLAUDE_PROJECT_DIR:-.}"
COUNT_FILE=".claude/.loop-count"

OUT="$(npm test --silent 2>&1)"
STATUS=$?

if [ $STATUS -eq 0 ]; then
  rm -f "$COUNT_FILE"
  echo "🟢 stop-gate: npm test verde, pode encerrar."
  exit 0
fi

N=$(( $(cat "$COUNT_FILE" 2>/dev/null || echo 0) + 1 ))
echo "$N" > "$COUNT_FILE"

if [ "$N" -gt "$MAX_VOLTAS" ]; then
  rm -f "$COUNT_FILE"
  echo "⚠️  stop-gate: circuit breaker após $MAX_VOLTAS voltas. Testes ainda falham; devolvendo para o humano." >&2
  exit 0
fi

echo "🔁 stop-gate: volta $N/$MAX_VOLTAS. npm test ainda falha. Não encerre: corrija e rode npm test de novo." >&2
printf '%s\n' "$OUT" | grep -E "FAIL|×|Error|error TS|expected|Received|Expected|Test Files|Tests " | head -n 25 >&2
exit 2
