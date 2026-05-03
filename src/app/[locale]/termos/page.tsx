import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import Link from 'next/link'

export const metadata = { title: 'Termos de Uso — Fauna' }

/* Dados da pessoa jurídica responsável pela plataforma.
 * PREENCHER ANTES DE PUBLICAR — campos com [a preencher] aparecem
 * literalmente na página até serem editados. */
const ENTITY = {
  legalName: '[Razão social a preencher]',
  cnpj:      '[CNPJ a preencher]',
  address:   '[Endereço a preencher]',
  forum:     '[Comarca a preencher]',
}

export default function TermosPage() {
  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-moonstone">
        <Nav />
        <div className="pt-40 pb-28 px-10 max-w-screen-md mx-auto">
          <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-5">Legal</span>
          <h1 className="font-sans text-5xl font-light text-forest mb-3">
            Termos de <em className="italic text-sage">Uso</em>
          </h1>
          <p className="text-forest/40 text-sm mb-14">Última atualização: maio de 2026</p>

          <div className="prose-fauna">

            <h2>1. Quem somos</h2>
            <p>
              A Fauna é uma plataforma digital que conecta organizações de conservação da fauna
              a doadores e apoiadores. Operada por <strong>{ENTITY.legalName}</strong>,
              CNPJ {ENTITY.cnpj}, com sede em {ENTITY.address}.
            </p>
            <p>
              A Fauna <strong>não é uma ONG</strong> e <strong>não administra projetos de
              conservação da fauna</strong>. Atuamos exclusivamente como infraestrutura digital — a
              relação financeira em uma doação é entre o doador e a organização escolhida.
            </p>

            <h2>2. Aceitação destes Termos</h2>
            <p>
              Ao criar uma conta ou usar qualquer funcionalidade da Fauna, você concorda com
              estes Termos e com nossa <Link href="/privacidade">Política de Privacidade</Link>.
              Se não concordar, não use a plataforma.
            </p>
            <p>
              Podemos atualizar estes Termos. A versão vigente é sempre a publicada nesta
              página, com data no topo. Mudanças relevantes serão comunicadas por e-mail aos
              usuários cadastrados.
            </p>

            <h2>3. Cadastro e contas</h2>
            <ul>
              <li><strong>Doadores individuais</strong> criam conta com nome e e-mail. Você é responsável
                  pelos dados informados e por manter o acesso ao seu e-mail. Doadores institucionais
                  (empresas, fundações) entram via contato direto, conforme item 4.</li>
              <li><strong>Organizações</strong> precisam apresentar registro legal válido
                  (CNPJ, estatuto e, quando houver, OSCIP/CEBAS) e passam por verificação
                  com prazo médio de 48 horas.</li>
              <li>Cada conta é pessoal e intransferível. Você pode encerrá-la a qualquer
                  momento pelo painel ou enviando solicitação para
                  <a href="mailto:contatofauna@proton.me"> contatofauna@proton.me</a>.</li>
            </ul>

            <h2>4. Doações</h2>
            <ul>
              <li>Pagamentos são processados pela <strong>Stripe</strong>. A Fauna não
                  armazena dados do cartão e não intermedia o dinheiro: o valor vai
                  diretamente da conta do doador para a conta Stripe Connect da
                  organização escolhida.</li>
              <li><strong>A Fauna não cobra comissão sobre as doações.</strong> Nenhum
                  percentual fica com a plataforma. As únicas deduções são as taxas de
                  processamento padrão da Stripe, exibidas no checkout.</li>
              <li>Doações em moeda estrangeira são convertidas pela Stripe segundo as taxas
                  e tarifas da operadora.</li>
              <li>Doações recorrentes podem ser canceladas a qualquer momento pelo painel
                  do doador, sem multa ou aviso prévio.</li>
              <li><strong>Reembolsos:</strong> a Fauna não retém o dinheiro e portanto não
                  emite reembolsos diretamente. Solicitações devem ser dirigidas à
                  organização beneficiada e/ou à Stripe, conforme as regras de cada uma.</li>
            </ul>

            <h2>5. Organizações cadastradas</h2>
            <ul>
              <li>São integralmente responsáveis pelo uso dos recursos recebidos, pela
                  veracidade das informações publicadas e pelo cumprimento das obrigações
                  legais, fiscais e estatutárias aplicáveis.</li>
              <li>Devem manter sua conta Stripe Connect ativa e em conformidade com os
                  termos da Stripe.</li>
              <li>O conteúdo publicado (textos, fotos, vídeos, atualizações) é de
                  responsabilidade exclusiva da organização. Ao publicar, você concede à
                  Fauna licença não exclusiva, mundial e gratuita para exibir esse conteúdo
                  na plataforma e em comunicações relacionadas.</li>
              <li>A Fauna pode <strong>suspender ou remover</strong> organizações e projetos
                  que descumpram estes Termos, forneçam informações falsas ou apresentem
                  indícios de uso indevido — sem prejuízo das medidas legais cabíveis.</li>
            </ul>

            <h2>6. Conduta proibida</h2>
            <p>É vedado usar a Fauna para:</p>
            <ul>
              <li>Captar recursos para fins distintos da conservação da fauna declarada.</li>
              <li>Fraudar, lavar dinheiro, evadir tributos ou financiar atividades ilícitas.</li>
              <li>Publicar conteúdo falso, difamatório, discriminatório, ou que infrinja
                  direitos de terceiros (incluindo direitos autorais e de imagem).</li>
              <li>Coletar dados de outros usuários sem autorização, fazer engenharia
                  reversa ou tentar contornar mecanismos de segurança.</li>
              <li>Enviar spam ou comunicações não solicitadas a doadores.</li>
            </ul>

            <h2>7. Propriedade intelectual da Fauna</h2>
            <p>
              A marca, o nome, o design, o código e a interface da plataforma são de
              propriedade da Fauna ou de seus licenciadores. Estes Termos não concedem
              qualquer direito de uso comercial sobre esses elementos sem autorização
              escrita prévia.
            </p>

            <h2>8. Privacidade e dados pessoais</h2>
            <p>
              O tratamento de dados pessoais segue a LGPD (Lei nº 13.709/2018) e está
              detalhado na nossa <Link href="/privacidade">Política de Privacidade</Link>.
              Cookies usados na plataforma estão descritos na
              <Link href="/cookies"> Política de Cookies</Link>.
            </p>

            <h2>9. Limitação de responsabilidade</h2>
            <p>
              A Fauna funciona como intermediadora tecnológica entre doadores e
              organizações. Embora façamos verificação razoável das organizações antes
              da publicação, <strong>não auditamos</strong> o uso dos recursos após a
              doação e não somos responsáveis pelo cumprimento, pelos resultados ou pela
              prestação de contas dos projetos. A relação jurídica e financeira da doação
              ocorre exclusivamente entre o doador e a organização escolhida.
            </p>
            <p>
              Não nos responsabilizamos por interrupções decorrentes de falhas em
              serviços de terceiros (Stripe, provedores de hospedagem, conexão de
              internet), por caso fortuito ou força maior.
            </p>

            <h2>10. Suspensão e encerramento</h2>
            <p>
              Podemos suspender ou encerrar contas que violem estes Termos, mediante
              comunicação prévia quando possível. Você também pode encerrar sua conta a
              qualquer momento. Doações já realizadas não são revertidas pelo
              encerramento — elas pertencem à organização beneficiada desde o momento
              da confirmação.
            </p>

            <h2>11. Alterações dos Termos</h2>
            <p>
              Atualizações entram em vigor na data de publicação desta página.
              Continuar usando a plataforma após uma alteração significa aceitação da
              nova versão. Mudanças materiais (modelo de cobrança, escopo do serviço,
              compartilhamento de dados) serão comunicadas por e-mail com pelo menos
              15 dias de antecedência.
            </p>

            <h2>12. Lei aplicável e foro</h2>
            <p>
              Estes Termos são regidos pela legislação brasileira. Fica eleito o foro
              da comarca de {ENTITY.forum} para dirimir qualquer controvérsia,
              renunciando-se a qualquer outro, por mais privilegiado que seja —
              ressalvadas as hipóteses de competência do consumidor previstas no CDC.
            </p>

            <h2>13. Contato</h2>
            <p>
              Dúvidas sobre estes Termos:
              <a href="mailto:contatofauna@proton.me"> contatofauna@proton.me</a>.
              Assuntos relacionados a dados pessoais:
              <a href="mailto:contatofauna@proton.me"> contatofauna@proton.me</a>.
            </p>
          </div>
        </div>
      </main>
    </NavTheme>
  )
}
