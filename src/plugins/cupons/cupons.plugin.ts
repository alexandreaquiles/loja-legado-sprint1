import { PluginCommonModule, RuntimeVendureConfig, VendurePlugin } from '@vendure/core';
import { cupomUnico, descontoPercentualComTeto } from './promocoes';

/** Acrescenta a action e a condition do financeiro às nativas do Vendure (R7). */
export function configurarCupons(config: RuntimeVendureConfig): RuntimeVendureConfig {
  config.promotionOptions.promotionActions = [...(config.promotionOptions.promotionActions ?? []), descontoPercentualComTeto];
  config.promotionOptions.promotionConditions = [...(config.promotionOptions.promotionConditions ?? []), cupomUnico];
  return config;
}

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: configurarCupons,
  compatibility: '^3.0.0',
})
export class CuponsPlugin {}
