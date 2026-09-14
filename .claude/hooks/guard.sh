#!/usr/bin/env bash
# PreToolUse (matcher: Bash). Complementa o permissions.deny do settings.json.
# O deny já barra Read/Edit do .env e `cat/head/tail/sed .env`; ele NÃO pega
# `grep -r` na raiz, `find -exec cat`, `node -e`/`python -c` lendo o .env, nem comandos destrutivos.
# Exit 2 = bloqueia a ferramenta e devolve o stderr para o Claude ler. Exit 0 = deixa passar.
# Casa por token/caminho, não por substring: `process.env`, `.env.example` e `src/migrations-docs` passam.
# Best-effort: a proteção de verdade é o segredo fora do repositório (ou um sandbox).
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

RE_ENV="${A}\\.env(${D}|[*?[])"             # .env como caminho, ou um glob que o inclui (.env*)
RE_EXCLUDE_ENV="^(.*)--exclude=[${Q}]?\\.env[${Q}]?(\$|[[:space:];&|)].*)\$"   # grep --exclude=.env, exatamente o .env
RE_ASPAS="^([^'\"]*)('[^']*'|\"[^\"]*\")(.*)\$"      # o primeiro trecho entre aspas
RE_EXPR_FIND='^[-!(]'                                # onde terminam os caminhos do find
RE_PREFIXO='^([[:alpha:]_][[:alnum:]_]*=.*|sudo|command|env|time|nice|nohup|exec|xargs)$'
RE_FIND_XARGS='find[[:space:]][^;&]*[|][[:space:]]*xargs'
RE_DOTENV='(node|python3?|tsx|ts-node|deno|bun)[[:space:]].*dotenv'
RE_RM_R="${INICIO}rm[[:space:]]+(-[[:alpha:]]*[rR][[:alpha:]]*|--recursive)([[:space:]]|\$)"
RE_PUSH_F='git[[:space:]]+push([[:space:]].*)?[[:space:]](--force[^[:space:]]*|-f)([[:space:]]|$)'
RE_RESET='git[[:space:]]+reset[[:space:]]+--hard'
RE_INSTALL="${INICIO}(npm|pnpm|yarn|bun)[[:space:]]+(install|i|add|ci)([[:space:]]|\$)"
RE_MIGRATION='(migration:(run|generate|revert|create)|vendure[[:space:]]+migrate|typeorm[[:space:]]+schema:)'
RE_SYNC='synchronize[[:space:]]*:[[:space:]]*true'
RE_SQLITE="(${INICIO}(rm|mv|cp|sqlite3)[[:space:]].*|>[[:space:]]*)vendure\\.sqlite${D}"

# `grep -r --exclude=.env` pula exatamente o .env: essa menção não conta como acesso (vira --exclude-env).
SEM_EXCLUDE="$CMD"
while [[ $SEM_EXCLUDE =~ $RE_EXCLUDE_ENV ]]; do
  SEM_EXCLUDE="${BASH_REMATCH[1]}--exclude-env${BASH_REMATCH[2]}"
done

eh_raiz() { # $1 caminho: a raiz do projeto (ou acima dela) contém o .env
  case "$1" in
    .|./|./\*|\*|..|../|'~'|'~/'|/|'$HOME'|'$PWD'|'${PWD}'|'$CLAUDE_PROJECT_DIR'|'"$CLAUDE_PROJECT_DIR"') return 0 ;;
  esac
  [ "${1%/}" = "${CLAUDE_PROJECT_DIR:-$PWD}" ] || [ "${1%/}" = "$PWD" ]
}

# Busca recursiva ou find -exec que atravessa a raiz e portanto lê o .env:
#   grep -r PAGAMENTO .   grep -r PAGAMENTO (sem caminho = diretório atual)   rg PAGAMENTO
#   find . -name '*.env*' -exec cat {} \;
# Passam: caminho fora da raiz (grep -rn process.env src), --exclude=.env, --include ou -name que não casam com .env.
le_env_pela_raiz() {
  local texto="$SEM_EXCLUDE" m dentro seg
  # Tira as aspas mantendo o conteúdo como uma palavra só ("foo bar" -> foo_bar).
  while [[ $texto =~ $RE_ASPAS ]]; do
    m="${BASH_REMATCH[2]}"; dentro="${m:1:${#m}-2}"; dentro="${dentro//[[:space:];&|()]/_}"
    texto="${BASH_REMATCH[1]}${dentro}${BASH_REMATCH[3]}"
  done
  while IFS= read -r seg; do
    local w=() i=0 n cmd
    read -ra w <<< "$seg"
    n=${#w[@]}
    while [ $i -lt $n ] && [[ ${w[i]} =~ $RE_PREFIXO ]]; do i=$((i + 1)); done
    [ $i -lt $n ] || continue
    cmd="${w[i]##*/}"; i=$((i + 1))
    case "$cmd" in
      grep|egrep|fgrep|rg)
        local recursivo=0 padrao=0 exclui=0 soltos=() filtros=() o j c
        [ "$cmd" = rg ] && recursivo=1
        while [ $i -lt $n ]; do
          o="${w[i]}"; i=$((i + 1))
          case "$o" in
            --) while [ $i -lt $n ]; do soltos+=("${w[i]}"); i=$((i + 1)); done ;;
            --exclude-env) exclui=1 ;;
            --recursive|--dereference-recursive|--directories=recurse) recursivo=1 ;;
            --include=*) filtros+=("${o#--include=}") ;;
            --glob=*|--iglob=*) filtros+=("${o#*=}") ;;
            --regexp=*|--file=*) padrao=1 ;;
            --regexp|--file) padrao=1; i=$((i + 1)) ;;
            --glob|--iglob) filtros+=("${w[i]:-}"); i=$((i + 1)) ;;
            --type|--type-not|--max-count|--context|--after-context|--before-context|--replace|--threads|--max-depth|--encoding) i=$((i + 1)) ;;
            --*) ;;
            -?*)
              for ((j = 1; j < ${#o}; j++)); do
                c="${o:j:1}"
                [ "$cmd" != rg ] && [[ $c == [rR] ]] && recursivo=1
                if [[ $c == [ef] ]] || { [ "$cmd" = rg ] && [[ $c == [gtTmABCjMrE] ]]; } || { [ "$cmd" != rg ] && [[ $c == [mABCdD] ]]; }; then
                  [[ $c == [ef] ]] && padrao=1
                  if [ $((j + 1)) -eq ${#o} ]; then
                    [ "$c" = d ] && [ "${w[i]:-}" = recurse ] && recursivo=1
                    [ "$cmd" = rg ] && [ "$c" = g ] && filtros+=("${w[i]:-}")
                    i=$((i + 1))
                  fi
                  break
                fi
              done ;;
            *) soltos+=("$o") ;;
          esac
        done
        [ $recursivo = 1 ] || continue
        [ $exclui = 1 ] && continue
        if [ ${#filtros[@]} -gt 0 ]; then   # --include='*.ts' só lê .ts; '*.env*' ou '*' incluem o .env; rg -g '!.env' o exclui
          local positivos=0 inclui=0 f
          for f in "${filtros[@]}"; do
            if [[ $f == !* ]]; then [[ .env == ${f#!} ]] && exclui=1
            else positivos=1; [[ .env == $f ]] && inclui=1; fi
          done
          [ $exclui = 1 ] && continue
          [ $positivos = 1 ] && [ $inclui = 0 ] && continue
        fi
        if [ $padrao = 0 ] && [ ${#soltos[@]} -gt 0 ]; then soltos=("${soltos[@]:1}"); fi   # o 1º solto é o padrão
        [ ${#soltos[@]} -eq 0 ] && return 0          # sem caminho: busca no diretório atual
        for o in "${soltos[@]}"; do eh_raiz "$o" && return 0; done
        ;;
      find)
        local inicio=() nomes=() executa=0 o
        while [ $i -lt $n ] && [[ ! ${w[i]} =~ $RE_EXPR_FIND ]]; do inicio+=("${w[i]}"); i=$((i + 1)); done
        while [ $i -lt $n ]; do
          o="${w[i]}"; i=$((i + 1))
          case "$o" in
            -name|-iname) nomes+=("${w[i]:-}"); i=$((i + 1)) ;;
            -path|-ipath|-wholename|-iwholename) o="${w[i]:-}"; nomes+=("${o##*/}"); i=$((i + 1)) ;;
            -regex|-iregex) nomes+=('*'); i=$((i + 1)) ;;
            -exec|-execdir|-ok|-okdir) executa=1 ;;
          esac
        done
        [[ $CMD =~ $RE_FIND_XARGS ]] && executa=1
        [ $executa = 1 ] || continue
        local toca=0 f
        [ ${#nomes[@]} -eq 0 ] && toca=1
        shopt -s nocasematch   # -iname '*.ENV' também casa (e -name fica mais conservador)
        for f in ${nomes[@]+"${nomes[@]}"}; do [[ .env == $f ]] && toca=1; done
        shopt -u nocasematch
        [ $toca = 1 ] || continue
        [ ${#inicio[@]} -eq 0 ] && return 0
        for o in "${inicio[@]}"; do eh_raiz "$o" && return 0; done
        ;;
    esac
  done <<< "${texto//[;&|()\`]/$'\n'}"
  return 1
}

# 1. O arquivo .env em si (não .env.example, não process.env, não .envrc), inclusive por glob: cat .env*
[[ $SEM_EXCLUDE =~ $RE_ENV ]] && bloquear "acesso ao .env (segredos)"

# 2. Busca recursiva ou find -exec que atravessa a raiz (e portanto o .env): grep -r PAGAMENTO .
le_env_pela_raiz && bloquear "busca recursiva ou find -exec na raiz lê o .env; busque em src/ ou test/ (ou use --exclude=.env)"

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
