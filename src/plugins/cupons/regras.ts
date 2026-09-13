// Regras de negócio do financeiro, só com números. Sem Vendure aqui: testável em milissegundos.

export const TETO_PERCENTUAL = 30;

/** Percentual efetivo: nunca acima do teto (R1). */
export function percentualComTeto(pct: number, teto = TETO_PERCENTUAL): number {
  return Math.min(Math.max(pct, 0), teto);
}

/** Desconto em centavos, inteiro (R2), sobre uma base em centavos. */
export function descontoPercentual(baseCentavos: number, pct: number): number {
  return Math.round((baseCentavos * percentualComTeto(pct)) / 100);
}

/** Um cupom por pedido (R5) e pedido com pelo menos uma linha (R6). */
export function podeAplicarCupom(pedido: { couponCodes: string[]; lines: unknown[] }): boolean {
  return pedido.couponCodes.length <= 1 && pedido.lines.length > 0;
}
