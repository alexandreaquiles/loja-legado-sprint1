// helpers de preco (TODO: refatorar um dia). Vieram do sistema antigo, de antes do Vendure.
// Ainda usados pelo relatorio mensal do financeiro (planilha da Dona Maria).

export function calcSubtotal(itens: Array<{ precoCentavos: number; qtd: number }>): number {
  let t = 0;
  for (const i of itens) {
    t = t + i.precoCentavos * i.qtd;
  }
  return t;
}

// aplica desconto percentual. ex: aplicarDesconto(10000, 10) => 9000
export function aplicarDesconto(valorCentavos: number, pct: number): number {
  return Math.round(valorCentavos - (valorCentavos * pct) / 100);
}

export function frete(valorCentavos: number): number {
  if (valorCentavos >= 20000) return 0;
  return 1990;
}
