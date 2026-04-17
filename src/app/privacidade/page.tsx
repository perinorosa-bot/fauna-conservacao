import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import Link from 'next/link'

export const metadata = { title: 'Política de Privacidade — Fauna' }

export default function PrivacidadePage() {
  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />
        <div className="pt-40 pb-28 px-10 max-w-screen-md mx-auto">
          <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-5">Legal</span>
          <h1 className="font-serif text-5xl font-light text-forest mb-3">
            Política de <em className="italic text-sage">Privacidade</em>
          </h1>
          <p className="text-forest/40 text-sm mb-14">Última atualização: abril de 2025</p>

          <div className="prose-fauna">

            <h2>1. Quem somos</h2>
            <p>A Fauna é uma plataforma de financiamento coletivo para projetos de conservação da biodiversidade. Nosso compromisso é proteger os dados pessoais de quem nos confia informações para apoiar causas ambientais.</p>

            <h2>2. Dados que coletamos</h2>
            <p>Coletamos apenas o necessário para operar a plataforma:</p>
            <ul>
              <li><strong>Dados de cadastro:</strong> nome completo e endereço de e-mail.</li>
              <li><strong>Dados de doação:</strong> valor, moeda e mensagem opcional. Os dados de pagamento são processados diretamente pelo Stripe e não ficam em nossos servidores.</li>
              <li><strong>Dados de navegação:</strong> logs de acesso, endereço IP e cookies técnicos essenciais ao funcionamento do site.</li>
            </ul>

            <h2>3. Como usamos seus dados</h2>
            <ul>
              <li>Autenticar sua conta e proteger o acesso.</li>
              <li>Processar e registrar doações.</li>
              <li>Enviar atualizações dos projetos que você apoia (você pode cancelar a qualquer momento).</li>
              <li>Cumprir obrigações legais e fiscais.</li>
            </ul>

            <h2>4. Base legal (LGPD)</h2>
            <p>Tratamos seus dados com base em: (a) execução de contrato, quando você realiza uma doação; (b) consentimento, para comunicações por e-mail; e (c) cumprimento de obrigação legal.</p>

            <h2>5. Compartilhamento de dados</h2>
            <p>Não vendemos nem alugamos seus dados. Compartilhamos apenas com:</p>
            <ul>
              <li><strong>Stripe</strong> — processamento de pagamentos.</li>
              <li><strong>Supabase</strong> — armazenamento seguro de dados na infraestrutura de banco de dados.</li>
            </ul>
            <p>Ambos os fornecedores operam em conformidade com o GDPR e a LGPD.</p>

            <h2>6. Retenção de dados</h2>
            <p>Mantemos seus dados enquanto sua conta estiver ativa ou pelo prazo exigido por lei (geralmente 5 anos para registros financeiros). Você pode solicitar a exclusão a qualquer momento.</p>

            <h2>7. Seus direitos</h2>
            <p>Nos termos da LGPD, você tem direito a: acesso, correção, exclusão, portabilidade e revogação do consentimento. Envie sua solicitação para <a href="mailto:privacidade@fauna.org">privacidade@fauna.org</a>.</p>

            <h2>8. Cookies</h2>
            <p>Usamos cookies técnicos essenciais e cookies de preferência (idioma). Consulte nossa <Link href="/cookies">Política de Cookies</Link> para mais detalhes.</p>

            <h2>9. Segurança</h2>
            <p>Adotamos criptografia em trânsito (TLS) e em repouso, controle de acesso por funções e autenticação por link mágico — sem armazenamento de senhas.</p>

            <h2>10. Contato</h2>
            <p>Dúvidas ou solicitações: <a href="mailto:privacidade@fauna.org">privacidade@fauna.org</a></p>
          </div>
        </div>
      </main>
    </NavTheme>
  )
}