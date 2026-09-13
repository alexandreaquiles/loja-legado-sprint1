# Sobre o projeto

Este é um projeto de software moderno que usa tecnologias recentes e segue boas práticas de desenvolvimento. O time é comprometido com qualidade e entrega de valor para os usuários. Somos apaixonados por código limpo e por resolver problemas reais dos nossos clientes com excelência. A loja roda em cima do Vendure, que é um framework de e-commerce headless muito bom, moderno, escalável e amplamente adotado no mercado.

Nossa missão é encantar o cliente em cada clique. Nossos valores são: ownership, colaboração, transparência, foco no cliente, excelência técnica, aprendizado contínuo e diversão (sim, diversão!). Este documento é vivo: todo mundo pode e deve contribuir. Se você leu até aqui, parabéns, você já é parte do time.

> Última revisão completa: março de 2024 (Beltrano). Atualizações pontuais depois disso: várias pessoas, sem data.

# Regras gerais

- Sempre escreva código limpo e legível.
- Siga as boas práticas do mercado.
- Seja cuidadoso ao fazer mudanças.
- Pense bem antes de responder.
- Faça o melhor que puder.
- Nunca esqueça de testar.
- Lembre-se de documentar o código.
- Use nomes descritivos.
- Evite funções muito longas.
- Prefira soluções simples quando possível.
- Não use código desnecessário.
- Tente manter a consistência com o restante do projeto.
- Use TypeScript do jeito certo.
- Não deixe `console.log` perdido (a não ser quando precisar).
- Trate os erros.
- Pense no usuário final.
- Escreva código como se a pessoa que vai mantê-lo fosse um psicopata que sabe onde você mora.
- Deixe o código melhor do que encontrou (regra do escoteiro).
- Quando estiver em dúvida, pergunte. Quando não estiver em dúvida, pergunte também.
- Não reinvente a roda.
- Menos é mais.

# Sobre o código

O código deve ser bem organizado. Use variáveis com nomes descritivos. Evite funções muito longas. Prefira soluções simples quando possível. Não use código desnecessário. Tente manter a consistência com o restante do projeto. Aplique SOLID, DRY, KISS, YAGNI, Clean Architecture, DDD e Hexagonal sempre que fizer sentido. Pense em performance, escalabilidade, manutenibilidade, segurança, acessibilidade e observabilidade. Use os padrões do NestJS, do TypeORM, do GraphQL e do Vendure.

Sobre formatação: 4 espaços (o `vendure-config.ts` usa 4), mas os arquivos novos do Ciclano usam 2, e o Prettier ainda não foi configurado. Use o que parecer melhor. Ponto e vírgula: sim. Aspas: simples, exceto quando forem duplas.

Código novo nosso fica em `src/plugins/<dominio>/`, um plugin por domínio, e é registrado no array `plugins` de `src/vendure-config.ts`. Não crie nada em `src/stuff/` nem em `src/utils/` (é legado da migração; o nome é ruim, a gente sabe).

## Nomenclatura (padrão definido na retro de 2023)

| Coisa | Padrão | Exemplo |
|---|---|---|
| Classes | PascalCase | `CuponsPlugin` |
| Funções | camelCase | `calcSubtotal` |
| Constantes | UPPER_SNAKE_CASE | `TETO_PERCENTUAL` |
| Arquivos | kebab-case | `carrinho-antigo.ts` |
| Pastas | kebab-case | `src/plugins/meu-plugin` |
| Tabelas | snake_case | `order_line` |
| Branches | `feature/JIRA-123-descricao` | `feature/LOJA-1-cupom` |
| `code` de action/condition do Vendure | snake_case | `order_percentage_discount` |

# Testes

Sempre escreva testes para seu código. Testes são importantes para garantir a qualidade do software. Tente ter boa cobertura de testes. Use testes unitários, de integração e end-to-end quando necessário. Testes devem ser rápidos, isolados, repetíveis, auto-verificáveis e oportunos (FIRST). Considere usar Jest, Vitest, Mocha, Cypress ou Playwright.

A meta de cobertura é 80% (definida em 2022, nunca medida). Testes ficam em `test/`, um arquivo por feature, e rodam com `npm test` (Vitest; o Jest foi removido em 2024, se achar alguma menção a Jest é resto). Nos testes de promoção a gente não sobe banco: `ctx` e `order` são objetos falsos com só os campos que a regra lê.

# Git e commits

Use mensagens de commit descritivas. Faça commits pequenos e frequentes. Siga o GitFlow. Não commite código quebrado. Revise o código antes de fazer push. Use branches para novas features. Escreva mensagens de commit no imperativo. Referencie o ticket no commit.

Padrão de mensagem (Conventional Commits, adotado em 2023, seguido às vezes):

```
feat(cupons): adiciona teto de desconto
fix(frete): corrige arredondamento
chore: atualiza dependências
docs: atualiza CLAUDE.md
refactor: melhora código
test: adiciona testes
```

Checklist de PR (copiar no template do PR):

- [ ] Li o CLAUDE.md inteiro
- [ ] Rodei os testes
- [ ] Atualizei a documentação
- [ ] Pedi revisão de pelo menos 2 pessoas (ou 1 se for sexta)
- [ ] Movi o card no Jira
- [ ] Avisei no canal #loja-deploys
- [ ] Não quebrei o relatório da Dona Maria

# Segurança

Pense em segurança. Não exponha dados sensíveis. Valide as entradas do usuário. Use variáveis de ambiente para configurações importantes. Siga o OWASP Top 10. Sanitize inputs. Escape outputs. Use HTTPS. Faça rate limiting. Use autenticação forte. Cuidado com injection no GraphQL. Nunca confie no frontend. Use o princípio do menor privilégio. Faça threat modeling. Mantenha as dependências atualizadas (mas não instale nada sem falar com o time, ver incidente de 2024).

# Sobre a IA

Você é um assistente de programação especialista, sênior, com 15 anos de experiência em TypeScript, Node.js, NestJS, GraphQL, e-commerce, arquitetura de sistemas, performance e segurança. Você deve ajudar o desenvolvedor da melhor forma possível. Use seu conhecimento para entregar soluções de alta qualidade. Seja preciso e detalhado nas respostas. Explique o que você está fazendo em cada passo. Seja rigoroso mas gentil. Considere o contexto da aplicação inteira ao fazer suas recomendações.

Responda sempre em português, a não ser que a pergunta seja em inglês. Use emojis com moderação. Não seja prolixo, mas também não seja curto demais. Antes de qualquer mudança, leia todos os arquivos relevantes do projeto (inclusive `node_modules/@vendure/core`, que é onde está a verdade). Quando terminar, faça um resumo do que fez, do que não fez, do que poderia ter feito e dos próximos passos.

# Comandos

```bash
npm install          # instala dependências (demora; ver incidente de 2024 antes de rodar)
npm run setup        # cria o .env e o vendure.sqlite a partir do seed
npm run dev          # sobe server + worker + dashboard em http://localhost:3000/dashboard
npm test             # Vitest
npm run build        # build de produção (vendure build all)
npm run lint         # ESLint (o Ciclano ia configurar)
npm run migrate      # migrations (ver incidente de 2025 antes de rodar)
docker compose up    # sobe o Postgres local (a gente usava antes do SQLite)
make seed            # popula o banco (Makefile do sistema antigo, apagado)
```

Login do dashboard em dev: `superadmin` / `superadmin`. O GraphiQL fica em `/graphiql` e tem o Shop API e o Admin API.

# Histórico do projeto

A loja começou em 2019 como um script em PHP que rodava no servidor do Fulano. Em 2021 foi migrada para Node.js pela equipe do Ciclano (o carrinho daquela época ainda está em `src/stuff/`). Em 2022 tentamos migrar para TypeScript mas desistimos. Em 2024 o Beltrano migrou tudo para o Vendure, mas só metade do catálogo entrou e o relatório do financeiro continua usando os helpers antigos de `src/misc/`. Existe uma pasta antiga chamada `legacy-php` que já foi apagada mas ainda é mencionada em alguns comentários. O módulo de cupons foi prometido para o Q3 de 2024, depois Q1 de 2025, depois Q4 de 2025; o Fulano começou em `src/stuff/carrinho-antigo.ts` e parou. O cliente reclamou três vezes. O PO atual é a Sicrana. A stakeholder de negócios é a Dona Maria do financeiro, que se preocupa muito com descontos abusivos porque em 2022 um cupom deu 100% de desconto e a loja perdeu R$ 40 mil em um fim de semana.

Linha do tempo resumida:

| Ano | O que aconteceu | Quem |
|---|---|---|
| 2019 | Loja em PHP no servidor do Fulano | Fulano |
| 2020 | Pandemia: vendas triplicam, servidor cai toda sexta | Fulano |
| 2021 | Reescrita em Node.js (Express) | Ciclano e equipe |
| 2022 | Tentativa de TypeScript (abandonada); cupom de 100% | Ciclano |
| 2023 | Contratação de agência para o front (contrato encerrado) | Sicrana |
| 2024 | Migração para o Vendure 2; metade do catálogo | Beltrano |
| 2025 | Upgrade para o Vendure 3; SQLite no lugar do Postgres em dev | Beltrano |
| 2026 | Time novo; IA no fluxo; este arquivo | todo mundo |

# Histórico de incidentes (postmortems resumidos)

Todos os postmortems completos ficam no Confluence (espaço LOJA, página "Incidentes", pedir acesso à Sicrana).

## INC-2022-07 · Cupom de 100% (fim de semana perdido)

- **O que houve:** um cupom de campanha foi configurado com 100% em vez de 10%. Rodou de sexta à noite até domingo.
- **Impacto:** R$ 40 mil em pedidos com total zero. A Dona Maria descobriu na planilha de segunda.
- **Causa raiz:** o sistema antigo aceitava qualquer percentual e não havia revisão da configuração.
- **Ações:** "criar um teto de desconto" (pendente desde então, é o módulo de cupons); "revisar campanhas em dupla" (seguido por dois meses).

## INC-2023-02 · Diferença de um centavo no fechamento

- **O que houve:** o relatório do financeiro não batia com o gateway por centavos em milhares de pedidos.
- **Causa raiz:** alguém fez conta de desconto em reais com `number` de ponto flutuante (`99.9 * 0.1`).
- **Ação:** dinheiro é sempre **inteiro em centavos**, igual ao Vendure ("minor units": R$ 100,00 = `10000`). Arredondar uma vez, com `Math.round`, no fim da conta. Nunca guardar nem comparar reais com vírgula.

## INC-2023-05 · Chave do gateway no GitHub

- **O que houve:** o `.env` foi commitado num PR de sexta. A chave `PAGAMENTO_API_KEY` ficou pública por 40 minutos.
- **Ação:** chave rotacionada; `.env` no `.gitignore`; ninguém lê nem cola o conteúdo do `.env` em chat, ticket ou ferramenta de IA.

## INC-2023-11 · Black Friday e a fila de e-mails

- **O que houve:** a fila de e-mails de confirmação travou e 3 mil clientes não receberam o pedido.
- **Causa raiz:** o worker não estava rodando em produção (só o server).
- **Ação:** subir sempre server e worker (`npm run dev` sobe os dois em dev). O Beltrano escreveu um runbook de 14 páginas no Confluence.

## INC-2024-03 · Lockfile quebrado

- **O que houve:** alguém rodou `npm install pacote-qualquer` para testar uma ideia, o lockfile mudou 4 mil linhas e o deploy quebrou por conflito de versão do `better-sqlite3`.
- **Ação:** não instalar dependência sem combinar com o time.

## INC-2024-09 · Desconto que aumentou o pedido

- **O que houve:** uma promoção nova somou R$ 15 ao total em vez de descontar.
- **Causa raiz:** a `PromotionOrderAction` devolvia o valor positivo. No Vendure, action de pedido devolve o desconto **negativo** em centavos (`-1500`).
- **Ação:** antes de escrever action ou condition de promoção, ler os exemplos oficiais em `node_modules/@vendure/core/dist/config/promotion/actions/` (por exemplo `order-percentage-discount-action.js`) e `node_modules/@vendure/core/dist/config/promotion/conditions/` (por exemplo `min-order-amount-condition.js`).

## INC-2025-01 · Imposto contado duas vezes

- **O que houve:** um desconto percentual foi calculado sobre o valor com imposto num canal cujos preços não incluem imposto. O cliente pagou menos do que devia e a nota saiu errada.
- **Causa raiz:** a regra ignorou `ctx.channel.pricesIncludeTax`.
- **Ação:** a base de qualquer desconto é `order.subTotalWithTax` quando `ctx.channel.pricesIncludeTax` é true e `order.subTotal` quando é false (é o que as actions nativas do Vendure fazem). O canal padrão do seed hoje está com `pricesIncludeTax = false`.

## INC-2025-06 · Coluna sumiu em produção

- **O que houve:** alguém ligou `dbConnectionOptions.synchronize: true` para "testar rapidinho" apontando para uma cópia que não era cópia. O TypeORM apagou uma coluna de custom field.
- **Ação:** nunca ligar `synchronize`, nunca rodar migration sem o Beltrano, nunca apagar ou recriar o `vendure.sqlite` de alguém.

## INC-2025-10 · Cupom reinventado

- **O que houve:** um PR implementou validação de data de cupom, contagem de uso e busca de código na mão, dentro de um resolver novo. Tudo isso a `Promotion` do Vendure já faz (`couponCode`, `startsAt`/`endsAt`, `usageLimit`, `perCustomerUsageLimit`). O PR foi fechado depois de três semanas de revisão.
- **Ação:** regra de negócio nova de promoção é uma `PromotionCondition` ou `PromotionAction` registrada por plugin em `config.promotionOptions`, somando às nativas, sem entidade, resolver ou endpoint novo.

# Arquitetura

A loja é um monólito modular headless. O Vendure roda sobre NestJS e expõe duas APIs GraphQL: Shop API (`/shop-api`, para a vitrine) e Admin API (`/admin-api`, para o dashboard). Há um server (HTTP) e um worker (jobs em fila: e-mail, reindexação de busca). Em dev o banco é SQLite (`vendure.sqlite` na raiz); em produção é Postgres 15 gerenciado. A vitrine (storefront) fica em outro repositório, feito pela agência em 2023, em Next.js 13 com pages router.

```
[Vitrine Next.js] --GraphQL--> [Vendure server :3000] --TypeORM--> [SQLite/Postgres]
                                      |
                                  [job queue] ---> [Vendure worker] ---> [SMTP]
                                      |
                              [nfe-worker (Python)] ---> [SEFAZ]
```

Configuração em tempo de execução: `src/vendure-config.ts`. Variáveis de ambiente lidas lá e passadas para os plugins por `Plugin.init()`. Os helpers de `src/misc/preco.ts` (`calcSubtotal`, `aplicarDesconto`, `frete`) são do relatório mensal do financeiro e não podem mudar: a planilha da Dona Maria depende do resultado exato deles.

# Schema das entidades (TypeORM, copiado do banco de dev em 2025)

Tabela `order`:

| Coluna | Tipo | Nulo | Observação |
|---|---|---|---|
| id | integer | não | PK |
| createdAt | datetime | não | |
| updatedAt | datetime | não | |
| type | varchar | não | Regular, Seller, Aggregate |
| code | varchar | não | único, ex.: `W8YZQ3KZ1H8N2` |
| state | varchar | não | AddingItems, ArrangingPayment, PaymentAuthorized, PaymentSettled, Shipped, Delivered, Cancelled... |
| active | boolean | não | |
| orderPlacedAt | datetime | sim | |
| couponCodes | simple-array | não | lista de códigos aplicados |
| shippingAddress | simple-json | não | |
| billingAddress | simple-json | não | |
| currencyCode | varchar | não | USD no seed |
| subTotal | integer | não | centavos, sem imposto |
| subTotalWithTax | integer | não | centavos, com imposto |
| shipping | integer | não | centavos |
| shippingWithTax | integer | não | centavos |
| customerId | integer | sim | FK customer |
| channelId | integer | não | FK channel |
| aggregateOrderId | integer | sim | multivendor, não usamos |

Tabela `order_line`:

| Coluna | Tipo | Nulo | Observação |
|---|---|---|---|
| id | integer | não | PK |
| orderId | integer | não | FK order |
| productVariantId | integer | não | FK product_variant |
| quantity | integer | não | |
| orderPlacedQuantity | integer | não | |
| listPrice | integer | não | centavos |
| listPriceIncludesTax | boolean | não | |
| adjustments | simple-json | não | descontos por linha |
| taxLines | simple-json | não | |
| initialListPrice | integer | sim | |
| sellerChannelId | integer | sim | |
| shippingLineId | integer | sim | |

Tabela `promotion`:

| Coluna | Tipo | Nulo | Observação |
|---|---|---|---|
| id | integer | não | PK |
| createdAt | datetime | não | |
| updatedAt | datetime | não | |
| deletedAt | datetime | sim | soft delete |
| startsAt | datetime | sim | |
| endsAt | datetime | sim | |
| couponCode | varchar | sim | |
| perCustomerUsageLimit | integer | sim | |
| usageLimit | integer | sim | |
| enabled | boolean | não | |
| conditions | simple-json | não | `[{ code, args: [{ name, value }] }]` |
| actions | simple-json | não | `[{ code, args: [{ name, value }] }]` |
| priorityScore | integer | não | |

Tabela `promotion_translation`: `id`, `languageCode`, `name`, `description`, `baseId` (FK promotion), `createdAt`, `updatedAt`.

Tabela `customer`:

| Coluna | Tipo | Nulo | Observação |
|---|---|---|---|
| id | integer | não | PK |
| title | varchar | sim | |
| firstName | varchar | não | |
| lastName | varchar | não | |
| phoneNumber | varchar | sim | |
| emailAddress | varchar | não | |
| userId | integer | sim | FK user |
| deletedAt | datetime | sim | |

Tabela `product_variant`: `id`, `sku`, `enabled`, `trackInventory`, `outOfStockThreshold`, `useGlobalOutOfStockThreshold`, `productId`, `taxCategoryId`, `featuredAssetId`, `deletedAt`, `createdAt`, `updatedAt`. Preço fica em `product_variant_price` (`price` inteiro em centavos, `currencyCode`, `channelId`, `variantId`).

Tabela `shipping_method`: `id`, `code`, `checker` (simple-json), `calculator` (simple-json), `fulfillmentHandlerCode`, `deletedAt`. Tabela `shipping_line`: `id`, `orderId`, `shippingMethodId`, `listPrice`, `listPriceIncludesTax`, `adjustments`, `taxLines`.

Tabela `channel`: `id`, `code`, `token`, `defaultLanguageCode`, `availableLanguageCodes`, `defaultCurrencyCode`, `availableCurrencyCodes`, `pricesIncludeTax`, `trackInventory`, `outOfStockThreshold`, `defaultTaxZoneId`, `defaultShippingZoneId`, `sellerId`.

# API do Vendure (lista completa de queries e mutations que usamos)

Shop API: activeOrder, activeChannel, activeCustomer, product, products, collection, collections, search, facets, eligibleShippingMethods, eligiblePaymentMethods, availableCountries, orderByCode, me, nextOrderStates, addItemToOrder, adjustOrderLine, removeOrderLine, removeAllOrderLines, applyCouponCode, removeCouponCode, setOrderShippingAddress, setOrderBillingAddress, setOrderShippingMethod, addPaymentToOrder, transitionOrderToState, setCustomerForOrder, login, logout, registerCustomerAccount, verifyCustomerAccount, refreshCustomerVerification, requestPasswordReset, resetPassword, updateCustomer, updateCustomerPassword, requestUpdateCustomerEmailAddress, updateCustomerEmailAddress, createCustomerAddress, updateCustomerAddress, deleteCustomerAddress.

Admin API: administrators, administrator, activeAdministrator, assets, asset, channels, channel, collections, collection, countries, country, customerGroups, customerGroup, customers, customer, facets, facet, globalSettings, job, jobs, jobsById, jobQueues, order, orders, paymentMethods, paymentMethod, productOptionGroups, productOptionGroup, search, products, product, productVariants, productVariant, promotion, promotions, promotionConditions, promotionActions, provinces, province, roles, role, sellers, seller, shippingMethods, shippingMethod, shippingEligibilityCheckers, shippingCalculators, fulfillmentHandlers, stockLocations, stockLocation, tags, tag, taxCategories, taxCategory, taxRates, taxRate, zones, zone, me, testShippingMethod, testEligibleShippingMethods, pendingSearchIndexUpdates, metricSummary, entityDuplicators, scheduledTasks.

(o Vendure já conhece tudo isso, mas achamos bom deixar registrado aqui para contexto)

## Admin API: assinaturas e tipos (colado do schema do `@vendure/core` 3.7)

Promoções:

```graphql
type Query {
    promotion(id: ID!): Promotion
    promotions(options: PromotionListOptions): PromotionList!
    promotionConditions: [ConfigurableOperationDefinition!]!
    promotionActions: [ConfigurableOperationDefinition!]!
}

type Mutation {
    createPromotion(input: CreatePromotionInput!): CreatePromotionResult!
    updatePromotion(input: UpdatePromotionInput!): UpdatePromotionResult!
    deletePromotion(id: ID!): DeletionResponse!
    deletePromotions(ids: [ID!]!): [DeletionResponse!]!
    assignPromotionsToChannel(input: AssignPromotionsToChannelInput!): [Promotion!]!
    removePromotionsFromChannel(input: RemovePromotionsFromChannelInput!): [Promotion!]!
}

input PromotionListOptions

input PromotionTranslationInput {
    id: ID
    languageCode: LanguageCode!
    name: String
    description: String
}
input CreatePromotionInput {
    enabled: Boolean!
    startsAt: DateTime
    endsAt: DateTime
    couponCode: String
    perCustomerUsageLimit: Int
    usageLimit: Int
    conditions: [ConfigurableOperationInput!]!
    actions: [ConfigurableOperationInput!]!
    translations: [PromotionTranslationInput!]!
}

input UpdatePromotionInput {
    id: ID!
    enabled: Boolean
    startsAt: DateTime
    endsAt: DateTime
    couponCode: String
    perCustomerUsageLimit: Int
    usageLimit: Int
    conditions: [ConfigurableOperationInput!]
    actions: [ConfigurableOperationInput!]
    translations: [PromotionTranslationInput!]
}

input AssignPromotionsToChannelInput {
    promotionIds: [ID!]!
    channelId: ID!
}

input RemovePromotionsFromChannelInput {
    promotionIds: [ID!]!
    channelId: ID!
}

type MissingConditionsError implements ErrorResult {
    errorCode: ErrorCode!
    message: String!
}

union CreatePromotionResult = Promotion | MissingConditionsError
union UpdatePromotionResult = Promotion | MissingConditionsError
type Promotion implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    startsAt: DateTime
    endsAt: DateTime
    couponCode: String
    perCustomerUsageLimit: Int
    usageLimit: Int
    name: String!
    description: String!
    enabled: Boolean!
    conditions: [ConfigurableOperation!]!
    actions: [ConfigurableOperation!]!
    translations: [PromotionTranslation!]!
}

type PromotionTranslation {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    languageCode: LanguageCode!
    name: String!
    description: String!
}

type PromotionList implements PaginatedList {
    items: [Promotion!]!
    totalItems: Int!
}
```

Operações configuráveis (usadas por promoção e frete):

```graphql
type ConfigurableOperation {
    code: String!
    args: [ConfigArg!]!
}

type ConfigurableOperationDefinition {
    code: String!
    args: [ConfigArgDefinition!]!
    description: String!
}

input ConfigArgInput {
    name: String!
    value: String!
}

input ConfigurableOperationInput {
    code: String!
    arguments: [ConfigArgInput!]!
}

type ConfigArg {
    name: String!
    value: String!
}

type ConfigArgDefinition {
    name: String!
    type: String!
    list: Boolean!
    required: Boolean!
    defaultValue: JSON
    label: String
    description: String
    ui: JSON
}

type DeletionResponse {
    result: DeletionResult!
    message: String
}
```

Pedidos:

```graphql
type Query {
    order(id: ID!): Order
    orders(options: OrderListOptions): OrderList!
    eligibleShippingMethodsForDraftOrder(orderId: ID!): [ShippingMethodQuote!]!
}

type Mutation {
    settlePayment(id: ID!): SettlePaymentResult!
    cancelPayment(id: ID!): CancelPaymentResult!
    addFulfillmentToOrder(input: FulfillOrderInput!): AddFulfillmentToOrderResult!
    cancelOrder(input: CancelOrderInput!): CancelOrderResult!
    refundOrder(input: RefundOrderInput!): RefundOrderResult!
    settleRefund(input: SettleRefundInput!): SettleRefundResult!
    addNoteToOrder(input: AddNoteToOrderInput!): Order!
    updateOrderNote(input: UpdateOrderNoteInput!): HistoryEntry!
    deleteOrderNote(id: ID!): DeletionResponse!
    transitionOrderToState(id: ID!, state: String!): TransitionOrderToStateResult
    transitionFulfillmentToState(id: ID!, state: String!): TransitionFulfillmentToStateResult!
    transitionPaymentToState(id: ID!, state: String!): TransitionPaymentToStateResult!
    setOrderCustomFields(input: UpdateOrderInput!): Order
    setOrderCustomer(input: SetOrderCustomerInput!): Order
    modifyOrder(input: ModifyOrderInput!): ModifyOrderResult!
    addManualPaymentToOrder(input: ManualPaymentInput!): AddManualPaymentToOrderResult!
    createDraftOrder: Order!
    deleteDraftOrder(orderId: ID!): DeletionResponse!
    addItemToDraftOrder(orderId: ID!, input: AddItemToDraftOrderInput!): UpdateOrderItemsResult!
    adjustDraftOrderLine(orderId: ID!, input: AdjustDraftOrderLineInput!): UpdateOrderItemsResult!
    removeDraftOrderLine(orderId: ID!, orderLineId: ID!): RemoveOrderItemsResult!
    setCustomerForDraftOrder(
        orderId: ID!
        customerId: ID
        input: CreateCustomerInput
    ): SetCustomerForDraftOrderResult!
    setDraftOrderShippingAddress(orderId: ID!, input: CreateAddressInput!): Order!
    setDraftOrderBillingAddress(orderId: ID!, input: CreateAddressInput!): Order!
    unsetDraftOrderShippingAddress(orderId: ID!): Order!
    unsetDraftOrderBillingAddress(orderId: ID!): Order!
    setDraftOrderCustomFields(orderId: ID!, input: UpdateOrderInput!): Order!
    applyCouponCodeToDraftOrder(orderId: ID!, couponCode: String!): ApplyCouponCodeResult!
    removeCouponCodeFromDraftOrder(orderId: ID!, couponCode: String!): Order
    setDraftOrderShippingMethod(orderId: ID!, shippingMethodId: ID!): SetOrderShippingMethodResult!
}

enum OrderType {
    Regular
    Seller
    Aggregate
}

type Order implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    type: OrderType!
    orderPlacedAt: DateTime
    code: String!
    state: String!
    active: Boolean!
    customer: Customer
    shippingAddress: OrderAddress
    billingAddress: OrderAddress
    lines: [OrderLine!]!
    surcharges: [Surcharge!]!
    discounts: [Discount!]!
    couponCodes: [String!]!
    promotions: [Promotion!]!
    payments: [Payment!]
    fulfillments: [Fulfillment!]
    totalQuantity: Int!
    subTotal: Money!
    subTotalWithTax: Money!
    currencyCode: CurrencyCode!
    shippingLines: [ShippingLine!]!
    shipping: Money!
    shippingWithTax: Money!
    total: Money!
    totalWithTax: Money!
    taxSummary: [OrderTaxSummary!]!
    history(options: HistoryEntryListOptions): HistoryEntryList!
}

type OrderTaxSummary {
    description: String!
    taxRate: Float!
    taxBase: Money!
    taxTotal: Money!
}

type OrderAddress {
    fullName: String
    company: String
    streetLine1: String
    streetLine2: String
    city: String
    province: String
    postalCode: String
    country: String
    countryCode: String
    phoneNumber: String
}

type OrderList implements PaginatedList {
    items: [Order!]!
    totalItems: Int!
}

type ShippingLine {
    id: ID!
    shippingMethod: ShippingMethod!
    price: Money!
    priceWithTax: Money!
    discountedPrice: Money!
    discountedPriceWithTax: Money!
    discounts: [Discount!]!
}

type Discount {
    adjustmentSource: String!
    type: AdjustmentType!
    description: String!
    amount: Money!
    amountWithTax: Money!
}

type OrderLine implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    productVariant: ProductVariant!
    featuredAsset: Asset
    unitPrice: Money!
    unitPriceWithTax: Money!
    unitPriceChangeSinceAdded: Money!
    unitPriceWithTaxChangeSinceAdded: Money!
    discountedUnitPrice: Money!
    discountedUnitPriceWithTax: Money!
    proratedUnitPrice: Money!
    proratedUnitPriceWithTax: Money!
    quantity: Int!
    orderPlacedQuantity: Int!
    taxRate: Float!
    linePrice: Money!
    linePriceWithTax: Money!
    discountedLinePrice: Money!
    discountedLinePriceWithTax: Money!
    proratedLinePrice: Money!
    proratedLinePriceWithTax: Money!
    lineTax: Money!
    discounts: [Discount!]!
    taxLines: [TaxLine!]!
    order: Order!
    fulfillmentLines: [FulfillmentLine!]
}

type Payment implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    method: String!
    amount: Money!
    state: String!
    transactionId: String
    errorMessage: String
    refunds: [Refund!]!
    metadata: JSON
}

type RefundLine {
    orderLine: OrderLine!
    orderLineId: ID!
    quantity: Int!
    refund: Refund!
    refundId: ID!
}

type Refund implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    items: Money!
    shipping: Money!
    adjustment: Money!
    total: Money!
    method: String
    state: String!
    transactionId: String
    reason: String
    lines: [RefundLine!]!
    paymentId: ID!
    metadata: JSON
}

type FulfillmentLine {
    orderLine: OrderLine!
    orderLineId: ID!
    quantity: Int!
    fulfillment: Fulfillment!
    fulfillmentId: ID!
}

type Fulfillment implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    lines: [FulfillmentLine!]!
    summary: [FulfillmentLine!]! @deprecated(reason: "Use the `lines` field instead")
    state: String!
    method: String!
    trackingCode: String
}

type Surcharge implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    description: String!
    sku: String
    taxLines: [TaxLine!]!
    price: Money!
    priceWithTax: Money!
    taxRate: Float!
}
```

Frete:

```graphql
type Query {
    shippingMethods(options: ShippingMethodListOptions): ShippingMethodList!
    shippingMethod(id: ID!): ShippingMethod
    shippingEligibilityCheckers: [ConfigurableOperationDefinition!]!
    shippingCalculators: [ConfigurableOperationDefinition!]!
    fulfillmentHandlers: [ConfigurableOperationDefinition!]!
    testShippingMethod(input: TestShippingMethodInput!): TestShippingMethodResult!
    testEligibleShippingMethods(input: TestEligibleShippingMethodsInput!): [ShippingMethodQuote!]!
}

type Mutation {
    createShippingMethod(input: CreateShippingMethodInput!): ShippingMethod!
    updateShippingMethod(input: UpdateShippingMethodInput!): ShippingMethod!
    deleteShippingMethod(id: ID!): DeletionResponse!
    deleteShippingMethods(ids: [ID!]!): [DeletionResponse!]!

    assignShippingMethodsToChannel(input: AssignShippingMethodsToChannelInput!): [ShippingMethod!]!

    removeShippingMethodsFromChannel(input: RemoveShippingMethodsFromChannelInput!): [ShippingMethod!]!
}

input ShippingMethodListOptions

input ShippingMethodTranslationInput {
    id: ID
    languageCode: LanguageCode!
    name: String
    description: String
}

input CreateShippingMethodInput {
    code: String!
    fulfillmentHandler: String!
    checker: ConfigurableOperationInput!
    calculator: ConfigurableOperationInput!
    translations: [ShippingMethodTranslationInput!]!
}

input UpdateShippingMethodInput {
    id: ID!
    code: String
    fulfillmentHandler: String
    checker: ConfigurableOperationInput
    calculator: ConfigurableOperationInput
    translations: [ShippingMethodTranslationInput!]!
}

input TestShippingMethodInput {
    checker: ConfigurableOperationInput!
    calculator: ConfigurableOperationInput!
    shippingAddress: CreateAddressInput!
    lines: [TestShippingMethodOrderLineInput!]!
}

input TestEligibleShippingMethodsInput {
    shippingAddress: CreateAddressInput!
    lines: [TestShippingMethodOrderLineInput!]!
}

input TestShippingMethodOrderLineInput {
    productVariantId: ID!
    quantity: Int!
}

type TestShippingMethodResult {
    eligible: Boolean!
    quote: TestShippingMethodQuote
}

type TestShippingMethodQuote {
    price: Money!
    priceWithTax: Money!
    metadata: JSON
}

input AssignShippingMethodsToChannelInput {
    shippingMethodIds: [ID!]!
    channelId: ID!
}

input RemoveShippingMethodsFromChannelInput {
    shippingMethodIds: [ID!]!
    channelId: ID!
}
type ShippingMethod implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    languageCode: LanguageCode!
    code: String!
    name: String!
    description: String!
    fulfillmentHandlerCode: String!
    checker: ConfigurableOperation!
    calculator: ConfigurableOperation!
    translations: [ShippingMethodTranslation!]!
}

type ShippingMethodTranslation {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    languageCode: LanguageCode!
    name: String!
    description: String!
}

type ShippingMethodList implements PaginatedList {
    items: [ShippingMethod!]!
    totalItems: Int!
}
```

Clientes:

```graphql
type Query {
    customers(options: CustomerListOptions): CustomerList!
    customer(id: ID!): Customer
}

type Mutation {
    createCustomer(input: CreateCustomerInput!, password: String): CreateCustomerResult!

    updateCustomer(input: UpdateCustomerInput!): UpdateCustomerResult!

    deleteCustomer(id: ID!): DeletionResponse!

    deleteCustomers(ids: [ID!]!): [DeletionResponse!]!

    createCustomerAddress(customerId: ID!, input: CreateAddressInput!): Address!

    updateCustomerAddress(input: UpdateAddressInput!): Address!

    deleteCustomerAddress(id: ID!): Success!

    addNoteToCustomer(input: AddNoteToCustomerInput!): Customer!
    updateCustomerNote(input: UpdateCustomerNoteInput!): HistoryEntry!
    deleteCustomerNote(id: ID!): DeletionResponse!
}

input UpdateCustomerInput {
    id: ID!
    title: String
    firstName: String
    lastName: String
    phoneNumber: String
    emailAddress: String
}

input CustomerFilterParameter {
    postalCode: StringOperators
}

input CustomerListOptions

input AddNoteToCustomerInput {
    id: ID!
    note: String!
    isPublic: Boolean!
}

input UpdateCustomerNoteInput {
    noteId: ID!
    note: String!
}

union CreateCustomerResult = Customer | EmailAddressConflictError
union UpdateCustomerResult = Customer | EmailAddressConflictError
type Customer implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String
    firstName: String!
    lastName: String!
    phoneNumber: String
    emailAddress: String!
    addresses: [Address!]
    orders(options: OrderListOptions): OrderList!
    user: User
}

type CustomerList implements PaginatedList {
    items: [Customer!]!
    totalItems: Int!
}
```

# Instruções do nfe-worker (serviço de nota fiscal)

> Copiado do README do repositório `nfe-worker` para ficar tudo num lugar só.

O `nfe-worker` é um serviço em Python 3.9 que escuta a fila `pedidos.pagos` (RabbitMQ) e emite a NF-e na SEFAZ. Não fica neste repositório.

```bash
poetry install
cp .env.sample .env         # pedir o certificado A1 para a Sicrana
make up                     # docker compose com RabbitMQ e Postgres
make worker                 # sobe o consumidor
make test                   # pytest
make homologacao            # aponta para a SEFAZ de homologação
```

- O certificado A1 (`certificado.pfx`) vence todo mês de maio. Quando vencer, as notas param e ninguém percebe até o contador ligar.
- Nunca emitir nota em produção a partir da máquina local.
- CFOP padrão: 5102 (venda dentro do estado) e 6108 (venda para consumidor de outro estado).
- A alíquota de ICMS vem de uma planilha que a Dona Maria atualiza no Drive.
- Se a SEFAZ devolver rejeição 539 (duplicidade), não reenviar: abrir chamado.
- Logs no Graylog, stream `nfe`. Alertas no canal #nfe-alertas (silenciado desde 2024).

# Glossário

- **Minor units:** centavos. O Vendure guarda todo dinheiro como inteiro.
- **Channel:** canal de venda; cada um tem moeda, idioma e `pricesIncludeTax`.
- **Promotion:** promoção configurada no dashboard, com conditions e actions.
- **PromotionCondition:** diz se a promoção vale para o pedido (`check` devolve boolean).
- **PromotionAction:** calcula o desconto (`execute` devolve número negativo).
- **Collection:** agrupamento de produtos (não confundir com categoria do sistema antigo).
- **Facet:** atributo filtrável (cor, tamanho, marca).
- **Fulfillment:** entrega/separação de um pedido.
- **Surcharge:** acréscimo avulso no pedido.
- **Dona Maria:** financeiro. Se ela reclamar, é prioridade.

# Onboarding de pessoas novas

1. Pedir acesso ao GitHub, ao Jira, ao Confluence, ao Graylog e ao Drive do financeiro.
2. Ler este arquivo inteiro (leva uns 40 minutos).
3. Ler o runbook da Black Friday.
4. Almoçar com a Sicrana.
5. Rodar a loja localmente e fazer um pedido de teste.
6. Pegar um card com a etiqueta `bom-primeiro-card` (não existe nenhum no momento).
7. Perguntar ao Fulano qualquer coisa sobre preço.

# FAQ

**Posso apagar `src/stuff/`?** Não. O Beltrano quer confirmar que o relatório de estoque não depende dele.

**Por que o dashboard está em inglês?** Porque a tradução do Vendure para pt_BR está incompleta. Toda `description` de action ou condition nova deve ter `pt_BR` e `en`.

**Onde fica a lógica de frete?** Em `src/misc/preco.ts` (`frete()`, grátis a partir de R$ 200) para o relatório, e nos `ShippingMethod` do dashboard para a loja de verdade. Sim, são dois lugares. Sim, eles divergem às vezes.

**O que fazer se os testes falharem na main?** Rodar de novo. Se continuar, avisar no #loja-dev.

**Posso usar IA?** Pode, desde que siga este arquivo.
