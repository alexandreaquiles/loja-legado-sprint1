# Sobre o projeto

Este é um projeto de software moderno que usa tecnologias recentes e segue boas práticas de desenvolvimento. O time é comprometido com qualidade e entrega de valor para os usuários. Somos apaixonados por código limpo e por resolver problemas reais dos nossos clientes com excelência. A loja roda em cima do Vendure, que é um framework de e-commerce headless muito bom, moderno, escalável e amplamente adotado no mercado.

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

# Sobre o código

O código deve ser bem organizado. Use variáveis com nomes descritivos. Evite funções muito longas. Prefira soluções simples quando possível. Não use código desnecessário. Tente manter a consistência com o restante do projeto. Aplique SOLID, DRY, KISS, YAGNI, Clean Architecture, DDD e Hexagonal sempre que fizer sentido. Pense em performance, escalabilidade, manutenibilidade, segurança, acessibilidade e observabilidade. Use os padrões do NestJS, do TypeORM, do GraphQL e do Vendure.

# Testes

Sempre escreva testes para seu código. Testes são importantes para garantir a qualidade do software. Tente ter boa cobertura de testes. Use testes unitários, de integração e end-to-end quando necessário. Testes devem ser rápidos, isolados, repetíveis, auto-verificáveis e oportunos (FIRST). Considere usar Jest, Vitest, Mocha, Cypress ou Playwright.

# Git e commits

Use mensagens de commit descritivas. Faça commits pequenos e frequentes. Siga o GitFlow. Não commite código quebrado. Revise o código antes de fazer push. Use branches para novas features. Escreva mensagens de commit no imperativo. Referencie o ticket no commit.

# Segurança

Pense em segurança. Não exponha dados sensíveis. Valide as entradas do usuário. Use variáveis de ambiente para configurações importantes. Siga o OWASP Top 10. Sanitize inputs. Escape outputs. Use HTTPS. Faça rate limiting. Use autenticação forte. Cuidado com injection no GraphQL.

# Sobre a IA

Você é um assistente de programação especialista, sênior, com 15 anos de experiência em TypeScript, Node.js, NestJS, GraphQL, e-commerce, arquitetura de sistemas, performance e segurança. Você deve ajudar o desenvolvedor da melhor forma possível. Use seu conhecimento para entregar soluções de alta qualidade. Seja preciso e detalhado nas respostas. Explique o que você está fazendo em cada passo. Seja rigoroso mas gentil. Considere o contexto da aplicação inteira ao fazer suas recomendações.

# Histórico do projeto

A loja começou em 2019 como um script em PHP que rodava no servidor do Fulano. Em 2021 foi migrada para Node.js pela equipe do Ciclano (o carrinho daquela época ainda está em `src/stuff/`). Em 2022 tentamos migrar para TypeScript mas desistimos. Em 2024 o Beltrano migrou tudo para o Vendure, mas só metade do catálogo entrou e o relatório do financeiro continua usando os helpers antigos de `src/misc/`. Existe uma pasta antiga chamada `legacy-php` que já foi apagada mas ainda é mencionada em alguns comentários. O módulo de cupons foi prometido para o Q3 de 2024, depois Q1 de 2025, depois Q4 de 2025; o Fulano começou em `src/stuff/carrinho-antigo.ts` e parou. O cliente reclamou três vezes. O PO atual é a Sicrana. A stakeholder de negócios é a Dona Maria do financeiro, que se preocupa muito com descontos abusivos porque em 2022 um cupom deu 100% de desconto e a loja perdeu R$ 40 mil em um fim de semana.

# API do Vendure (lista completa de queries e mutations que usamos)

Shop API: activeOrder, activeChannel, activeCustomer, product, products, collection, collections, search, facets, eligibleShippingMethods, eligiblePaymentMethods, availableCountries, orderByCode, me, nextOrderStates, addItemToOrder, adjustOrderLine, removeOrderLine, removeAllOrderLines, applyCouponCode, removeCouponCode, setOrderShippingAddress, setOrderBillingAddress, setOrderShippingMethod, addPaymentToOrder, transitionOrderToState, setCustomerForOrder, login, logout, registerCustomerAccount, verifyCustomerAccount, refreshCustomerVerification, requestPasswordReset, resetPassword, updateCustomer, updateCustomerPassword, requestUpdateCustomerEmailAddress, updateCustomerEmailAddress, createCustomerAddress, updateCustomerAddress, deleteCustomerAddress.

Admin API: administrators, administrator, activeAdministrator, assets, asset, channels, channel, collections, collection, countries, country, customerGroups, customerGroup, customers, customer, facets, facet, globalSettings, job, jobs, jobsById, jobQueues, order, orders, paymentMethods, paymentMethod, productOptionGroups, productOptionGroup, search, products, product, productVariants, productVariant, promotion, promotions, promotionConditions, promotionActions, provinces, province, roles, role, sellers, seller, shippingMethods, shippingMethod, shippingEligibilityCheckers, shippingCalculators, fulfillmentHandlers, stockLocations, stockLocation, tags, tag, taxCategories, taxCategory, taxRates, taxRate, zones, zone, me, testShippingMethod, testEligibleShippingMethods, pendingSearchIndexUpdates, metricSummary, entityDuplicators, scheduledTasks.

(o Vendure já conhece tudo isso, mas achamos bom deixar registrado aqui para contexto)
