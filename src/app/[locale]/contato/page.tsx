'use client'

import { useState } from 'react'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { useTranslations } from 'next-intl'

type EmailItem = { label: string; value: string }

export default function ContatoPage() {
  const t = useTranslations('contato')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  const emails = t.raw('emails') as EmailItem[]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // In production: call an API route that sends email (e.g., via Resend or Nodemailer)
    // For now we just simulate the send
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  const inputClass = `w-full bg-forest/[0.05] border border-forest/[0.12] rounded-sm px-4 py-3
    text-forest text-sm placeholder:text-forest/30 focus:outline-none focus:border-sage/60 transition-colors`

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />

        <div className="pt-40 pb-28 px-10 max-w-screen-lg mx-auto">
          <div className="grid gap-16 md:grid-cols-2">

            {/* Left */}
            <div>
              <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-5">{t('hero.eyebrow')}</span>
              <h1 className="font-serif text-5xl font-light text-forest mb-6">
                {t('hero.titleBefore')}<em className="italic text-sage">{t('hero.titleEm')}</em>
              </h1>
              <p className="text-forest/50 text-sm leading-loose mb-10 max-w-sm">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col gap-6">
                {emails.map(item => (
                  <div key={item.label}>
                    <p className="text-forest/35 text-[10px] tracking-widest uppercase mb-1">{item.label}</p>
                    <a href={`mailto:${item.value}`}
                       className="text-forest text-sm hover:text-sage transition-colors">
                      {item.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="bg-white/60 border border-forest/[0.08] rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-light text-forest mb-3">{t('form.sentTitle')}</h3>
                  <p className="text-forest/45 text-sm">{t('form.sentDesc')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-forest/50 text-xs tracking-wide block mb-1.5">{t('form.nameLabel')}</label>
                      <input className={inputClass} type="text" placeholder={t('form.namePlaceholder')}
                             value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="text-forest/50 text-xs tracking-wide block mb-1.5">{t('form.emailLabel')}</label>
                      <input className={inputClass} type="email" placeholder={t('form.emailPlaceholder')}
                             value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>

                  <div>
                    <label className="text-forest/50 text-xs tracking-wide block mb-1.5">{t('form.subjectLabel')}</label>
                    <select className={inputClass} value={subject} onChange={e => setSubject(e.target.value)} required>
                      <option value="">{t('form.subjectPlaceholderDefault')}</option>
                      <option>{t('subjects.donation')}</option>
                      <option>{t('subjects.orgRegister')}</option>
                      <option>{t('subjects.press')}</option>
                      <option>{t('subjects.partnership')}</option>
                      <option>{t('subjects.other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-forest/50 text-xs tracking-wide block mb-1.5">{t('form.messageLabel')}</label>
                    <textarea className={`${inputClass} resize-none`} rows={5}
                              placeholder={t('form.messagePlaceholder')}
                              value={message} onChange={e => setMessage(e.target.value)} required />
                  </div>

                  <button type="submit" disabled={loading}
                          className="w-full bg-leaf text-cream text-xs tracking-widest uppercase py-3.5 rounded-sm
                                     hover:bg-sage transition-colors disabled:opacity-50 mt-2">
                    {loading ? t('form.submitting') : t('form.submit')}
                  </button>

                  <p className="text-forest/25 text-xs text-center">
                    {t('form.sla')}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </NavTheme>
  )
}
