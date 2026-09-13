#!/usr/bin/env bash
# Stop hook. Quando o agente tenta encerrar o turno, roda npm test.
# Falhou? exit 2 => o Claude NÃO para e recebe o motivo no stderr (loop até verde).
# Três freios:
#   1. plan mode: planejar não é implementar; sai 0 sem rodar teste (os testes podem estar vermelhos de propósito).
#   2. circuit breaker: no máximo MAX_VOLTAS bloqueios seguidos; depois devolve para o humano.
#   3. stop_hook_active: false = primeira tentativa de parar deste turno, então o contador zera.
#      (O próprio Claude Code corta depois de 8 bloqueios seguidos; o nosso freio vem antes.)
set -uo pipefail

MAX_VOLTAS="${MAX_VOLTAS:-3}"

# stdin: {"hook_event_name":"Stop","permission_mode":"plan|default|acceptEdits|...","stop_hook_active":false,...}
read -r MODO ATIVO < <(node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{let j={};try{j=JSON.parse(d)}catch{};process.stdout.write(`${j.permission_mode??"default"} ${j.stop_hook_active===true}\n`)})')

if [ "$MODO" = "plan" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
COUNT_FILE=".claude/.loop-count"
mkdir -p .claude

if [ "$ATIVO" != "true" ]; then
  rm -f "$COUNT_FILE"
fi

OUT="$(npm test --silent 2>&1)"
STATUS=$?

if [ $STATUS -eq 0 ]; then
  rm -f "$COUNT_FILE"
  exit 0
fi

N=$(( $(cat "$COUNT_FILE" 2>/dev/null || echo 0) + 1 ))

if [ "$N" -gt "$MAX_VOLTAS" ]; then
  rm -f "$COUNT_FILE"
  echo "stop-gate: circuit breaker depois de $MAX_VOLTAS voltas. npm test ainda falha; devolvendo para o humano." >&2
  exit 0
fi

echo "$N" > "$COUNT_FILE"
echo "stop-gate: volta $N/$MAX_VOLTAS. npm test ainda falha. Não encerre: corrija e rode npm test de novo." >&2
printf '%s\n' "$OUT" | grep -E "FAIL|×|✗|Error|error TS|expected|Received|Expected|Test Files|Tests " | head -n 25 >&2
exit 2
