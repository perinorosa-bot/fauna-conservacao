'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const AMOUNTS = [10, 25, 50, 100, 250]

type DonationType = 'once' | 'monthly'

// ─── Inner checkout form (inside Elements) ────────────────────────────────────
function CheckoutForm({
  amount,
  donationType,
  onSuccess,
}: {
  amount: number
  donationType: DonationType
  onSuccess: () => void
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })
    setLoading(false)
    if (stripeError) setError(stripeError.message ?? 'Erro ao processar pagamento.')
    else onSuccess()
  }

  const label = donationType === 'monthly'
    ? `Confirmar R$ ${(amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`
    : `Confirmar doação de R$ ${(amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button type="submit" disabled={loading || !stripe}
              className="w-full bg-sage text-cream text-xs tracking-widests uppercase py-3.5 rounded-sm
                         hover:bg-leaf transition-colors disabled:opacity-50">
        {loading ? 'Processando...' : label}
      </button>
    </form>
  )
}

// ─── Main donation form ───────────────────────────────────────────────────────
export default function DonationForm({
  projectId,
  orgHasStripe,
}: {
  projectId: string
  orgHasStripe: boolean
}) {
  const [donationType, setDonationType] = useState<DonationType>('once')
  const [step, setStep]                 = useState<'amount' | 'info' | 'pay' | 'done'>('amount')
  const [amount, setAmount]             = useState(5000) // cents
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName]       = useState('')
  const [message, setMessage]           = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const displayAmount = amount / 100

  // reset to amount step whenever donation type changes
  function handleTypeChange(type: DonationType) {
    setDonationType(type)
    setStep('amount')
    setClientSecret('')
    setError('')
  }

  async function handleProceed() {
    if (!donorName.trim()) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/donations/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        amount,
        currency: 'brl',
        donorName,
        message,
        recurring: donationType === 'monthly',
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || !data.clientSecret) {
      setError(data.error ?? 'Erro ao iniciar pagamento.')
      return
    }
    setClientSecret(data.clientSecret)
    setStep('pay')
  }

  const inputClass = `w-full bg-white/[0.06] border border-white/[0.10] rounded-sm px-4 py-3
    text-cream text-sm placeholder:text-cream/25 focus:outline-none focus:border-sage/50 transition-colors`

  if (!orgHasStripe) {
    return (
      <div className="bg-canopy/40 border border-white/[0.08] rounded-2xl p-6 text-center">
        <p className="text-cream/40 text-sm leading-relaxed">
          Doações para este projeto estarão disponíveis em breve.
        </p>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="bg-canopy/40 border border-white/[0.08] rounded-2xl p-8 text-center">
        <p className="text-sage text-3xl mb-3">✓</p>
        <p className="text-cream font-serif text-xl font-light mb-2">Obrigada pelo apoio!</p>
        <p className="text-cream/40 text-sm">
          {donationType === 'monthly'
            ? `Doação mensal de R$ ${displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ativada com sucesso.`
            : `Sua doação de R$ ${displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi processada com sucesso.`}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-canopy/40 border border-white/[0.08] rounded-2xl overflow-hidden">

      {/* ── Donate once / monthly toggle ─────────────────────────────────── */}
      <div className="grid grid-cols-2 border-b border-white/[0.08]">
        <button
          onClick={() => handleTypeChange('once')}
          className={`py-3.5 text-xs tracking-widests uppercase transition-all duration-200 ${
            donationType === 'once'
              ? 'bg-white/[0.09] text-cream font-medium border-b-2 border-sage'
              : 'text-cream/40 hover:text-cream/70 hover:bg-white/[0.04]'
          }`}
        >
          Doação pontual
        </button>
        <button
          onClick={() => handleTypeChange('monthly')}
          className={`py-3.5 text-xs tracking-widests uppercase transition-all duration-200 ${
            donationType === 'monthly'
              ? 'bg-white/[0.09] text-cream font-medium border-b-2 border-sage'
              : 'text-cream/40 hover:text-cream/70 hover:bg-white/[0.04]'
          }`}
        >
          Doação mensal
        </button>
      </div>

      <div className="p-6">
        {/* Monthly badge */}
        {donationType === 'monthly' && step === 'amount' && (
          <div className="bg-sage/10 border border-sage/20 rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
            <span className="text-sage text-sm mt-0.5">♻</span>
            <p className="text-sage/80 text-xs leading-relaxed">
              Doações mensais garantem suporte contínuo ao projeto. Cancele quando quiser.
            </p>
          </div>
        )}

        {/* ── Step: pay ──────────────────────────────────────────────────── */}
        {step === 'pay' && clientSecret && (
          <>
            <button onClick={() => setStep('info')}
                    className="text-cream/30 text-xs tracking-widests uppercase hover:text-cream/60 transition-colors mb-5 block">
              ← Voltar
            </button>
            <p className="text-cream/50 text-xs tracking-widests uppercase mb-4">
              {donationType === 'monthly'
                ? `Doação mensal · R$ ${displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`
                : `Doação · R$ ${displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </p>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary:    '#8faa78',
                    colorBackground: '#1c2e1c',
                    colorText:       '#f5f0e8',
                    borderRadius:    '4px',
                  },
                },
              }}
            >
              <CheckoutForm amount={amount} donationType={donationType} onSuccess={() => setStep('done')} />
            </Elements>
          </>
        )}

        {/* ── Step: info ─────────────────────────────────────────────────── */}
        {step === 'info' && (
          <>
            <button onClick={() => setStep('amount')}
                    className="text-cream/30 text-xs tracking-widests uppercase hover:text-cream/60 transition-colors mb-5 block">
              ← Voltar
            </button>
            <p className="text-cream/50 text-xs tracking-widests uppercase mb-4">
              {donationType === 'monthly'
                ? `Mensal · R$ ${displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`
                : `Pontual · R$ ${displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-cream/50 text-xs tracking-wide block mb-1.5">Seu nome *</label>
                <input type="text" value={donorName} onChange={e => setDonorName(e.target.value)}
                       placeholder="Como prefere ser chamada" className={inputClass} autoFocus />
              </div>
              <div>
                <label className="text-cream/50 text-xs tracking-wide block mb-1.5">
                  Mensagem <span className="text-cream/25">(opcional)</span>
                </label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                          placeholder="Deixe uma mensagem para a organização..."
                          rows={3} className={`${inputClass} resize-none`} />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={handleProceed} disabled={loading || !donorName.trim()}
                      className="w-full bg-sage text-cream text-xs tracking-widests uppercase py-3.5 rounded-sm
                                 hover:bg-leaf transition-colors disabled:opacity-50">
                {loading ? 'Aguarde...' : 'Continuar →'}
              </button>
            </div>
          </>
        )}

        {/* ── Step: amount ───────────────────────────────────────────────── */}
        {step === 'amount' && (
          <>
            <p className="text-cream font-serif text-lg font-light mb-5">
              {donationType === 'monthly' ? 'Valor mensal' : 'Escolha um valor'}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {AMOUNTS.map(a => (
                <button key={a} type="button"
                        onClick={() => { setAmount(a * 100); setCustomAmount('') }}
                        className={`py-2.5 text-sm rounded-sm border transition-colors ${
                          amount === a * 100 && !customAmount
                            ? 'border-sage bg-sage/15 text-sage'
                            : 'border-white/[0.12] text-cream/60 hover:border-sage/40 hover:text-cream'
                        }`}>
                  R$ {a}
                </button>
              ))}
              <input type="number" placeholder="Outro" value={customAmount} min={5}
                     onChange={e => {
                       setCustomAmount(e.target.value)
                       const v = parseFloat(e.target.value)
                       if (!isNaN(v) && v >= 5) setAmount(Math.round(v * 100))
                     }}
                     className={`py-2.5 text-sm rounded-sm border text-center bg-white/[0.06]
                                 text-cream placeholder:text-cream/25 focus:outline-none transition-colors ${
                       customAmount ? 'border-sage' : 'border-white/[0.12]'
                     }`}
              />
            </div>
            <p className="text-cream/25 text-[10px] mb-5">Valor mínimo R$ 5</p>

            <button onClick={() => setStep('info')} disabled={amount < 500}
                    className="w-full bg-sage text-cream text-xs tracking-widests uppercase py-3.5 rounded-sm
                               hover:bg-leaf transition-colors disabled:opacity-50
                               shadow-[0_2px_12px_rgba(107,142,90,0.35)]">
              {donationType === 'monthly'
                ? `Apoiar com R$ ${displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês →`
                : `Apoiar com R$ ${displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} →`}
            </button>

            <p className="text-cream/20 text-[10px] text-center mt-3">
              100% vai para o projeto · Pagamento seguro via Stripe
            </p>
          </>
        )}
      </div>
    </div>
  )
}
