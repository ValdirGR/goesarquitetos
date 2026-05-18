# Arquitetura

Visão geral de como o projeto está organizado, qual tecnologia faz o quê e como os dados fluem.

---

## 1. Stack

| Camada | Tecnologia | Versão | Função |
|--------|------------|--------|--------|
| Build / Dev server | Vite | ^5 | Bundler e HMR |
| Linguagem | TypeScript | ^5.8 | Tipagem estática |
| UI Framework | React | ^18.3 | Componentes |
| Roteamento | react-router-dom | ^6 | Rotas SPA |
| Estilo | Tailwind CSS | ^3.4 | Utility-first |
| Componentes base | shadcn/ui + Radix | — | Primitivos acessíveis |
| Data fetching / cache | @tanstack/react-query | ^5 | Cache + mutations |
| Backend / DB | Supabase | — | Postgres + Auth + Storage |
| Testes | Vitest + Testing Library | — | Unit / componente |
| Deploy | Vercel | — | Hospedagem SPA estática |

---

## 2. Camadas

```
┌────────────────────────────────────────────────────────┐
│  Browser (SPA gerada pelo Vite)                        │
│                                                        │
│  ┌──────────────┐  ┌────────────────────────────────┐  │
│  │  Pages       │  │  Hooks (src/store/...)         │  │
│  │  /, /admin   │──┤  useProjects, useNews,         │  │
│  │  Login, etc. │  │  useContent, useAuth           │  │
│  └──────────────┘  └────────────┬───────────────────┘  │
│                                 │                      │
│                    React Query  │                      │
│                                 ▼                      │
│              ┌──────────────────────────────┐          │
│              │  src/lib/supabase.ts         │          │
│              │  (createClient + uploadImage)│          │
│              └──────────────┬───────────────┘          │
└─────────────────────────────┼──────────────────────────┘
                              │ HTTPS (anon key + JWT)
                              ▼
┌────────────────────────────────────────────────────────┐
│  Supabase                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │
│  │ Postgres     │ │ Auth         │ │ Storage        │  │
│  │ projects     │ │ users        │ │ bucket: media  │  │
│  │ news         │ │ sessions     │ │ (público)      │  │
│  │ site_content │ │              │ │                │  │
│  └──────────────┘ └──────────────┘ └────────────────┘  │
│                        ▲                               │
│            RLS aplicada em todas as tabelas            │
└────────────────────────────────────────────────────────┘
```

**Pontos-chave:**
- O front é uma SPA estática hospedada na Vercel.
- Todas as chamadas vão **direto do browser** para o Supabase com a `anon key`.
- As **policies de RLS** (Row Level Security) garantem que:
  - leitura é pública (sem login)
  - escrita exige sessão autenticada (`auth.role() = 'authenticated'`)
- Não existe backend customizado nem API serverless.

---

## 3. Estrutura de pastas

```
goesarquitetos/
├── public/                       Assets estáticos servidos como /
├── src/
│   ├── App.tsx                   Roteador raiz + providers globais
│   ├── main.tsx                  Bootstrap React
│   ├── index.css                 Variáveis CSS + base Tailwind
│   ├── components/
│   │   ├── NavLink.tsx           Link estilizado do header
│   │   ├── admin/
│   │   │   └── ImageUploader.tsx Upload + resize + Supabase Storage
│   │   ├── site/                 Layout público (Header, Footer, SiteLayout)
│   │   └── ui/                   shadcn/ui (button, dialog, table...)
│   ├── data/
│   │   ├── projects.ts           Tipos + dados iniciais (usados no seed)
│   │   └── news.ts               Tipos + dados iniciais (usados no seed)
│   ├── hooks/                    Hooks utilitários (toast, mobile)
│   ├── lib/
│   │   ├── utils.ts              cn() classnames helper
│   │   └── supabase.ts           Cliente Supabase + uploadImage()
│   ├── pages/
│   │   ├── Home.tsx              "/"
│   │   ├── About.tsx             "/quem-somos"
│   │   ├── Projects.tsx          "/projetos"
│   │   ├── ProjectDetail.tsx     "/projetos/:id"
│   │   ├── News.tsx              "/noticias"
│   │   ├── NewsDetail.tsx        "/noticias/:id"
│   │   ├── Contact.tsx           "/contato"
│   │   ├── Login.tsx             "/login"
│   │   ├── NotFound.tsx          "*"
│   │   └── admin/
│   │       ├── AdminLayout.tsx   "/admin" (guarda sessão)
│   │       ├── AdminProjects.tsx "/admin/projetos"
│   │       ├── AdminNews.tsx     "/admin/noticias"
│   │       └── AdminContent.tsx  "/admin/conteudo"
│   ├── store/
│   │   └── useStudioStore.ts     Hooks de dados: useProjects, useNews,
│   │                             useContent, useAuth
│   └── test/                     Setup do Vitest e testes
├── supabase/
│   └── schema.sql                DDL completa (tabelas + RLS + Storage)
├── scripts/
│   └── seed.ts                   Popula o banco com dados iniciais
├── docs/                         Documentação (este diretório)
├── .env                          Variáveis locais (gitignored)
├── .env.example                  Template
├── vercel.json                   Rewrite SPA para Vercel
├── vite.config.ts                Configuração do bundler
├── tailwind.config.ts            Tema do Tailwind
└── package.json
```

---

## 4. Roteamento

Definido em [src/App.tsx](../src/App.tsx). Rotas públicas usam `SiteLayout` (Header + Footer); rotas admin usam `AdminLayout` (guarda de sessão + sidebar).

| Path | Componente | Acesso |
|------|------------|--------|
| `/` | `Home` | Público |
| `/quem-somos` | `About` | Público |
| `/projetos` | `Projects` | Público |
| `/projetos/:id` | `ProjectDetail` | Público |
| `/noticias` | `News` | Público |
| `/noticias/:id` | `NewsDetail` | Público |
| `/contato` | `Contact` | Público |
| `/login` | `Login` | Público |
| `/admin` | `AdminLayout` → redireciona para `/admin/projetos` | Autenticado |
| `/admin/projetos` | `AdminProjects` | Autenticado |
| `/admin/noticias` | `AdminNews` | Autenticado |
| `/admin/conteudo` | `AdminContent` | Autenticado |
| `*` | `NotFound` | — |

---

## 5. Camada de dados (hooks)

Toda interação com o backend passa por [src/store/useStudioStore.ts](../src/store/useStudioStore.ts). Os hooks expostos retornam dados já mapeados para os tipos do domínio (`Project`, `NewsPost`, `SiteContent`).

### `useProjects()`
```ts
const { projects, upsert, remove } = useProjects();
```
- Query `["projects"]`, ordenada por `year desc, created_at desc`.
- `placeholderData = initialProjects` (de `src/data/projects.ts`) evita flash de tela vazia.
- `upsert(p)` faz `INSERT ... ON CONFLICT(id) DO UPDATE`.
- `remove(id)` deleta por chave primária.

### `useNews()`
Análogo a `useProjects`, mas com tabela `news` e ordenação por `date desc`.

### `useContent()`
```ts
const { content, update } = useContent();
```
- Tabela `site_content` armazena **uma única linha** (`id = 'main'`) com `data jsonb`.
- `update(patch)` faz merge no lado do cliente e upsert do objeto inteiro.
- `placeholderData = initialContent`.

### `useAuth()`
```ts
const { authed, ready, session, login, logout } = useAuth();
```
- `authed` é booleano derivado de `session != null`.
- `ready` indica que a sessão inicial foi consultada (use para evitar redirecionamentos prematuros).
- `login(email, password)` retorna `Promise<boolean>` (chama `supabase.auth.signInWithPassword`).
- Sessão é persistida automaticamente em `localStorage` pelo SDK.

> Para detalhes do schema, ver [DATABASE.md](DATABASE.md). Para convenções ao alterar hooks, ver [DEVELOPMENT.md](DEVELOPMENT.md).

---

## 6. Upload de imagens

Fluxo em [src/components/admin/ImageUploader.tsx](../src/components/admin/ImageUploader.tsx):

1. Usuário escolhe ou arrasta arquivo (jpg/png/webp/avif, até 3 MB por padrão).
2. Arquivo é lido como dataURL.
3. Se `recommendedWidth/Height` forem passados, é **redimensionado client-side** via Canvas (cover crop centralizado, qualidade 0.88 em JPEG).
4. dataURL é convertido para Blob via `dataUrlToBlob()`.
5. `uploadImage(blob, folder)` envia ao bucket `media` em path `folder/<timestamp>-<rand>.<ext>`.
6. URL pública (`getPublicUrl`) é gravada no estado do formulário e, ao salvar, persistida na linha correspondente.

O **upload em lote** em `AdminProjects` usa diretamente `uploadImage(file, 'projects')` sem redimensionar (preservando proporção original).

---

## 7. Providers globais

Configurados em [src/App.tsx](../src/App.tsx):

| Provider | Função |
|----------|--------|
| `QueryClientProvider` | Cache do React Query |
| `TooltipProvider` | shadcn tooltips |
| `Toaster` + `Sonner` | Toasts |
| `BrowserRouter` | Roteamento client-side |

---

## 8. Estilo

- **Design tokens** em `src/index.css` usando variáveis CSS HSL (`--background`, `--primary`, etc.).
- **Tailwind** consome essas variáveis em `tailwind.config.ts`.
- **Tipografia**: `Playfair Display` (serif, títulos) + `Inter` (sans, corpo). Carregadas via Google Fonts no `index.html`.
- **Tema único** (claro). Suporte a dark mode estruturalmente presente (`darkMode: ["class"]`) mas não exposto na UI.

---

## 9. Decisões de design

| Decisão | Motivo |
|---------|--------|
| SPA estática + Supabase | Zero backend para manter, escalabilidade gerenciada |
| `id` em texto (slug) para projetos/notícias | URLs amigáveis (`/projetos/casa-moema`) sem mapa adicional |
| `site_content` como JSONB único | Conteúdo editorial é flexível; evita migração a cada novo campo |
| `placeholderData` com dados estáticos | Evita FOUC em conexões lentas |
| Storage público + RLS apenas em escrita | Imagens precisam ser servidas direto (CDN do Supabase) |
| RLS por `auth.role()` ao invés de `auth.uid()` | Único papel admin; sem necessidade de ACL granular |
