// Statusline do Claude Code: modelo, custo estimado da sessão e ocupação da janela de contexto.
// O Claude Code manda um JSON no stdin a cada atualização; o que este script imprime vira a linha de status.
// Node puro (sem jq), funciona em macOS, Linux e Windows. Doc: https://code.claude.com/docs/en/statusline
import fs from 'node:fs';
import path from 'node:path';

let entrada = '';
process.stdin.on('data', (pedaco) => (entrada += pedaco));
process.stdin.on('end', () => {
  let s = {};
  try { s = JSON.parse(entrada); } catch { /* JSON inválido: mostra o que der */ }

  const modelo = s.model?.display_name ?? '?';
  // Estimativa a preço de tabela, calculada no cliente. No Pro/Max não é o que você paga (ver /usage).
  const custo = Number(s.cost?.total_cost_usd ?? 0);
  const tokens = Number(s.context_window?.total_input_tokens ?? 0);
  const pct = Math.floor(Number(s.context_window?.used_percentage ?? 0));

  const partes = [
    `[${modelo}]`,
    `US$ ${custo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (estimado)`,
    `ctx ${tokens.toLocaleString('pt-BR')} tok (${pct}%)`,
  ];

  // Voltas do stop-gate, se o harness estiver ligado e o loop estiver rodando.
  const raiz = s.workspace?.project_dir ?? s.cwd ?? process.cwd();
  try {
    const voltas = fs.readFileSync(path.join(raiz, '.claude', '.loop-count'), 'utf8').trim();
    if (voltas) partes.push(`stop-gate ${voltas}/3`);
  } catch { /* sem contador: nada a mostrar */ }

  process.stdout.write(`${partes[0]} ${partes.slice(1).join(' | ')}`);
});
