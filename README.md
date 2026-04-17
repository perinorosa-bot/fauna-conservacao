# Fauna Platform — Guia de Instalação

## O que você vai ter rodando

- Homepage com parallax de fotos reais de floresta
- Feed de atualizações dos projetos
- Página individual de cada projeto com formulário de doação
- Cadastro de organizações com autenticação
- API completa conectada ao banco de dados
- Banco de dados com todas as tabelas e regras de segurança

---

## Passo 1 — Criar conta no Supabase (banco de dados)

1. Acesse **https://supabase.com** e crie uma conta gratuita
2. Clique em **New Project**
3. Escolha um nome (ex: `fauna-platform`) e uma senha forte
4. Aguarde ~2 minutos o projeto ser criado
5. No menu lateral, clique em **SQL Editor**
6. Copie todo o conteúdo do arquivo `supabase/migrations/001_schema.sql`
7. Cole no editor e clique em **Run**
   - Isso cria todas as tabelas, regras de segurança e dados de exemplo

8. Agora vá em **Settings → API** e copie:
   - **Project URL** → algo como `https://xxxx.supabase.co`
   - **anon public key** → uma chave longa começando com `eyJ...`

---

## Passo 2 — Configurar o projeto no computador

Abra o VS Code na pasta do projeto e abra o terminal integrado
(`Ctrl + '` ou Menu → Terminal → New Terminal)

### 2.1 Renomear o arquivo de variáveis de ambiente

No terminal:
```
copy .env.local.example .env.local
```

Abra o arquivo `.env.local` e substitua com suas chaves do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 2.2 Instalar dependências

No terminal:
```
npm install
```

Aguarde baixar tudo (~1-2 minutos).

### 2.3 Rodar o projeto

```
npm run dev
```

Abra **http://localhost:3000** no navegador.

---

## Estrutura de arquivos

```
fauna/
├── src/
│   ├── app/                     ← Páginas da plataforma
│   │   ├── page.tsx             ← Homepage (parallax + feed)
│   │   ├── projetos/
│   │   │   ├── page.tsx         ← Lista de projetos
│   │   │   └── [slug]/page.tsx  ← Página individual do projeto
│   │   ├── organizacoes/
│   │   │   └── cadastro/page.tsx ← Cadastro de organização
│   │   ├── como-funciona/page.tsx
│   │   └── api/                 ← Endpoints da API
│   │       ├── projects/route.ts
│   │       └── donations/route.ts
│   ├── components/              ← Componentes reutilizáveis
│   │   ├── ParallaxHero.tsx     ← Hero com parallax de fotos
│   │   ├── FeedSection.tsx      ← Feed de atualizações
│   │   ├── DonationForm.tsx     ← Formulário de doação
│   │   ├── OrgRegisterForm.tsx  ← Cadastro de organização
│   │   └── ui/ProgressBar.tsx
│   ├── lib/supabase/            ← Conexão com banco de dados
│   │   ├── client.ts            ← Para componentes no browser
│   │   └── server.ts            ← Para páginas no servidor
│   └── types/index.ts           ← Tipos TypeScript
├── supabase/
│   └── migrations/001_schema.sql ← Execute isso no Supabase
├── .env.local.example           ← Modelo das variáveis de ambiente
└── package.json
```

---

## Próximos passos (quando quiser evoluir)

### Dashboard da organização
Página onde a organização faz login, cria projetos e posta atualizações.
```
src/app/dashboard/page.tsx
```

### Pagamentos reais com Stripe
Hoje o formulário de doação só registra no banco.
Para cobrar de verdade, adicionar Stripe:
```
npm install stripe @stripe/stripe-js
```
E configurar no `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Mapa de sinergias
Já temos `lat` e `lng` em cada projeto — integrar o mapa com:
```
npm install react-map-gl maplibre-gl
```

### Deploy (colocar no ar)
1. Crie conta em **https://vercel.com**
2. Importe o projeto do GitHub
3. Adicione as variáveis de ambiente do Supabase
4. Clique em Deploy — pronto

---

## Problemas comuns

**`npm install` dá erro**
→ Verifique se o Node.js está instalado: `node --version` (precisa ser v18+)
→ Se for v16, baixe a versão atual em https://nodejs.org

**Página abre mas não carrega dados**
→ Verifique se `.env.local` tem as chaves corretas do Supabase
→ Verifique se rodou o SQL no Supabase

**Erro "relation does not exist"**
→ O SQL ainda não foi rodado — vá no Supabase → SQL Editor e execute o arquivo

---

## Tecnologias usadas

| Tecnologia | O que faz |
|---|---|
| Next.js 14 | Framework — frontend + backend juntos |
| Supabase | Banco de dados + autenticação + storage |
| Tailwind CSS | Estilização |
| TypeScript | Tipagem do código |
| Vercel | Deploy (quando estiver pronto) |
