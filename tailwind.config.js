/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Paleta principal (Forest, do protótipo) ────────────
        forest:    '#1A3528',   // verde profundo — bg principal
        canopy:    '#1E2E20',   // bg secundário
        basalt:    '#0F1A12',   // quase-preto cinematográfico — bg deep
        leaf:      '#3D4A1E',   // verde-folha (ação primária / acento)
        sage:      '#7A9E7E',   // sálvia (links, sucesso)
        mist:      '#A89070',   // pedra suave
        cream:     '#EDE5D0',   // papel envelhecido (texto / fundo claro)
        parchment: '#F5EFE0',   // pergaminho (fundos light)
        ochre:     '#B5834A',   // ocre de mapa antigo
        prussian:  '#2E5FA3',   // azul prussiano
        terra:     '#C4522A',   // terracota — vida / doação (accent)
        moonstone: '#F5F5F5',   // cinza-pedra — substitui o branco em superfícies

        // Aliases mantidos pra não quebrar componentes existentes
        warm:      '#B5834A',
        sand:      '#EDE5D0',
        stone:     '#A89070',
        coffee:    '#B5834A',
        gum:       '#7A9E7E',
        moss:      '#3D4A1E',
      },
      fontFamily: {
        // Teste tipográfico — SpathaFold em todas as famílias
        sans:      ['var(--font-spathafold)', 'system-ui', 'sans-serif'],
        serif:     ['var(--font-spathafold)', 'Georgia', 'serif'],
        display:   ['var(--font-spathafold)', 'Georgia', 'serif'],
        cormorant: ['var(--font-spathafold)', 'Georgia', 'serif'],
        mono:      ['var(--font-spathafold)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
