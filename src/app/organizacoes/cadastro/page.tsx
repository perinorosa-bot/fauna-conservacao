import Nav from '@/components/layout/Nav'
import OrgRegisterForm from '@/components/OrgRegisterForm'

export default function OrgCadastroPage() {
  return (
    <main className="min-h-screen">
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
            <p className="text-cream/55 text-base leading-loose mb-12 max-w-lg">
              A Fauna conecta projetos de conservação a uma audiência global de apoiadores.
              Cadastre-se gratuitamente e comece a publicar atualizações do seu trabalho.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { icon: '○', title: 'Taxa zero sobre doações', desc: 'Fique com 100% do que arrecadar. A plataforma se sustenta de outra forma — não às suas custas.' },
                { icon: '○', title: 'Doações internacionais', desc: 'Receba apoio de qualquer país sem burocracia de câmbio ou compliance.' },
                { icon: '○', title: 'Rede de sinergias', desc: 'Descubra projetos complementares e crie colaborações que ampliam o impacto.' },
                { icon: '○', title: 'Relatórios automáticos', desc: 'A plataforma envia atualizações aos seus doadores automaticamente.' },
              ].map(item => (
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
              Criar perfil da organização
            </h2>
            <OrgRegisterForm />
          </div>
        </div>
      </div>
    </main>
  )
}
