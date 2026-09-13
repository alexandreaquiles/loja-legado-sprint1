import { describe, it, expect } from 'vitest';
import { estaExpirado } from '../src/utils/data';
import { formatarBRL } from '../src/utils/formatar';

describe('utils (legado)', () => {
  it('estaExpirado compara com a data informada', () => {
    const agora = new Date('2026-10-01T09:00:00');
    expect(estaExpirado('2024-12-25', agora)).toBe(true);
    expect(estaExpirado('2099-12-31', agora)).toBe(false);
  });
  it('formatarBRL formata centavos', () => {
    expect(formatarBRL(123456).replace(/ /g, ' ')).toBe('R$ 1.234,56');
  });
});
