#!/usr/bin/env bash
# PreToolUse (matcher: Bash). Complementa o permissions.deny do settings.json.
# O deny já barra Read/Edit/Write do .env e `cat/head/tail/sed .env`; ele NÃO pega
# `grep -r` na raiz, `node -e`/`python -c` lendo o .env, nem comandos destrutivos.
# Exit 2 = bloqueia a ferramenta e devolve o stderr para o Claude ler. Exit 0 = deixa passar.
# Casa por token/caminho, não por substring: `process.env`, `.env.example` e `src/migrations-docs` passam.
set -uo pipefail

# stdin: {"tool_name":"Bash","tool_input":{"command":"..."},"permission_mode":"...",...}
CMD="$(node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{process.stdout.write(JSON.parse(d).tool_input?.command??"")}catch{}})')"

bloquear() {
  echo "guard.sh bloqueou: $CMD" >&2
  echo "Motivo: $1. Veja a seção \"Nunca\" do AGENTS.md e escolha outro caminho (ou peça ao dev)." >&2
  exit 2
}

# Regras como regex POSIX em variáveis (dentro de [[ =~ ]] sem aspas, para o bash não
# interpretar parênteses e ponto e vírgula). Um erro de sintaxe aqui sai com 2 e bloquearia TUDO.
Q="'\"\`"                                  # aspas simples, duplas e crase
A="(^|[[:space:];&|(<>=:/${Q}])"            # o que pode vir antes de um caminho
D="(\$|[[:space:];&|)<>${Q}])"              # o que pode vir depois
INICIO='(^|[[:space:];&|(])'                # começo de um comando

RE_ENV="${A}\\.env${D}"
RE_GREP_R="${INICIO}(grep|egrep|fgrep)[[:space:]]([^;&|]*[[:space:]])?-[[:alpha:]]*[rR]"
RE_RAIZ="[[:space:]](\\.|\\./|\\*|\\.\\.|~|\\\$PWD)${D}"
RE_DOTENV='(node|python3?|tsx|ts-node|deno|bun)[[:space:]].*dotenv'
RE_RM_R="${INICIO}rm[[:space:]]+(-[[:alpha:]]*[rR][[:alpha:]]*|--recursive)([[:space:]]|\$)"
RE_PUSH_F='git[[:space:]]+push([[:space:]].*)?[[:space:]](--force[^[:space:]]*|-f)([[:space:]]|$)'
RE_RESET='git[[:space:]]+reset[[:space:]]+--hard'
RE_INSTALL="${INICIO}(npm|pnpm|yarn|bun)[[:space:]]+(install|i|add|ci)([[:space:]]|\$)"
RE_MIGRATION='(migration:(run|generate|revert|create)|vendure[[:space:]]+migrate|typeorm[[:space:]]+schema:)'
RE_SYNC='synchronize[[:space:]]*:[[:space:]]*true'
RE_SQLITE="(${INICIO}(rm|mv|cp|sqlite3)[[:space:]].*|>[[:space:]]*)vendure\\.sqlite${D}"

# 1. O arquivo .env em si (não .env.example, não process.env, não .envrc).
[[ $CMD =~ $RE_ENV ]] && bloquear "acesso ao .env (segredos)"

# 2. Busca recursiva que atravessa a raiz (e portanto o .env): grep -r PAGAMENTO .
[[ $CMD =~ $RE_GREP_R && $CMD =~ $RE_RAIZ && $CMD != *--exclude=.env* ]] && bloquear "busca recursiva na raiz lê o .env; busque em src/ ou test/"

# 3. Scripts inline que carregam o .env por conta própria (dotenv).
[[ $CMD =~ $RE_DOTENV ]] && bloquear "script inline carregando o .env via dotenv"

# 4. Destrutivos.
[[ $CMD =~ $RE_RM_R ]] && bloquear "remoção recursiva"
[[ $CMD =~ $RE_PUSH_F ]] && bloquear "push forçado"
[[ $CMD =~ $RE_RESET ]] && bloquear "reset destrutivo"

# 5. Dependências sem confirmar com o dev.
[[ $CMD =~ $RE_INSTALL ]] && bloquear "instalar dependência sem confirmar"

# 6. Banco: migrations, synchronize, apagar ou recriar o vendure.sqlite.
[[ $CMD =~ $RE_MIGRATION ]] && bloquear "rodar migration"
[[ $CMD =~ $RE_SYNC ]] && bloquear "ligar synchronize"
[[ $CMD =~ $RE_SQLITE ]] && bloquear "apagar ou recriar o vendure.sqlite"

exit 0
