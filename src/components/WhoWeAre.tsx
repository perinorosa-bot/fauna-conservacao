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
          className="font-serif font-light leading-[1.05] text-forest"
          style={{ fontSize: 'clamp(36px, 5.5vw, 64px)' }}
        >
          Somos um <span className="text-terra">ecossistema</span> que conecta projetos
          e pessoas na área de conservação.
        </h2>
      </div>
    </section>
  )
}
