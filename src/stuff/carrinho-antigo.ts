// Carrinho do sistema antigo (Node, 2021). Nao e usado desde a migracao para o Vendure em 2024,
// mas o Beltrano pediu para manter ate confirmar que o relatorio de estoque nao depende dele.
// Tentativa de cupom (2025) ficou pela metade. Ver com o Fulano antes de apagar.
import { calcSubtotal } from '../misc/preco';

export type ItemAntigo = { sku: string; precoCentavos: number; qtd: number };
export type CarrinhoAntigo = { clienteId: string; itens: ItemAntigo[]; criadoEm: string; cupom?: string };

export function criarCarrinho(clienteId: string): CarrinhoAntigo {
  return { clienteId, itens: [], criadoEm: new Date().toISOString() };
}

export function adicionarItem(carrinho: CarrinhoAntigo, item: ItemAntigo): CarrinhoAntigo {
  if (!item || !item.sku) throw new Error('item invalido');
  if (item.qtd <= 0) throw new Error('quantidade invalida');
  const existente = carrinho.itens.find((i) => i.sku === item.sku);
  if (existente) existente.qtd += item.qtd;
  else carrinho.itens.push({ ...item });
  return carrinho;
}

export function totalCarrinho(carrinho: CarrinhoAntigo): number {
  return calcSubtotal(carrinho.itens);
}

// export function aplicarCupom(carrinho, codigo) {
//   // TODO
// }
