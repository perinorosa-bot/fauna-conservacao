import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import Link from 'next/link'

export const metadata = { title: 'Política de Troca — Fauna Loja' }

export default function TrocaPage() {
  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />
        <div className="pt-40 pb-28 px-10 max-w-screen-md mx-auto">
          <span className="text-sage text-[10px] tracking-[0.25em] uppercase block mb-5">Loja · Legal</span>
          <h1 className="font-serif text-5xl font-light text-forest mb-3">
            Política de <em className="italic text-leaf">Troca</em>
          </h1>
          <p className="text-forest/40 text-sm mb-14">Última atualização: abril de 2025</p>

          <div className="prose-fauna">

            <h2>Prazo para troca ou devolução</h2>
            <p>
              Você tem até <strong>7 dias corridos</strong> após o recebimento do pedido para solicitar
              troca ou devolução, conforme o Código de Defesa do Consumidor (Art. 49).
            </p>
            <p>
              Para produtos com defeito de fabricação, o prazo é de <strong>30 dias</strong> a partir
              do recebimento.
            </p>

            <h2>Condições para troca</h2>
            <ul>
              <li>Produto sem uso, lavagem ou dano causado pelo consumidor</li>
              <li>Embalagem original preservada (quando aplicável)</li>
              <li>Nota fiscal ou comprovante de compra</li>
            </ul>

            <h2>Produtos não sujeitos a troca</h2>
            <ul>
              <li>Adesivos e papelaria após abertos (por higiene)</li>
              <li>Produtos personalizados ou feitos sob encomenda</li>
              <li>Produtos com danos causados por mau uso</li>
            </ul>

            <h2>Como solicitar</h2>
            <ol>
              <li>Entre em contato pelo e-mail <a href="mailto:loja@fauna.org">loja@fauna.org</a> com o número do pedido</li>
              <li>Descreva o motivo da troca e, se possível, envie fotos do produto</li>
              <li>Aguarde a confirmação da nossa equipe (até 2 dias úteis)</li>
              <li>Envie o produto pelo correio — fornecemos a etiqueta de postagem para devoluções por defeito</li>
            </ol>

            <h2>Reembolso</h2>
            <p>
              Após recebermos e verificarmos o produto, o reembolso é processado em até{' '}
              <strong>5 dias úteis</strong> para o cartão original ou via Pix.
              Para trocas por outro tamanho ou produto, o novo envio ocorre em até <strong>3 dias úteis</strong>.
            </p>

            <h2>Frete de devolução</h2>
            <p>
              Devolução por <strong>defeito ou erro nosso</strong>: frete por nossa conta.
              Devolução por <strong>arrependimento</strong>: frete por conta do cliente.
            </p>

            <h2>Dúvidas</h2>
            <p>
              Fale com a gente pelo{' '}
              <Link href="/contato">formulário de contato</Link> ou por{' '}
              <a href="mailto:loja@fauna.org">loja@fauna.org</a>.
            </p>

          </div>
        </div>
      </main>
    </NavTheme>
  )
}
