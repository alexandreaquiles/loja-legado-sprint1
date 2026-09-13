# loja-legado

Loja em **Vendure 3.7** (TypeScript, NestJS, GraphQL, TypeORM) com SQLite em dev. Gerada com `@vendure/create` em 2024 e migrada do sistema antigo. Este arquivo vale para qualquer agente (Claude Code, Codex, Cursor); o `CLAUDE.md` só importa este e acrescenta o que é do Claude Code.

## Comandos

```bash
npm test          # vitest, ~1 s; obrigatório antes de dizer que terminou
npx tsc --noEmit  # checa tipos de src/ (inclui o registro dos plugins), ~2 s
npm run dev       # server em :3000 + worker + dashboard (/dashboard, superadmin/superadmin)
npm run setup     # recria .env e vendure.sqlite a partir do seed, se não existirem
npm run build     # build de produção (server, worker e dashboard); lento, só antes de release
```

Depois de mudar código em `src/`: `npm test` e `npx tsc --noEmit`. Não rode `npm run build` a cada mudança (o scaffold do Vendure sugere isso; aqui o ciclo é teste e tipos).

## Onde as coisas ficam

```
src/vendure-config.ts      configuração; registra plugins no array plugins
src/plugins/<dominio>/     código nosso, um plugin Vendure por domínio
src/misc/preco.ts          helpers do relatório do financeiro (calcSubtotal, aplicarDesconto, frete); NÃO alterar
src/stuff/, src/utils/     legado da migração; não criar nada aqui
test/                      vitest, um arquivo por feature; ctx e order são objetos falsos, sem banco
static/                    assets e templates de e-mail
SPEC.md                    spec da tarefa atual; implementar somente o que está lá
docs/                      planos (docs/plano.md) e material de apoio
```

Exemplos oficiais de promoção, para ler antes de escrever os seus:
`node_modules/@vendure/core/dist/config/promotion/actions/order-percentage-discount-action.js` e
`node_modules/@vendure/core/dist/config/promotion/conditions/min-order-amount-condition.js`.

## Regras do projeto

- Dinheiro é sempre **inteiro em centavos** ("minor units" do Vendure: R$ 100,00 = `10000`); arredondar uma vez, com `Math.round`.
- Promoções: nunca reimplementar o que a `Promotion` nativa já faz (código do cupom, `startsAt`/`endsAt`, `usageLimit`, `perCustomerUsageLimit`). Regra nova = `PromotionCondition` ou `PromotionAction` registrada pelo plugin em `config.promotionOptions`, **somando** às nativas.
- Action de pedido devolve o desconto **negativo** em centavos.
- Respeitar `ctx.channel.pricesIncludeTax`: base `order.subTotalWithTax` quando true, `order.subTotal` quando false.
- `code` de action/condition em snake_case; `description` em `pt_BR` e `en`.
- Regras puras (só números) em `regras.ts` dentro do plugin, sem importar o Vendure, para testar sem banco.
- Configuração lida de variáveis de ambiente em `vendure-config.ts` e passada ao plugin por `Plugin.init()`.

## Nunca

- Ler, colar ou commitar o `.env`.
- Instalar dependências (`npm install`, `npm add`) sem confirmar com o dev.
- Apagar ou recriar `vendure.sqlite`; rodar migrations; ligar `dbConnectionOptions.synchronize`.
- Criar entidade, resolver ou endpoint quando a tarefa é só promoção.
- Alterar teste de aceite para ele passar.
- Declarar a tarefa concluída sem `npm test` verde.
