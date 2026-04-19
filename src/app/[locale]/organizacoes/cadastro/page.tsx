import { getTranslations } from 'next-intl/server'
import Nav from '@/components/layout/Nav'
import OrgRegisterForm from '@/components/OrgRegisterForm'

export default async function OrgCadastroPage() {
  const t = await getTranslations('authForms.orgRegister.pitch')
  const bullets = t.raw('bullets') as { title: string; desc: string }[]

  return (
    <main className="min-h-screen">
      <Nav />
      <div className="pt-40 pb-28 px-14 max-w-screen-xl mx-auto">
        <div className="grid gap-20" style={{ gridTemplateColumns: '1fr 560px' }}>

          {/* Left: pitch */}
          <div className="pt-4">
            <span className="section-eyebrow">{t('eyebrow')}</span>
            <h1 className="font-serif font-light text-cream mb-8 leading-tight"
                style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>
              {t('titleLine1')}<br/>
              <em className="italic text-sage">{t('titleLine2Em')}</em><br/>
              {t('titleLine3')}
            </h1>
            <p className="text-cream/55 text-base leading-loose mb-12 max-w-lg">
              {t('subtitle')}
            </p>

            <div className="flex flex-col gap-6">
              {bullets.map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-sage mt-2 flex-shrink-0"/>
                  <div>
                    <p className="text-cream font-medium text-sm mb-1">{item.title}</p>
                    <p className="text-cream/45 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-canopy/40 border border-white/[0.08] rounded-lg p-10">
            <h2 className="font-serif text-2xl font-light text-cream mb-8">
              {t('formTitle')}
            </h2>
            <OrgRegisterForm />
          </div>
        </div>
      </div>
    </main>
  )
}
