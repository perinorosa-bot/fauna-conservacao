// Stripe processing fee estimates. Used for transparency in DonationForm
// and the "cover the fee" opt-in. Real settled amount can vary slightly
// (international card surcharges, IOF, exchange spread) — this is an
// estimate based on Stripe's published BR domestic card pricing.
//
// Source: https://stripe.com/br/pricing (consulted 2026-05)
//   Brazilian cards (domestic): 3.99% + R$0.39
//   USD/EUR cards (default):    2.9%  + $0.30
//
// All amounts are in Stripe's smallest unit (cents).

const BRL_RATE        = 0.0399
const BRL_FIXED_CENTS = 39
const USD_RATE        = 0.029
const USD_FIXED_CENTS = 30

function rates(currency: string): { rate: number; fixed: number } {
  return currency.toLowerCase() === 'brl'
    ? { rate: BRL_RATE, fixed: BRL_FIXED_CENTS }
    : { rate: USD_RATE, fixed: USD_FIXED_CENTS }
}

// Tasa que Stripe deduce de un cobro de `amountCents` antes de transferir
// a la cuenta destino (Connect destination charges, sin application_fee).
export function estimateStripeFee(amountCents: number, currency: string = 'brl'): number {
  const { rate, fixed } = rates(currency)
  return Math.round(amountCents * rate) + fixed
}

// Inverso: si el doador quiere que la ONG reciba `targetCents` netos,
// ¿cuánto tiene que pagar bruto?
//   net = gross - fixed - gross * rate
//   →  gross = (net + fixed) / (1 - rate)
export function grossUpAmount(targetCents: number, currency: string = 'brl'): number {
  const { rate, fixed } = rates(currency)
  return Math.ceil((targetCents + fixed) / (1 - rate))
}
