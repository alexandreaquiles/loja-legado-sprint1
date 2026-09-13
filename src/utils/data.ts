export function hoje(): Date {
  return new Date();
}

// recebe 'YYYY-MM-DD' e diz se ja passou (comparado com hoje)
export function estaExpirado(dataISO: string, agora: Date = hoje()): boolean {
  const limite = new Date(dataISO + 'T23:59:59');
  return agora > limite;
}
