const PRICE_TABLE = {
  single: { EUR: 20, COP: 20000 },
  set: { EUR: 40, COP: 150000 },
};

export function getPrice(type, currency) {
  return PRICE_TABLE[type][currency];
}

export function formatAmount(amount, currency) {
  if (currency === 'COP') {
    return `$${amount.toLocaleString('es-CO')} COP`;
  }
  return `${amount} €`;
}

export function formatPrice(type, currency) {
  return formatAmount(getPrice(type, currency), currency);
}
