'use client'

import { useState, useMemo } from 'react'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'geral',
    label: 'Perguntas gerais',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    description: 'O que é a Fauna, como funciona, idiomas e transparência financeira.',
    count: 6,
    items: [
      {
        q: 'O que é a Fauna?',
        a: 'A Fauna é um hub global de conservação animal. Conectamos organizações que trabalham com proteção à fauna selvagem a doadores e apoiadores — individuais e institucionais — de todo o mundo, oferecendo uma plataforma de conteúdo, descoberta de novos projetos e doação direta.',
      },
      {
        q: 'A Fauna é uma ONG?',
        a: 'A Fauna é uma plataforma digital, não uma ONG. Não gerenciamos projetos de conservação diretamente — somos a infraestrutura que conecta quem faz o trabalho de campo a quem quer apoiá-lo.',
      },
      {
        q: 'A Fauna fica com parte das doações?',
        a: 'Não. As doações vão diretamente da conta do doador para a conta Stripe da organização escolhida. A Fauna não gerencia o dinheiro e ele não passa pela nossa conta. Eventuais taxas de processamento são cobradas pelo Stripe.',
      },
      {
        q: 'Como a Fauna se sustenta financeiramente?',
        a: 'Através de contribuições voluntárias diretas à plataforma e da venda de produtos na nossa loja. Nossa existência não depende de comissão sobre doações.',
      },
      {
        q: 'A plataforma está disponível em quais idiomas?',
        a: 'A Fauna está disponível em português, inglês e espanhol. Aceitamos organizações e doadores de qualquer país do mundo.',
      },
      {
        q: 'A Fauna é responsável pelo uso das doações pelas organizações?',
        a: 'A Fauna realiza um processo de verificação de todas as organizações cadastradas, mas não audita o uso dos recursos após as doações serem realizadas. As doações vão diretamente da conta do doador para a conta Stripe da organização, sem intermediação da Fauna. A responsabilidade pelo uso dos recursos é integralmente da organização que os recebe. Caso identifique irregularidades em algum projeto, entre em contato conosco em contatofauna@proton.me.',
      },
    ],
  },
  {
    id: 'organizacoes',
    label: 'Para organizações',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    description: 'Cadastro, documentos, projetos, recebimento de doações e conta Stripe.',
    count: 14,
    items: [
      {
        q: 'Qualquer organização pode se cadastrar?',
        a: 'Sim, desde que trabalhe com projetos de conservação de fauna selvagem. Toda organização passa por um processo de avaliação antes de ser publicada na plataforma e recebe um selo de verificação.',
      },
      {
        q: 'Qual a vantagem de cadastrar um projeto na Fauna?',
        a: 'A Fauna oferece visibilidade global para projetos de conservação animal, conectando organizações a uma rede de doadores e apoiadores engajados. Além disso, a plataforma é gratuita para cadastro, as doações chegam diretamente à organização sem intermediação financeira, e cada projeto ganha uma página dedicada com recursos visuais e atualizações.',
      },
      {
        q: 'Se a organização já faz captação de recursos com seus próprios meios, ela pode inscrever projetos na Fauna mesmo assim?',
        a: 'Sim, pode. A Fauna não é excludente em relação a outras formas de captação. A plataforma funciona como um canal adicional de visibilidade e doação, complementando as estratégias que a organização já utiliza.',
      },
      {
        q: 'A Fauna cobra alguma taxa para cadastro?',
        a: 'Não. O cadastro é totalmente gratuito. A Fauna não cobra taxa de adesão, mensalidade nem comissão sobre doações. Nos financiamos por meio de contribuições voluntárias diretas à plataforma e da nossa loja de produtos — o que significa que 100% do valor doado a um projeto vai diretamente à organização responsável.',
      },
      {
        q: 'Organizações internacionais podem se cadastrar?',
        a: 'Sim. A Fauna é uma plataforma global e aceita organizações de qualquer país do mundo. Para o cadastro, é necessário apresentar documentação legal válida no país de origem da organização. O processo de verificação é o mesmo independentemente da localização.',
      },
      {
        q: 'Em que idiomas posso publicar meu projeto?',
        a: 'Os projetos podem ser publicados em português e/ou inglês. Como a Fauna é uma plataforma global, recomendamos publicar nas duas línguas para ampliar o alcance e aumentar as chances de o projeto ser encontrado por doadores de diferentes países.',
      },
      {
        q: 'A Fauna divulga minha organização nas redes sociais?',
        a: 'Sim, desde que sua organização tenha o selo de validação da Fauna e projetos ativos cadastrados na plataforma. Para solicitar divulgação, envie um e-mail para contatofauna@proton.me com as informações da organização e os materiais de marketing que deseja compartilhar. Nossa equipe avaliará e entrará em contato.',
      },
      {
        q: 'Quais documentos são necessários para o cadastro?',
        a: 'Para garantir a segurança dos doadores, a Fauna exige que todas as organizações possuam alguma forma de registro legal válido no seu país de origem — como CNPJ, associação registrada, fundação ou equivalente internacional — e evidências de projetos ativos. Podemos solicitar relatórios de atividades ou materiais que demonstrem o trabalho realizado. Projetos completamente informais, sem nenhuma formalização jurídica, não são aceitos na plataforma no momento. Se sua iniciativa está em processo de formalização, entre em contato conosco em contatofauna@proton.me para avaliarmos seu caso.',
      },
      {
        q: 'Quanto tempo demora a avaliação?',
        a: 'O prazo médio é de 5 a 10 dias úteis após o envio completo da documentação.',
      },
      {
        q: 'Posso cadastrar mais de um projeto?',
        a: 'Sim. Não há limite de projetos por organização. Recomendamos que cada projeto tenha informações completas e atualizadas.',
      },
      {
        q: 'Como recebo as doações?',
        a: 'Diretamente na sua conta Stripe. A Fauna não intermedia o pagamento — a conexão é feita diretamente entre o doador e a sua conta.',
      },
      {
        q: 'Minha organização precisa ter uma conta Stripe para receber doações?',
        a: 'Sim. Como as doações são processadas diretamente pelo Stripe, a organização precisa ter uma conta Stripe ativa e válida no seu país para receber contribuições. O Stripe está disponível em mais de 40 países. Caso sua organização esteja em um país onde o Stripe ainda não opera, entre em contato conosco em contatofauna@proton.me para avaliarmos alternativas.',
      },
      {
        q: 'Posso editar ou encerrar um projeto depois de publicado?',
        a: 'Sim. Projetos podem ser editados ou encerrados a qualquer momento pela dashboard da organização. Ao encerrar um projeto, ele deixa de aparecer publicamente na plataforma e não recebe novas contribuições. Todas as edições e o histórico do projeto ficam salvos na dashboard.',
      },
      {
        q: 'A Fauna pode suspender minha organização?',
        a: 'Sim. Reservamo-nos o direito de suspender organizações que não atendam aos nossos critérios de verificação, que forneçam informações falsas, ou que violem nossos Termos e Condições.',
      },
    ],
  },
  {
    id: 'doadores',
    label: 'Para doadores',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    description: 'Segurança, formas de pagamento, recibos, deduções e doações recorrentes.',
    count: 9,
    items: [
      {
        q: 'Minha doação é segura?',
        a: 'Sim. Todos os pagamentos são processados pelo Stripe, uma das plataformas de pagamento mais seguras do mundo. A Fauna não armazena dados financeiros dos doadores.',
      },
      {
        q: 'Através de quais modalidades de pagamento posso realizar uma doação?',
        a: 'As doações são processadas pelo Stripe e aceitam cartão de crédito, cartão de débito e outros métodos disponíveis na sua região. O PIX ainda não está disponível como modalidade de pagamento, mas estamos trabalhando para incluí-lo em breve.',
      },
      {
        q: 'A partir de que valor posso realizar uma doação?',
        a: 'Não há valor mínimo estabelecido pela Fauna. O Stripe pode aplicar um valor mínimo de processamento, que pode variar. Qualquer contribuição, por menor que seja, é bem-vinda e vai diretamente ao projeto escolhido.',
      },
      {
        q: 'Posso escolher para qual projeto específico quero doar?',
        a: 'Sim. Você navega pelos projetos disponíveis e escolhe exatamente para onde sua contribuição vai.',
      },
      {
        q: 'Vou receber comprovante da minha doação?',
        a: 'O Stripe envia um comprovante de pagamento automaticamente. Para recibos fiscais ou comprovantes específicos, entre em contato diretamente com a organização beneficiada.',
      },
      {
        q: 'Posso cancelar uma doação recorrente?',
        a: 'Sim. Doações recorrentes podem ser canceladas a qualquer momento diretamente na sua conta na plataforma ou via Stripe.',
      },
      {
        q: 'Como sei que o projeto é legítimo?',
        a: 'Todas as organizações passam por verificação antes de serem publicadas. Exigimos documentação legal e evidências de projetos ativos.',
      },
      {
        q: 'Minha doação é dedutível do imposto de renda?',
        a: 'A Fauna é uma plataforma de conexão e não emite recibos fiscais. As doações realizadas através da Fauna não são dedutíveis do imposto de renda por meio da plataforma. Caso precise de documentação para fins fiscais, entre em contato diretamente com a organização beneficiada — algumas organizações possuem qualificação legal para emitir recibos dedutíveis no seu país de origem.',
      },
      {
        q: 'Sou uma organização ou fundação e gostaria de apoiar financeiramente um projeto cadastrado na Fauna. Posso realizar a doação pelo site?',
        a: 'Doações institucionais — realizadas por organizações, fundações ou empresas — não são processadas diretamente pelo site. Nesse caso, entre em contato conosco em contatofauna@proton.me informando qual projeto deseja apoiar e os detalhes da sua organização. Faremos a conexão diretamente entre as duas partes.',
      },
    ],
  },
]

const ALL_ITEMS = SECTIONS.flatMap(s => s.items.map(item => ({ ...item, section: s.label })))

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({ q, a, section }: { q: string; a: string; section?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`border-b border-forest/[0.08] last:border-0 ${open ? 'bg-leaf/[0.03]' : ''} transition-colors`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-5 px-6 py-5 text-left group"
      >
        <div className="flex-1">
          {section && (
            <span className="text-[9px] tracking-[0.2em] uppercase text-forest/30 block mb-1">{section}</span>
          )}
          <span className={`font-serif text-[17px] font-light leading-snug transition-colors duration-200 ${
            open ? 'text-leaf' : 'text-forest group-hover:text-forest/70'
          }`}>
            {q}
          </span>
        </div>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300 ${
          open
            ? 'bg-leaf text-cream rotate-45'
            : 'bg-forest/8 text-forest/50 group-hover:bg-forest/12 group-hover:text-forest'
        }`}
          style={{ background: open ? undefined : 'rgba(17,51,25,0.07)' }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <line x1="5.5" y1="1" x2="5.5" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="1" y1="5.5" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <p className="text-forest/60 text-[15px] leading-relaxed px-6 pb-6 pr-16">
          {a}
        </p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  const [query, setQuery]           = useState('')
  const [activeSection, setActive]  = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return ALL_ITEMS.filter(
      item =>
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q)
    )
  }, [query])

  const visibleSection = activeSection
    ? SECTIONS.find(s => s.id === activeSection)!
    : null

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-[#f5f4f0]">
        <Nav />

        {/* ── Hero + search ────────────────────────────────────────────────── */}
        <section className="bg-forest pt-36 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sage/70 text-[10px] tracking-[0.3em] uppercase mb-4">Central de ajuda</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-cream mb-3 leading-tight">
              Como podemos{' '}
              <em className="italic text-sage">ajudar?</em>
            </h1>
            <p className="text-cream/40 text-sm mb-10">
              Busque uma dúvida ou explore as categorias abaixo.
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" className="text-forest/40">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setActive(null) }}
                placeholder="Ex: como recebo doações, taxa de cadastro..."
                className="w-full bg-white text-forest text-sm pl-12 pr-5 py-4 rounded-xl
                           border-2 border-transparent focus:border-sage/40 focus:outline-none
                           placeholder:text-forest/30 shadow-lg shadow-black/20 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-4 text-forest/30 hover:text-forest/60 text-lg"
                >×</button>
              )}
            </div>
          </div>
        </section>

        {/* ── Category cards ───────────────────────────────────────────────── */}
        {!results && (
          <section className="px-6 -mt-6 mb-12 max-w-screen-lg mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActive(prev => prev === s.id ? null : s.id)}
                  className={`group text-left rounded-2xl p-7 border-2 transition-all duration-200 shadow-sm
                    ${activeSection === s.id
                      ? 'bg-forest border-forest text-cream shadow-lg shadow-forest/20'
                      : 'bg-white border-transparent hover:border-forest/15 hover:shadow-md'
                    }`}
                >
                  <div className={`mb-4 transition-colors ${
                    activeSection === s.id ? 'text-sage' : 'text-leaf group-hover:text-forest'
                  }`}>
                    {s.icon}
                  </div>
                  <h3 className={`font-serif text-xl font-light mb-1 ${
                    activeSection === s.id ? 'text-cream' : 'text-forest'
                  }`}>
                    {s.label}
                  </h3>
                  <p className={`text-[12px] leading-relaxed mb-4 ${
                    activeSection === s.id ? 'text-cream/55' : 'text-forest/45'
                  }`}>
                    {s.description}
                  </p>
                  <span className={`text-[10px] tracking-widest uppercase font-medium ${
                    activeSection === s.id ? 'text-sage' : 'text-leaf'
                  }`}>
                    {s.count} perguntas →
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Search results ───────────────────────────────────────────────── */}
        {results && (
          <section className="px-6 py-10 max-w-screen-lg mx-auto">
            <p className="text-forest/40 text-sm mb-6">
              {results.length === 0
                ? 'Nenhum resultado para '
                : `${results.length} resultado${results.length !== 1 ? 's' : ''} para `}
              <strong className="text-forest">"{query}"</strong>
            </p>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-forest/[0.08] p-12 text-center shadow-sm">
                <p className="text-forest/30 text-sm mb-2">Não encontramos nada com esse termo.</p>
                <p className="text-forest/40 text-sm">
                  Tente palavras diferentes ou{' '}
                  <Link href="/contato" className="text-leaf hover:underline">entre em contato</Link>.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-forest/[0.08] shadow-sm overflow-hidden">
                {results.map((item, i) => (
                  <AccordionItem key={i} q={item.q} a={item.a} section={item.section} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Section FAQ (when card is clicked) ───────────────────────────── */}
        {!results && visibleSection && (
          <section className="px-6 pb-10 max-w-screen-lg mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-leaf">{visibleSection.icon}</div>
              <h2 className="font-serif text-2xl font-light text-forest">{visibleSection.label}</h2>
              <span className="text-[10px] tracking-widest text-forest/30 uppercase bg-forest/5 px-3 py-1 rounded-full ml-1">
                {visibleSection.items.length} perguntas
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-forest/[0.08] shadow-sm overflow-hidden">
              {visibleSection.items.map((item, i) => (
                <AccordionItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        )}

        {/* ── All FAQs (default, no search, no section selected) ───────────── */}
        {!results && !visibleSection && (
          <section className="px-6 pb-12 max-w-screen-lg mx-auto">
            <p className="text-[10px] tracking-widest uppercase text-forest/30 mb-6">
              Perguntas populares
            </p>
            <div className="bg-white rounded-2xl border border-forest/[0.08] shadow-sm overflow-hidden">
              {SECTIONS.flatMap(s => s.items.slice(0, 2)).slice(0, 6).map((item, i) => (
                <AccordionItem key={i} q={item.q} a={item.a} section={SECTIONS.find(s => s.items.includes(item))?.label} />
              ))}
            </div>
            <p className="text-center text-forest/30 text-xs mt-5">
              Clique em uma categoria acima para ver todas as perguntas
            </p>
          </section>
        )}

        {/* ── Contact CTA — full-width banner ──────────────────────────────── */}
        <section className="bg-forest mt-6 px-6 py-20 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-cream/50 text-base mb-10">
            Nossa equipe está aqui para ajudar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contato"
              className="bg-sage text-cream text-[11px] tracking-[0.18em] uppercase font-medium
                         px-12 py-5 rounded-sm hover:bg-leaf transition-colors
                         shadow-[0_4px_20px_rgba(107,142,90,0.35)]"
            >
              Enviar uma mensagem
            </Link>
            <a
              href="mailto:contatofauna@proton.me"
              className="text-cream/40 text-xs hover:text-sage transition-colors tracking-wide"
            >
              contatofauna@proton.me
            </a>
          </div>
        </section>
      </main>
    </NavTheme>
  )
}
