import { describe, it, expect } from 'vitest';
import { calcSubtotal, aplicarDesconto, frete } from '../src/misc/preco';

describe('helpers de preco (legado)', () => {
  it('subtotal soma preco x quantidade', () => {
    expect(calcSubtotal([{ precoCentavos: 1000, qtd: 2 }, { precoCentavos: 500, qtd: 1 }])).toBe(2500);
  });
  it('frete gratis acima de R$200', () => {
    expect(frete(20000)).toBe(0);
    expect(frete(19999)).toBe(1990);
  });
  it('desconto percentual simples', () => {
    expect(aplicarDesconto(10000, 10)).toBe(9000);
  });
});
