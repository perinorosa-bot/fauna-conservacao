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
        forest:    '#1A3528',   // tinta nanquim vegetal
        canopy:    '#1E2E20',   // fundo secundário profundo
        prussian:  '#2E5FA3',   // azul prussiano — atlas botânicos / RL navy
        terra:     '#C4522A',   // terracota/vermelho botânico — vida / doação
        leaf:      '#3D4A1E',   // ação primária
        sage:      '#7A9E7E',   // acentos / links
        mist:      '#A89070',   // pedra suave
        cream:     '#EDE5D0',   // papel envelhecido
        parchment: '#F5EFE0',   // pergaminho claro (fundos light)
        ochre:     '#B5834A',   // ocre de mapa antigo
        warm:      '#B5834A',   // alias
        sand:      '#EDE5D0',   // alias
        stone:     '#A89070',   // alias
        coffee:    '#B5834A',   // alias
        gum:       '#7A9E7E',   // alias
        moss:      '#3D4A1E',   // alias
        basalt:    '#1E2E20',   // alias
      },
      fontFamily: {
        // Body, UI labels, small text → Inter (legível)
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // Títulos grandes, headlines → IM Fell English
        serif:   ['var(--font-im-fell)', 'Georgia', 'serif'],
        // Logo e destaques → Vaelia
        display: ['var(--font-vaelia)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}