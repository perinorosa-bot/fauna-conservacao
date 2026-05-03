'use client'

import { useState } from 'react'
import Link from 'next/link'

/* Conteúdo editorial — não vem do banco. Edite aqui se quiser ajustar.
 * As contagens (`projects`) são manuais; quando você tiver dados reais por
 * bioma, dá pra trocar pra props vindas do server component. */
type Biome = {
  k:        string
  name:     string
  sci:      string
  coords:   string
  projects: number
  threat:   string
  species:  string[]
  blurb:    string
  image:    string
}

const BIOMES: Biome[] = [
  {
    k: 'oceano',
    name: 'Oceano',
    sci: 'Ecossistemas marinhos',
    coords: "S 23°33' · W 45°12'",
    projects: 58,
    threat: 'Acidificação · pesca predatória · plástico',
    species: ['Chelonia mydas', 'Eubalaena australis', 'Megaptera novaeangliae', 'Carcharodon carcharias'],
    blurb: 'De recifes de coral a baleias-francas em migração — metade de toda a biodiversidade do planeta vive onde não vemos.',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=2400&auto=format&fit=crop&q=85',
  },
  {
    k: 'amazonia',
    name: 'Amazônia',
    sci: 'Floresta tropical úmida',
    coords: "S 03°06' · W 60°01'",
    projects: 74,
    threat: 'Desmatamento · garimpo ilegal · queimadas',
    species: ['Panthera onca', 'Harpia harpyja', 'Inia geoffrensis', 'Ara ararauna'],
    blurb: 'A maior floresta tropical do mundo concentra 10% da biodiversidade conhecida — e perdeu 17% em 50 anos.',
    image: 'https://images.unsplash.com/photo-1602425121300-4a6c2c8f9ab7?w=2400&auto=format&fit=crop&q=85',
  },
  {
    k: 'cerrado',
    name: 'Cerrado',
    sci: 'Savana tropical',
    coords: "S 15°47' · W 47°55'",
    projects: 41,
    threat: 'Avanço agrícola · fragmentação · fogo',
    species: ['Chrysocyon brachyurus', 'Tamandua tetradactyla', 'Tapirus terrestris', 'Ozotoceros bezoarticus'],
    blurb: 'A savana mais biodiversa do planeta — e também a mais ameaçada. Berço de 12 mil espécies de plantas.',
    image: 'https://images.unsplash.com/photo-1615712032526-b3a5b67cf5e2?w=2400&auto=format&fit=crop&q=85',
  },
  {
    k: 'andes',
    name: 'Andes',
    sci: 'Altitudes neotropicais',
    coords: "S 13°09' · W 72°32'",
    projects: 36,
    threat: 'Derretimento glacial · mineração · estradas',
    species: ['Tremarctos ornatus', 'Vultur gryphus', 'Vicugna vicugna', 'Andigena hypoglauca'],
    blurb: 'Páramos, florestas nubladas e glaciares — onde o urso-de-óculos e o condor ainda cruzam os céus.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2400&auto=format&fit=crop&q=85',
  },
  {
    k: 'pantanal',
    name: 'Pantanal',
    sci: 'Planície de inundação',
    coords: "S 17°00' · W 56°30'",
    projects: 38,
    threat: 'Queimadas · hidrelétricas · soja',
    species: ['Panthera onca', 'Hydrochoerus hydrochaeris', 'Jabiru mycteria', 'Pteronura brasiliensis'],
    blurb: 'A maior planície alagada do planeta, onde onças-pintadas patrulham rios e capivaras pastam ao lado de jacarés.',
    image: 'https://images.unsplash.com/photo-1534710961216-75c88202f43e?w=2400&auto=format&fit=crop&q=85',
  },
]

export default function BiomesSection() {
  const [active, setActive] = useState(0)
  const b = BIOMES[active]

  return (
    <section
      className="relative overflow-hidden border-t border-white/[0.08]"
      style={{ background: 'var(--basalt)' }}
    >
      {/* Imagens em camadas com crossfade */}
      <div className="absolute inset-0">
        {BIOMES.map((bi, i) => (
          <div
            key={bi.k}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{
              backgroundImage:    `url("${bi.image}")`,
              backgroundSize:     'cover',
              backgroundPosition: 'center',
              filter:             'brightness(0.45) saturate(0.9) contrast(1.05)',
              opacity:            i === active ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(100deg, rgba(11,20,16,0.9) 0%, rgba(11,20,16,0.55) 50%, rgba(11,20,16,0.3) 100%),
            linear-gradient(to bottom, rgba(11,20,16,0.4) 0%, transparent 30%, rgba(11,20,16,0.5) 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.12, mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }}
      />

      {/* Conteúdo */}
      <div
        className="relative z-[3] max-w-[1400px] mx-auto"
        style={{ padding: '120px 24px', minHeight: 720 }}
      >
        <div className="grid grid-cols-1 lg:[grid-template-columns:1.1fr_1fr] gap-10 lg:gap-20 items-center">

          {/* Esquerda — detalhes do bioma */}
          <div className="text-cream">
            <p className="eyebrow mb-6">Biomas</p>

            <h2
              className="font-sans text-cream font-light leading-[0.95] mb-3.5"
              style={{
                fontSize:      'clamp(56px, 8vw, 120px)',
                letterSpacing: '-0.02em',
                textShadow:    '0 4px 40px rgba(0,0,0,0.5)',
              }}
            >
              {b.name}
            </h2>
            <p className="font-sans italic text-cream/55 mb-10" style={{ fontSize: 22 }}>
              {b.sci}
            </p>

            <p className="text-cream/85 max-w-[520px] mb-10" style={{ fontSize: 17, lineHeight: 1.6 }}>
              {b.blurb}
            </p>

            {/* Mini-grid: projetos ativos | ameaças */}
            <div className="grid grid-cols-2 max-w-[520px] border-t border-cream/[0.18]">
              <div className="py-5 pr-6 border-r border-cream/[0.12]">
                <div className="label-mono mb-2.5">Projetos ativos</div>
                <div className="font-sans font-light text-cream leading-none" style={{ fontSize: 48 }}>
                  {b.projects}
                </div>
              </div>
              <div className="py-5 pl-6">
                <div className="label-mono mb-2.5">Principais ameaças</div>
                <div className="text-[13px] text-cream/[0.78] leading-[1.55]">{b.threat}</div>
              </div>
            </div>

            <Link
              href={`/projetos?biome=${encodeURIComponent(b.name)}`}
              className="inline-flex items-center mt-9 font-mono text-[10px] tracking-[0.22em] uppercase
                         border border-white/20 text-cream/70 px-7 py-3.5 rounded-[2px]
                         hover:bg-white/5 hover:text-cream hover:border-white/40 transition-all"
            >
              Ver projetos em {b.name.toLowerCase()} →
            </Link>
          </div>

          {/* Direita — espécies + switcher de bioma */}
          <div className="lg:justify-self-end w-full lg:max-w-[420px]">
            {/* Card "Espécies em foco" */}
            <div
              className="border border-cream/[0.15] mb-5"
              style={{
                background:           'rgba(11,20,16,0.5)',
                backdropFilter:       'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                padding:              28,
              }}
            >
              <div className="label-mono mb-5" style={{ color: 'var(--terra)' }}>
                Espécies em foco
              </div>
              {b.species.map((sp, i) => (
                <div
                  key={sp}
                  className="flex justify-between items-baseline py-3.5"
                  style={{
                    borderTop: i === 0 ? '1px solid rgba(237,229,208,0.15)' : '1px solid rgba(237,229,208,0.08)',
                  }}
                >
                  <div className="font-sans italic font-light text-cream" style={{ fontSize: 18 }}>
                    {sp}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream/45">
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>

            {/* Switcher de bioma */}
            <div className="flex flex-col gap-0.5">
              {BIOMES.map((bi, i) => (
                <button
                  key={bi.k}
                  onClick={() => setActive(i)}
                  className="flex justify-between items-center px-4 py-3.5 transition-colors"
                  style={{
                    background: i === active ? 'rgba(196,90,54,0.15)' : 'rgba(11,20,16,0.35)',
                    border:     `1px solid ${i === active ? 'var(--terra)' : 'rgba(237,229,208,0.1)'}`,
                    cursor:     'pointer',
                    textAlign:  'left',
                  }}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="font-mono text-[9px] tracking-[0.2em]"
                          style={{ color: i === active ? 'var(--terra)' : 'rgba(237,229,208,0.4)' }}>
                      0{i + 1}
                    </span>
                    <span className="font-sans font-light"
                          style={{
                            fontSize: 18,
                            color:    i === active ? 'var(--cream)' : 'rgba(237,229,208,0.75)',
                          }}>
                      {bi.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px]"
                        style={{ color: i === active ? 'var(--terra)' : 'rgba(237,229,208,0.35)' }}>
                    {bi.projects} proj.
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
