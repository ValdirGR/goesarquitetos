# Góes Arquitetos — Site Institucional

Site institucional do escritório **Góes Arquitetos Associados** com painel administrativo para gestão de projetos, notícias e conteúdo editorial.

- **Stack**: Vite + React 18 + TypeScript + Tailwind + shadcn/ui
- **Backend**: Supabase (Postgres + Auth + Storage)
- **Hospedagem**: Vercel (SPA estática)
- **Repositório**: <https://github.com/ValdirGR/goesarquitetos>

---

## Quick Start

```powershell
# 1. Clonar e instalar
git clone https://github.com/ValdirGR/goesarquitetos.git
cd goesarquitetos
npm install

# 2. Configurar variáveis
Copy-Item .env.example .env
# edite .env e preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# 3. Rodar em dev
npm run dev   # http://localhost:8080
```

> Para preparar o banco do zero, veja [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 8080, HMR) |
| `npm run build` | Build de produção em `dist/` |
| `npm run build:dev` | Build com flags de desenvolvimento |
| `npm run preview` | Servir o build local |
| `npm run lint` | ESLint em todo o projeto |
| `npm run test` | Vitest (run único) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run seed` | Popula o banco Supabase com dados iniciais (exige `SUPABASE_SERVICE_ROLE_KEY`) |

---

## Documentação

| Documento | Quando consultar |
|-----------|------------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Entender o desenho geral, stack, fluxo de dados, estrutura de pastas |
| [docs/DATABASE.md](docs/DATABASE.md) | Schema do Postgres, RLS, Storage, modificar tabelas |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Setup local, convenções de código, padrões dos hooks/componentes |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Provisionar Supabase, criar usuários, configurar Vercel, rollback |
| [docs/ADMIN.md](docs/ADMIN.md) | Como usar o painel `/admin` (perspectiva do usuário final) |
| [docs/SECURITY.md](docs/SECURITY.md) | Modelo de segurança, segredos, políticas RLS, riscos conhecidos |

---

## Suporte

Para reportar bugs ou solicitar mudanças, abra uma issue no repositório. Antes de qualquer alteração estrutural, leia [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) e [docs/DATABASE.md](docs/DATABASE.md).

