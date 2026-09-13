#!/usr/bin/env node
// npm run conferir            confere os cards 00 a 04 da Sprint 1
// npm run conferir -- 02      confere só um card
// npm run conferir -- --estrito   sai com 1 se houver algum ✘ (usado na verificação do curso)
//
// Feedback, não prova: Node puro, sem dependências, sem LLM, sem e2e. Nunca lê o conteúdo do .env.
// ✔ feito · ✘ falta fazer (com a dica do que olhar) · … pendente (depende de outro item ainda não feito)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const estrito = args.includes('--estrito');
const filtro = args.filter((a) => /^\d{1,2}$/.test(a)).map((a) => a.padStart(2, '0'));

const TETO_TOKENS_CLAUDE_MD = 1500;
const TETO_TOKENS_MEMORIA = 2500; // CLAUDE.md + AGENTS.md importado: mover o despejo para o AGENTS.md não vale

// ---------- utilitários ----------
const arq = (...p) => path.join(raiz, ...p);
const existe = (...p) => fs.existsSync(arq(...p));
const ler = (...p) => { try { return fs.readFileSync(arq(...p), 'utf8'); } catch { return null; } };
const tokens = (texto) => Math.round(texto.length / 4 / 100) * 100;
const milhar = (n) => n.toLocaleString('pt-BR');
const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function git(...a) {
  const r = spawnSync('git', a, { cwd: raiz, encoding: 'utf8' });
  return r.status === 0 ? r.stdout : null;
}
const temBranch = (nome) => git('rev-parse', '--verify', '--quiet', `refs/heads/${nome}`) !== null;

function bash(script, entrada, env = {}, cwd = raiz) {
  const r = spawnSync('bash', [script], {
    cwd, input: entrada, encoding: 'utf8', timeout: 20000,
    env: { ...process.env, CLAUDE_PROJECT_DIR: cwd, ...env },
  });
  if (r.error) return { erro: r.error.code === 'ENOENT' ? 'bash não encontrado (no Windows, use Git Bash ou WSL)' : String(r.error.message) };
  return { status: r.status, stderr: r.stderr ?? '', stdout: r.stdout ?? '' };
}

let cacheTestes;
function rodarTestes() {
  if (cacheTestes) return cacheTestes;
  const bin = arq('node_modules', 'vitest', 'vitest.mjs');
  if (!fs.existsSync(bin)) return (cacheTestes = { rodou: false, motivo: 'node_modules/vitest não existe' });
  const inicio = Date.now();
  const r = spawnSync(process.execPath, [bin, 'run', '--config', 'vitest.config.mts'], {
    cwd: raiz, encoding: 'utf8', timeout: 60000, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', CI: '1' },
  });
  const saida = `${r.stdout ?? ''}\n${r.stderr ?? ''}`.replace(/\x1b\[[0-9;]*m/g, '');
  const linha = saida.match(/^\s*Tests\s+(.+)$/m)?.[1] ?? '';
  const arquivos = saida.match(/^\s*Test Files\s+(.+)$/m)?.[1] ?? '';
  const num = (texto, rotulo) => Number(texto.match(new RegExp(`(\\d+) ${rotulo}`))?.[1] ?? 0);
  return (cacheTestes = {
    rodou: linha !== '', verde: r.status === 0 && linha !== '',
    passaram: num(linha, 'passed'), falharam: num(linha, 'failed'), arquivosQuebrados: num(arquivos, 'failed'),
    segundos: (Date.now() - inicio) / 1000,
    motivo: linha ? '' : saida.trim().split('\n').slice(-3).join(' '),
  });
}

function descreverFalha(t) {
  const partes = [`${t.passaram} verdes`];
  if (t.falharam) partes.push(`${t.falharam} falhando`);
  if (t.arquivosQuebrados && !t.falharam) partes.push(`${t.arquivosQuebrados} arquivo(s) de teste sem carregar`);
  return partes.join(', ');
}

function lerJson(...p) {
  const t = ler(...p);
  if (t === null) return { falta: true };
  try { return { json: JSON.parse(t) }; } catch (e) { return { invalido: e.message }; }
}

// hooks registrados para um evento; matcher opcional ("Bash", "Edit|Write")
function hooksDo(settings, evento) {
  const grupos = settings?.hooks?.[evento];
  if (!Array.isArray(grupos)) return [];
  return grupos.flatMap((g) => (g.hooks ?? []).map((h) => ({ matcher: g.matcher ?? '', comando: h.command ?? '' })));
}
const casa = (matcher, ferramenta) => matcher === '' || matcher === '*' || matcher.split('|').map((m) => m.trim()).includes(ferramenta);

function frontmatter(texto) {
  const m = texto?.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  return Object.fromEntries(m[1].split(/\r?\n/).map((l) => l.match(/^(\w+):\s*(.*)$/)).filter(Boolean).map((x) => [x[1], x[2].trim()]));
}

const jsonHook = (extra) => JSON.stringify({
  session_id: 'conferir', transcript_path: '', cwd: raiz, prompt_id: 'conferir', permission_mode: 'default', ...extra,
});
const jsonBash = (command) => jsonHook({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command, description: 'conferir' }, tool_use_id: 'toolu_conferir' });
const jsonStop = (extra) => jsonHook({ hook_event_name: 'Stop', stop_hook_active: false, last_assistant_message: 'pronto', background_tasks: [], session_crons: [], ...extra });

// ---------- cards ----------
const cards = [];
const card = (id, titulo, checagens) => cards.push({ id, titulo, checagens });
const ok = (texto) => ({ estado: 'ok', texto });
const falha = (texto, dica) => ({ estado: 'falha', texto, dica });
const pendente = (texto, dica) => ({ estado: 'pendente', texto, dica });

card('00', 'Preparar o ambiente', () => {
  const r = [];
  const [maj, min] = process.versions.node.split('.').map(Number);
  r.push(maj > 22 || (maj === 22 && min >= 12)
    ? ok(`Node ${process.versions.node} (precisa de 22.12 ou mais novo)`)
    : falha(`Node ${process.versions.node} é antigo`, 'instale o Node 22.12+ (nvm install 22)'));
  r.push(existe('node_modules', '@vendure', 'core') ? ok('dependências instaladas (node_modules)') : falha('node_modules não existe', 'rode npm install (uns 2 minutos)'));
  r.push(existe('.env') ? ok('.env existe (o conferir não lê o conteúdo)') : falha('.env não existe', 'rode npm run setup'));
  r.push(existe('vendure.sqlite') ? ok('vendure.sqlite existe') : falha('vendure.sqlite não existe', 'rode npm run setup'));
  r.push(temBranch('gabarito') ? ok('branch local gabarito existe') : falha('branch local gabarito não existe', 'rode npm run setup (cria as branches locais a partir do origin)'));
  const t = rodarTestes();
  if (!t.rodou) r.push(falha('npm test não rodou', `${t.motivo || 'veja a saída de npm test'}`));
  else if (t.verde) r.push(ok(`npm test roda: ${t.passaram} testes verdes em ${t.segundos.toFixed(1).replace('.', ',')} s`));
  else r.push(ok(`npm test roda: ${descreverFalha(t)} (normal entre os cards 01 e 04)`));
  return r;
});

card('01', 'Sentir o problema', () => {
  const r = [];
  const s = lerJson('.claude', 'settings.json').json;
  r.push(s?.statusLine?.command
    ? ok(`statusline configurada: ${s.statusLine.command} (custo estimado e contexto no rodapé)`)
    : falha('statusLine não está em .claude/settings.json', 'git checkout main -- .claude/settings.json .claude/statusline.mjs'));
  const claude = ler('CLAUDE.md');
  if (claude !== null) r.push(ok(`CLAUDE.md atual: ~${milhar(tokens(claude))} tokens estimados, ${claude.split('\n').length} linhas (anote no placar)`));
  r.push(temBranch('gabarito') && git('cat-file', '-e', 'gabarito:test/cupom.test.ts') !== null
    ? ok('teste de aceite disponível: git show gabarito:test/cupom.test.ts')
    : falha('não achei test/cupom.test.ts na branch gabarito', 'rode npm run setup para criar a branch local'));
  r.push(existe('test', 'cupom.test.ts')
    ? ok('test/cupom.test.ts está na árvore de trabalho')
    : pendente('test/cupom.test.ts ainda não está na árvore', 'o card 01 traz o teste do gabarito para ver o agente tentar sem harness; o card 03 o traz de vez'));
  return r;
});

card('02', 'Harness: CLAUDE.md, AGENTS.md, hooks e subagente', () => {
  const r = [];
  const claude = ler('CLAUDE.md') ?? '';
  const agents = ler('AGENTS.md') ?? '';
  const tk = tokens(claude);
  r.push(tk <= TETO_TOKENS_CLAUDE_MD
    ? ok(`CLAUDE.md com ~${milhar(tk)} tokens estimados (teto ${milhar(TETO_TOKENS_CLAUDE_MD)})`)
    : falha(`CLAUDE.md com ~${milhar(tk)} tokens estimados (teto ${milhar(TETO_TOKENS_CLAUDE_MD)})`, 'corte o que o modelo já sabe, o histórico e a API colada; confira a linha "Memory files" do /context'));
  const tkMem = tokens(claude + agents);
  r.push(tkMem <= TETO_TOKENS_MEMORIA
    ? ok(`CLAUDE.md + AGENTS.md com ~${milhar(tkMem)} tokens estimados (teto ${milhar(TETO_TOKENS_MEMORIA)})`)
    : falha(`CLAUDE.md + AGENTS.md com ~${milhar(tkMem)} tokens estimados (teto ${milhar(TETO_TOKENS_MEMORIA)})`, 'o @AGENTS.md entra inteiro no contexto: mover o despejo para lá não enxuga nada'));
  const genericas = ['Siga as boas práticas do mercado', 'Sempre escreva código limpo', 'Você é um assistente de programação', 'lista completa de queries e mutations'];
  const achadas = genericas.filter((g) => claude.includes(g) || agents.includes(g));
  r.push(achadas.length === 0 ? ok('sem regras genéricas nem API colada') : falha(`ainda tem: "${achadas[0]}"`, 'curso, seção 2 · Guiando o entrypoint do agente, aula «Guia de boas e más práticas»'));
  r.push(/^@AGENTS\.md\s*$/m.test(claude) ? ok('CLAUDE.md importa @AGENTS.md') : falha('CLAUDE.md não importa @AGENTS.md', 'regras do projeto no AGENTS.md e uma linha @AGENTS.md no CLAUDE.md (aula «Definindo rules e memória»)'));
  const unicas = ['centavos', 'pricesIncludeTax', 'npm test'].filter((x) => !agents.includes(x));
  r.push(unicas.length === 0 ? ok('AGENTS.md tem as regras únicas do projeto (centavos, pricesIncludeTax, npm test)') : falha(`AGENTS.md não menciona: ${unicas.join(', ')}`, 'as poucas informações únicas do CLAUDE.md antigo precisam sobreviver ao corte'));
  r.push(agents.includes('Run `npm run build` after changing backend code.')
    ? falha('AGENTS.md ainda manda rodar npm run build a cada mudança', 'essa linha do scaffold conflita com o npm test dos hooks: ajuste para o fluxo do projeto')
    : ok('AGENTS.md sem o conflito "npm run build a cada mudança"'));

  const { json: s, falta, invalido } = lerJson('.claude', 'settings.json');
  if (falta || invalido) {
    r.push(falha(falta ? '.claude/settings.json não existe' : `.claude/settings.json inválido: ${invalido}`, 'crie o settings do projeto (dica 2 do card)'));
  } else {
    const deny = s.permissions?.deny ?? [];
    const negaEnv = (tool) => deny.some((d) => new RegExp(`^${tool}\\((\\./|\\*\\*/)?\\.env\\)$`).test(d));
    const faltam = ['Read', 'Edit', 'Write'].filter((t) => !negaEnv(t));
    r.push(faltam.length === 0 ? ok('permissions.deny nega Read/Edit/Write do .env') : falha(`permissions.deny não nega ${faltam.join('/')} do .env`, 'ex.: "deny": ["Read(./.env)", ...]'));
    const pre = hooksDo(s, 'PreToolUse').filter((h) => casa(h.matcher, 'Bash') && h.comando.includes('guard.sh'));
    r.push(pre.length ? ok('PreToolUse Bash → guard.sh') : falha('falta PreToolUse com matcher Bash chamando guard.sh', 'o deny não pega grep -r nem node -e; o guard complementa'));
    const post = hooksDo(s, 'PostToolUse').filter((h) => casa(h.matcher, 'Edit') && casa(h.matcher, 'Write'));
    r.push(post.length ? ok(`PostToolUse Edit|Write → ${path.basename(post[0].comando.replace(/"/g, ''))}`) : falha('falta PostToolUse com matcher Edit|Write', 'rodar os testes depois de editar src/ ou test/'));
    const stop = hooksDo(s, 'Stop');
    r.push(stop.length ? ok(`Stop → ${path.basename(stop[0].comando.replace(/"/g, ''))}`) : falha('falta o hook Stop', 'o stop-gate decide se o agente pode encerrar'));
  }

  const guard = arq('.claude', 'hooks', 'guard.sh');
  if (!fs.existsSync(guard)) {
    r.push(falha('.claude/hooks/guard.sh não existe', 'contrato dos hooks: card de estudo'));
  } else {
    if (process.platform !== 'win32') {
      const semX = ['guard.sh', 'test-after-edit.sh', 'stop-gate.sh'].filter((h) => existe('.claude', 'hooks', h) && !(fs.statSync(arq('.claude', 'hooks', h)).mode & 0o111));
      r.push(semX.length === 0 ? ok('hooks executáveis') : falha(`sem permissão de execução: ${semX.join(', ')}`, 'chmod +x .claude/hooks/*.sh'));
    }
    const casos = [
      ['cat .env', 2], ['grep -rn process.env src', 0], ['cat .env.example', 0],
    ];
    for (const [cmd, esperado] of casos) {
      const x = bash(guard, jsonBash(cmd));
      if (x.erro) { r.push(falha(`guard.sh não rodou: ${x.erro}`)); break; }
      r.push(x.status === esperado
        ? ok(`guard.sh: \`${cmd}\` → exit ${esperado}${esperado === 2 ? ' (bloqueia)' : ' (passa)'}`)
        : falha(`guard.sh: \`${cmd}\` → exit ${x.status}, esperado ${esperado}`, esperado === 2 ? 'exit 2 bloqueia e devolve o stderr ao agente' : 'case por caminho/token, não por substring: process.env e .env.example não são o .env'));
    }
  }

  const gate = arq('.claude', 'hooks', 'stop-gate.sh');
  if (!fs.existsSync(gate)) {
    r.push(falha('.claude/hooks/stop-gate.sh não existe', 'contrato dos hooks: card de estudo'));
  } else {
    // Projeto falso cujo npm test sempre falha: prova que o gate olha o modo e os testes, sem depender do estado do repo.
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'conferir-stop-'));
    try {
      fs.mkdirSync(path.join(tmp, '.claude'));
      fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ name: 'falso', scripts: { test: 'exit 1' } }));
      const plano = bash(gate, jsonStop({ permission_mode: 'plan', cwd: tmp }), {}, tmp);
      if (plano.erro) r.push(falha(`stop-gate.sh não rodou: ${plano.erro}`));
      else {
        r.push(plano.status === 0 ? ok('stop-gate.sh em plan mode → exit 0 (não roda testes)') : falha(`stop-gate.sh em plan mode → exit ${plano.status}`, 'saia cedo quando permission_mode == "plan"'));
        const vermelho = bash(gate, jsonStop({ cwd: tmp }), {}, tmp);
        r.push(vermelho.status === 2 ? ok('stop-gate.sh com testes vermelhos → exit 2 (agente continua)') : falha(`stop-gate.sh com testes vermelhos → exit ${vermelho.status}, esperado 2`, 'exit 2 com o motivo no stderr'));
        let liberou = false;
        for (let i = 0; i < 5 && !liberou; i++) liberou = bash(gate, jsonStop({ cwd: tmp, stop_hook_active: true }), {}, tmp).status === 0;
        r.push(liberou ? ok('stop-gate.sh libera depois de algumas voltas (circuit breaker)') : falha('stop-gate.sh bloqueou 6 vezes seguidas', 'use stop_hook_active e um contador (MAX_VOLTAS)'));
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }

  const revisor = ler('.claude', 'agents', 'revisor-codigo.md');
  if (revisor === null) {
    r.push(falha('.claude/agents/revisor-codigo.md não existe', existe('.claude', 'agents', 'revisor.md') ? 'renomeie revisor.md para revisor-codigo.md (revisor é o nome do servidor MCP da Sprint 2)' : 'curso, seção 5 · Criando um time e executando vários agentes, aula «Subagents customizados»'));
  } else {
    const fm = frontmatter(revisor) ?? {};
    const tools = (fm.tools ?? '').split(',').map((t) => t.trim()).filter(Boolean);
    const escrita = tools.filter((t) => ['Bash', 'Edit', 'Write', 'NotebookEdit'].includes(t));
    r.push(tools.length && escrita.length === 0
      ? ok(`subagente revisor-codigo só lê (tools: ${tools.join(', ')})`)
      : falha(tools.length ? `revisor-codigo tem ${escrita.join(', ')}` : 'revisor-codigo sem "tools:" herda todas as ferramentas, inclusive Bash', 'tools: Read, Grep, Glob'));
  }
  return r;
});

card('03', 'Spec e plano', () => {
  const r = [];
  const spec = ler('SPEC.md');
  if (spec === null) {
    r.push(falha('SPEC.md não existe', 'contexto, objetivo, regras, restrições, critério de aceite, verificação'));
  } else {
    const titulos = spec.split('\n').filter((l) => /^#{1,4}\s/.test(l)).map(semAcento);
    const secoes = [['contexto', 'contexto'], ['objetivo', 'objetivo'], ['regras', 'regra'], ['restrições', 'restric'], ['critério de aceite', 'criterio'], ['verificação', 'verificac']];
    const faltam = secoes.filter(([, chave]) => !titulos.some((t) => t.includes(chave))).map(([nome]) => nome);
    r.push(faltam.length === 0 ? ok('SPEC.md com contexto, objetivo, regras, restrições, critério de aceite e verificação') : falha(`SPEC.md sem a seção: ${faltam.join(', ')}`, 'um título (##) por seção'));
  }
  r.push(existe('docs', 'plano.md') ? ok('docs/plano.md existe') : falha('docs/plano.md não existe', 'peça o plano em arquivo, não só em plan mode (curso, seção 3 · Sessão, compactação e subagents, aula «Planejamento primeiro»)'));
  const teste = ler('test', 'cupom.test.ts');
  if (teste === null) r.push(falha('test/cupom.test.ts não existe', 'o teste de aceite vem do gabarito: git checkout gabarito -- test/cupom.test.ts'));
  else r.push(/plugins\/cupons/.test(teste) ? ok('test/cupom.test.ts importa src/plugins/cupons') : falha('test/cupom.test.ts não referencia src/plugins/cupons', 'o critério de aceite testa o plugin da spec'));
  return r;
});

card('04', 'Loop: implementar até verde', () => {
  const r = [];
  r.push(existe('src', 'plugins', 'cupons', 'index.ts') ? ok('src/plugins/cupons/ existe') : falha('src/plugins/cupons/index.ts não existe', 'implemente o SPEC.md com o loop fechado'));
  const cfg = ler('src', 'vendure-config.ts') ?? '';
  r.push(/plugins:\s*\[[\s\S]*CuponsPlugin/.test(cfg) ? ok('CuponsPlugin registrado em src/vendure-config.ts') : falha('CuponsPlugin não está no array plugins de src/vendure-config.ts', 'R7 do SPEC.md'));
  const teste = ler('test', 'cupom.test.ts');
  if (teste === null) {
    r.push(pendente('test/cupom.test.ts ainda não está na árvore', 'card 03'));
  } else {
    const original = temBranch('gabarito') ? git('show', 'gabarito:test/cupom.test.ts') : null;
    if (original === null) r.push(pendente('não dá para comparar test/cupom.test.ts com o gabarito', 'rode npm run setup para criar a branch local gabarito'));
    else r.push(original.replace(/\r\n/g, '\n') === teste.replace(/\r\n/g, '\n') ? ok('test/cupom.test.ts igual ao do gabarito (não foi alterado)') : falha('test/cupom.test.ts foi alterado', 'o critério é passar sem mexer nos testes: git diff gabarito -- test/cupom.test.ts'));
    const t = rodarTestes();
    if (!t.rodou) r.push(falha('npm test não rodou', t.motivo));
    else r.push(t.verde ? ok(`npm test verde: ${t.passaram} testes`) : falha(`npm test vermelho: ${descreverFalha(t)}`, 'o stop-gate devolve as falhas ao agente; confira o circuit breaker'));
  }
  return r;
});

// ---------- saída ----------
const simbolo = { ok: '✔', falha: '✘', pendente: '…' };
const total = { ok: 0, falha: 0, pendente: 0 };
const escolhidos = cards.filter((c) => filtro.length === 0 || filtro.includes(c.id));
if (escolhidos.length === 0) {
  console.log(`Card desconhecido: ${filtro.join(', ')}. Use 00, 01, 02, 03 ou 04.`);
  process.exit(estrito ? 1 : 0);
}
const inicio = Date.now();
for (const c of escolhidos) {
  console.log(`\nCard ${c.id} · ${c.titulo}`);
  let itens;
  try { itens = c.checagens(); } catch (e) { itens = [falha(`erro ao conferir: ${e.message}`)]; }
  for (const i of itens) {
    total[i.estado]++;
    console.log(`  ${simbolo[i.estado]} ${i.texto}`);
    if (i.dica && i.estado !== 'ok') console.log(`      → ${i.dica}`);
  }
}
console.log(`\nResumo: ${total.ok} ✔ · ${total.falha} ✘ · ${total.pendente} … (${((Date.now() - inicio) / 1000).toFixed(1).replace('.', ',')} s)`);
if (!estrito) console.log('Dúvida ou travou? Poste esta saída no Discord da turma (checkpoint do dia 5).');
process.exit(estrito && total.falha > 0 ? 1 : 0);
