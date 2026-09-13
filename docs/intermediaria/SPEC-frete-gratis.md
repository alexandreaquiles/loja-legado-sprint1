# Intermediária · cupom de frete grátis (referência)

Pedido vago da PO: "Quero um cupom de frete grátis." Esta é a spec de 5 linhas de referência, o teste que falha antes da feature e a implementação que o faz passar. Ficam aqui, fora de `test/` e `src/`, para não mudar as contagens de teste do gabarito da LOJA-1.

Esta spec também é a régua da Sprint 2: o PR `feature/frete-gratis` que a turma revisa é julgado contra ela.

## Spec de 5 linhas

```
Objetivo: promoção com cupom FRETEGRATIS que zera o frete do pedido sem mexer no subtotal, definida em src/plugins/cupons/frete-gratis.ts (promocaoFreteGratis, exportada pelo plugin).
Regra: action free_shipping nativa; conditions minimum_order_amount nativa com amount 10000 (R$ 100,00, taxInclusive false) e cupom_unico do plugin cupons.
Restrição: não criar action nem condition nova; não alterar frete() em src/misc/preco.ts; não mexer no teto de 30%; nenhuma chave, entidade ou migration.
Critério de aceite: test/frete-gratis.test.ts (docs/intermediaria/frete-gratis.test.ts.txt) passa sem alteração: 5 casos, vermelho antes da feature; os testes antigos continuam verdes.
Verificação: npm test && npx tsc --noEmit
```

## Como usar

```bash
cp docs/intermediaria/frete-gratis.test.ts.txt test/frete-gratis.test.ts
npm test            # vermelho: 5 falhas em test/frete-gratis.test.ts (promocaoFreteGratis não existe)
# implementar (ou aplicar a referência):
cp docs/intermediaria/frete-gratis.ts.txt src/plugins/cupons/frete-gratis.ts
echo "export * from './frete-gratis';" >> src/plugins/cupons/index.ts
npm test && npx tsc --noEmit   # verde: 20 testes
```

O que o teste cobre: a definição usa exatamente `free_shipping`, `minimum_order_amount` e `cupom_unico` (uma action própria ou uma condition reimplementada falham); as conditions, avaliadas com as classes reais do Vendure, recusam R$ 99,99 e aceitam R$ 100,00; o segundo cupom no pedido derruba a promoção; a action nativa devolve o frete negativo e não toca no subtotal.

O que ele não cobre: criar a promoção no banco. A definição é versionada no plugin e o admin cria a promoção no dashboard (Marketing → Promotions) ou pelo `createPromotion` do Admin API com esses valores. Automatizar isso (seed ou `onApplicationBootstrap`) é decisão à parte, porque escreve no banco.

## Perguntas de negócio registradas

1. **R$ 100 ou R$ 200?** A PO pediu frete grátis a partir de R$ 100. Mas `frete()` em `src/misc/preco.ts` (usado no relatório do financeiro) já dá frete grátis a partir de **R$ 200** (`valorCentavos >= 20000`), e o teste `test/preco.test.ts` fixa esse valor. Com a spec acima, um pedido de R$ 150 com o cupom sai sem frete na loja e com R$ 19,90 de frete na planilha da Dona Maria. A spec não muda `frete()` (restrição); quem decide se o relatório passa a considerar o cupom é o financeiro.
2. **Com ou sem imposto?** O mínimo vale sobre o subtotal **sem** imposto (`taxInclusive: false`), igual ao canal padrão do seed (`pricesIncludeTax = false`). Se a loja passar a exibir preços com imposto, a regra precisa ser revista.
3. **Acumula com outro cupom?** Não: `cupom_unico` recusa pedido com dois códigos. Uma promoção de frete grátis sem cupom (automática) não seria barrada por ela.
