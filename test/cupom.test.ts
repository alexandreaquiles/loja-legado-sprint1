import { describe, it, expect } from 'vitest';
import { LanguageCode, RequestContext, Order, Promotion, PromotionState, RuntimeVendureConfig } from '@vendure/core';
import { minimumOrderAmount, orderPercentageDiscount } from '@vendure/core';
import { descontoPercentualComTeto, cupomUnico, configurarCupons } from '../src/plugins/cupons';

// Objetos falsos: só o que a action e a condition leem. Sem banco, sem NestJS.
const ctx = (pricesIncludeTax = false) => ({ channel: { pricesIncludeTax } }) as unknown as RequestContext;
const pedido = (extra: Partial<{ subTotal: number; subTotalWithTax: number; couponCodes: string[]; lines: unknown[] }> = {}) =>
  ({ subTotal: 10000, subTotalWithTax: 12000, couponCodes: ['ALURA10'], lines: [{}], ...extra }) as unknown as Order;
const args = (pct: number) => [{ name: 'pct', value: String(pct) }];
const estado = {} as PromotionState;
const promo = {} as Promotion;

const desconto = (pct: number, order = pedido(), c = ctx()) =>
  descontoPercentualComTeto.execute(c, order, args(pct), estado, promo);

describe('desconto_percentual_com_teto', () => {
  it('R1 percentual simples: 10% de R$100 = -R$10', async () => {
    expect(await desconto(10)).toBe(-1000);
  });
  it('R1 teto de 30%: pct 50 em R$100 desconta R$30, nao R$50', async () => {
    expect(await desconto(50)).toBe(-3000);
  });
  it('R2 centavos inteiros com Math.round: 10% de R$33,33 = -333', async () => {
    expect(await desconto(10, pedido({ subTotal: 3333 }))).toBe(-333);
  });
  it('R3 nunca devolve positivo', async () => {
    for (const pct of [0, 5, 30, 99]) expect((await desconto(pct)) <= 0).toBe(true);
  });
  it('R4 usa subTotalWithTax quando o canal inclui imposto no preco', async () => {
    expect(await desconto(10, pedido(), ctx(true))).toBe(-1200);
  });
  it('R4 usa subTotal quando o canal nao inclui imposto', async () => {
    expect(await desconto(10, pedido(), ctx(false))).toBe(-1000);
  });
});

describe('cupom_unico', () => {
  const checa = (order: Order) => cupomUnico.check(ctx(), order, [], promo);
  it('R5 aceita um cupom e recusa dois', async () => {
    expect(await checa(pedido({ couponCodes: ['ALURA10'] }))).toBe(true);
    expect(await checa(pedido({ couponCodes: ['ALURA10', 'BEMVINDO20'] }))).toBe(false);
  });
  it('R6 recusa pedido sem linhas', async () => {
    expect(await checa(pedido({ lines: [] }))).toBe(false);
  });
});

describe('registro no config (R7)', () => {
  const config = {
    promotionOptions: { promotionActions: [orderPercentageDiscount], promotionConditions: [minimumOrderAmount] },
  } as unknown as RuntimeVendureConfig;
  const resultado = configurarCupons(config);
  const codes = (lista: Array<{ code: string }>) => lista.map((x) => x.code);

  it('acrescenta a action e a condition sem remover as nativas', () => {
    expect(codes(resultado.promotionOptions.promotionActions!)).toEqual(['order_percentage_discount', 'desconto_percentual_com_teto']);
    expect(codes(resultado.promotionOptions.promotionConditions!)).toEqual(['minimum_order_amount', 'cupom_unico']);
  });
  it('code em snake_case e description em pt_BR e en', () => {
    for (const item of [descontoPercentualComTeto, cupomUnico]) {
      expect(item.code).toMatch(/^[a-z_]+$/);
      const linguas = item.description.map((d) => d.languageCode);
      expect(linguas).toContain(LanguageCode.pt_BR);
      expect(linguas).toContain(LanguageCode.en);
    }
  });
});
