import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import Link from 'next/link'

export const metadata = { title: 'Política de Cookies — Fauna' }

export default function CookiesPage() {
  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />
        <div className="pt-40 pb-28 px-10 max-w-screen-md mx-auto">
          <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-5">Legal</span>
          <h1 className="font-serif text-5xl font-light text-forest mb-3">
            Política de <em className="italic text-sage">Cookies</em>
          </h1>
          <p className="text-forest/40 text-sm mb-14">Última atualização: abril de 2025</p>

          <div className="prose-fauna">

            <h2>O que são cookies</h2>
            <p>Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles permitem que o site lembre suas preferências e mantenha você autenticado entre visitas.</p>

            <h2>Cookies que usamos</h2>

            <div className="overflow-x-auto mb-8">
              <table>
                <thead>
                  <tr>
                    <th>Cookie</th>
                    <th>Tipo</th>
                    <th>Finalidade</th>
                    <th>Validade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>sb-*</code></td>
                    <td>Essencial</td>
                    <td>Sessão de autenticação Supabase</td>
                    <td>7 dias</td>
                  </tr>
                  <tr>
                    <td><code>fauna-lang</code></td>
                    <td>Preferência</td>
                    <td>Idioma selecionado (PT/EN/ES)</td>
                    <td>1 ano</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Cookies de terceiros</h2>
            <p>O Stripe pode definir cookies durante o processo de pagamento para fins de segurança antifraude. Esses cookies são controlados pelo Stripe e seguem a <a href="https://stripe.com/privacy" target="_blank" rel="noopener">política de privacidade da Stripe</a>.</p>

            <h2>Não usamos</h2>
            <ul>
              <li>Cookies de rastreamento ou análise de comportamento (Google Analytics, Meta Pixel etc.)</li>
              <li>Cookies de publicidade</li>
              <li>Cookies de redes sociais (exceto se você clicar em links externos)</li>
            </ul>

            <h2>Como controlar cookies</h2>
            <p>Você pode configurar seu navegador para bloquear ou excluir cookies. Note que bloquear cookies essenciais (<code>sb-*</code>) impedirá o login na plataforma.</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Chrome</a></li>
              <li><a href="https://support.mozilla.org/pt-BR/kb/ative-e-desative-os-cookies-que-os-sites-usam" target="_blank" rel="noopener">Firefox</a></li>
              <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
            </ul>

            <h2>Dúvidas</h2>
            <p>Entre em contato via <Link href="/contato">formulário de contato</Link> ou pelo e-mail <a href="mailto:privacidade@fauna.org">privacidade@fauna.org</a>.</p>
          </div>
        </div>
      </main>
    </NavTheme>
  )
}