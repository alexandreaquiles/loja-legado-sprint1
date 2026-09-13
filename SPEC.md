# SPEC: Cupom com teto de desconto (plugin `cupons`)

## Contexto

A loja roda Vendure 3.7. Promoção já existe no framework: o admin cria uma `Promotion` com código de cupom, datas, limite de uso, e escolhe *conditions* e *actions*. O que falta é a regra do financeiro: em 2022 um cupom deu 100% de desconto e a loja perdeu R$ 40 mil num fim de semana. Ninguém pode configurar desconto percentual acima de 30%, nem por engano. E dois cupons no mesmo pedido, nunca.

## Objetivo

Criar o plugin `CuponsPlugin` em `src/plugins/cupons/` e registrá-lo em `src/vendure-config.ts`. O plugin adiciona ao `config.promotionOptions`:

- a **action de pedido** `desconto_percentual_com_teto`, com o argumento `pct` (int): desconta `pct` por cento do pedido, com teto de 30;
- a **condition** `cupom_unico`, sem argumentos: a promoção só vale quando o pedido tem no máximo um código de cupom e pelo menos uma linha.

Arquivos:

```
src/plugins/cupons/regras.ts          funções puras (só números), sem importar o Vendure
src/plugins/cupons/promocoes.ts       descontoPercentualComTeto (PromotionOrderAction) e cupomUnico (PromotionCondition)
src/plugins/cupons/cupons.plugin.ts   CuponsPlugin (VendurePlugin) e configurarCupons(config)
src/plugins/cupons/index.ts           reexporta tudo acima
```

## Regras

- R1. Teto: o percentual efetivo é `min(pct, 30)`. `pct = 50` em R$ 100,00 desconta R$ 30,00, não R$ 50,00.
- R2. Centavos: o desconto é inteiro, arredondado com `Math.round`. 10% de R$ 33,33 (3333) = 333.
- R3. Sinal: `execute` devolve o desconto **negativo** (R$ 30,00 → `-3000`), como toda action de pedido do Vendure. Nunca positivo.
- R4. Imposto: a base é `order.subTotalWithTax` quando `ctx.channel.pricesIncludeTax` é true e `order.subTotal` quando é false (igual à `orderFixedDiscount` nativa).
- R5. Cupom único: `cupomUnico.check` devolve `false` quando `order.couponCodes` tem mais de um código.
- R6. Pedido vazio: `cupomUnico.check` devolve `false` quando `order.lines` está vazio.
- R7. Registro: `configurarCupons(config)` **acrescenta** a action e a condition às nativas (não substitui `config.promotionOptions.promotionActions` nem `promotionConditions`). `code` em snake_case; `description` em `pt_BR` e `en`.

## Restrições (o que NÃO fazer)

- Não reimplementar o que a `Promotion` nativa já faz: existência e validade do código (`startsAt`/`endsAt`), `usageLimit`, `perCustomerUsageLimit`.
- Não alterar `src/misc/preco.ts`, `src/stuff/`, `src/utils/` nem os testes existentes. Mudanças só em `src/plugins/cupons/` e na linha do plugin em `src/vendure-config.ts`.
- Não instalar dependências. Não tocar em `vendure.sqlite`, migrations ou `synchronize`.
- Não criar entidade, resolver GraphQL ou endpoint: é só promoção.

## Critérios de aceitação

Os testes em `test/cupom.test.ts` (já escritos) passam sem alteração. Os testes existentes continuam verdes. `npm run dev:server` sobe com o plugin registrado.

## Verificação

```bash
npm test
```

Pronto = `npm test` sem falhas + `git status --short` mostrando apenas `src/plugins/cupons/` e `src/vendure-config.ts`.
