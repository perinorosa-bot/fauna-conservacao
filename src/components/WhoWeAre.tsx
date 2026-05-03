/* "Quem somos" — declaração de identidade do projeto.
 * Tom: simples, dramático, contraste forte no titular. */
export default function WhoWeAre() {
  return (
    <section
      style={{ padding: '140px 24px', background: '#F5F5F5' }}
    >
      <div className="max-w-[1100px] mx-auto">
        <p className="eyebrow mb-8">Quem somos · O que fazemos</p>

        <h2
          className="font-sans font-light leading-[1.05] text-forest"
          style={{ fontSize: 'clamp(36px, 5.5vw, 64px)' }}
        >
          Somos um <span className="text-terra">ecossistema</span> que conecta projetos
          e pessoas na área de conservação da fauna.
        </h2>

        <p
          className="font-sans font-light text-forest/80 mt-16 ml-auto text-right max-w-[820px] leading-[1.35]"
          style={{ fontSize: 'clamp(22px, 2.6vw, 32px)' }}
        >
          Uma plataforma para <span className="text-terra">quem faz</span> e para{' '}
          <span className="text-terra">quem apoia</span>. A Fauna conecta organizações
          de conservação da fauna a apoiadores do mundo inteiro.
        </p>
      </div>
    </section>
  )
}
