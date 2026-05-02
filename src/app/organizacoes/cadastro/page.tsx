import Nav from '@/components/layout/Nav'
import OrgRegisterForm from '@/components/OrgRegisterForm'

export default function OrgCadastroPage() {
  return (
    <main className="min-h-screen bg-forest">
      <Nav />
      <div className="pt-40 pb-28 px-14 max-w-screen-xl mx-auto">
        <div className="grid gap-20" style={{ gridTemplateColumns: '1fr 560px' }}>

          {/* Left: pitch */}
          <div className="pt-4">
            <span className="section-eyebrow">Para organizações</span>
            <h1 className="font-serif font-light text-cream mb-8 leading-tight"
                style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>
              Alcance doadores que<br/>
              <em className="italic text-sage">já querem apoiar</em><br/>
              sua causa
            </h1>
            <p className="text-cream/80 text-base leading-loose mb-12 max-w-lg">
              A Fauna conecta projetos de conservação a uma audiência global de apoiadores.
              Cadastre-se gratuitamente e comece a publicar atualizações do seu trabalho.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { icon: '○', title: 'Sem taxa de plataforma', desc: 'A Fauna não cobra comissão sobre o que sua organização arrecadar. A única dedução é a tarifa do processador de pagamento (Stripe), aplicada por transação. A plataforma se sustenta de outra forma — não às suas custas.' },
                { icon: '○', title: 'Doações internacionais', desc: 'Receba apoio de qualquer país sem burocracia de câmbio ou compliance.' },
                { icon: '○', title: 'Rede de sinergias', desc: 'Descubra projetos complementares e crie colaborações que ampliam o impacto.' },
                { icon: '○', title: 'Relatórios automáticos', desc: 'A plataforma envia atualizações aos seus doadores automaticamente.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-sage mt-2 flex-shrink-0"/>
                  <div>
                    <p className="text-cream font-medium text-sm mb-1">{item.title}</p>
                    <p className="text-cream/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div
            className="rounded-lg p-10"
            style={{
              background:           'rgba(11, 20, 16, 0.85)',
              border:               '1px solid rgba(237, 229, 208, 0.18)',
              backdropFilter:       'blur(18px) saturate(140%)',
              WebkitBackdropFilter: 'blur(18px) saturate(140%)',
              boxShadow:            '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <h2 className="font-serif text-2xl font-light text-cream mb-8">
              Criar perfil da organização
            </h2>
            <OrgRegisterForm />
          </div>
        </div>
      </div>
    </main>
  )
}
