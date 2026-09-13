# loja-legado

Loja em **Vendure 3.7** (TypeScript, NestJS, GraphQL, TypeORM) com SQLite. Dinheiro é sempre **inteiro em centavos** ("minor units" do Vendure); arredondar com `Math.round`.

@AGENTS.md

## Comandos

```bash
npm test          # vitest, ~1 s (obrigatório antes de dizer que terminou)
npm run dev       # server em :3000 + worker + dashboard (/dashboard, superadmin/superadmin)
npm run setup     # recria .env e vendure.sqlite a partir do seed
```

## Onde as coisas ficam

```
src/vendure-config.ts      registra plugins; único arquivo fora de src/plugins/ que pode mudar
src/plugins/<dominio>/     código nosso, um plugin por domínio (VendurePlugin + configuration)
src/misc/preco.ts          helpers antigos (aplicarDesconto, frete); o financeiro usa; NÃO alterar
src/stuff/, src/utils/     legado da migração; não criar nada aqui
test/                      vitest, um arquivo por feature; ctx e order são objetos falsos, sem banco
node_modules/@vendure/core/dist/config/promotion/   exemplos oficiais de PromotionCondition e
                           PromotionAction: leia min-order-amount-condition.js e
                           order-percentage-discount-action.js antes de escrever os seus
```

## Regras do projeto

- Promoções: nunca reimplementar o que a `Promotion` do Vendure já faz (código do cupom, `startsAt`/`endsAt`, `usageLimit`, `perCustomerUsageLimit`). Regra de negócio nova = `PromotionCondition` ou `PromotionAction` registrada pelo plugin em `config.promotionOptions`, somando às nativas.
- Action de pedido devolve número **negativo** em centavos (convenção do Vendure).
- Respeitar `ctx.channel.pricesIncludeTax`: base é `order.subTotalWithTax` quando true, `order.subTotal` quando false.
- `code` em snake_case; `description` em `pt_BR` e `en`.
- Regras puras (só números) ficam em `regras.ts`, sem importar o Vendure, para testar sem banco.
- Especificações ficam em `SPEC.md`. Implementar somente o que está lá.

## Nunca

- Instalar dependências (`npm install`, `npm add`) sem confirmar com o dev.
- Ler ou commitar `.env`.
- Apagar ou recriar `vendure.sqlite`; rodar migrations ou ligar `synchronize`.
- Criar endpoint, entidade ou migration para a tarefa atual: é só promoção.
- Declarar a tarefa concluída sem `npm test` verde.
