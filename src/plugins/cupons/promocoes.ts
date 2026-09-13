import { LanguageCode, PromotionCondition, PromotionOrderAction } from '@vendure/core';
import { descontoPercentual, podeAplicarCupom, TETO_PERCENTUAL } from './regras';

/**
 * Action de pedido: desconto percentual com teto de 30% (regra do financeiro).
 * Devolve negativo, em centavos, como toda PromotionOrderAction (R3).
 */
export const descontoPercentualComTeto = new PromotionOrderAction({
  code: 'desconto_percentual_com_teto',
  description: [
    { languageCode: LanguageCode.pt_BR, value: `Desconto de { pct }% no pedido (teto de ${TETO_PERCENTUAL}%)` },
    { languageCode: LanguageCode.en, value: `Discount order by { pct }% (capped at ${TETO_PERCENTUAL}%)` },
  ],
  args: {
    pct: { type: 'int', defaultValue: 10, ui: { component: 'number-form-input', suffix: '%' } },
  },
  execute(ctx, order, args) {
    const base = ctx.channel.pricesIncludeTax ? order.subTotalWithTax : order.subTotal; // R4
    return -descontoPercentual(base, args.pct);
  },
});

/**
 * Condition: só vale com no máximo um cupom no pedido (R5) e pelo menos uma linha (R6).
 * Existência, validade e limites de uso do cupom continuam por conta da Promotion nativa.
 */
export const cupomUnico = new PromotionCondition({
  code: 'cupom_unico',
  description: [
    { languageCode: LanguageCode.pt_BR, value: 'Se o pedido tem um único cupom e ao menos um item' },
    { languageCode: LanguageCode.en, value: 'If the order has a single coupon code and at least one line' },
  ],
  args: {},
  check(ctx, order) {
    return podeAplicarCupom(order);
  },
});
