# Desenvolvimento

Guia para trabalhar no código: setup, padrões, convenções e fluxos comuns.

---

## 1. Setup local

### Pré-requisitos

- **Node.js** ≥ 18
- **npm** (vem com o Node) — o `bun.lockb` no repo é legado; o projeto roda com npm sem problemas
- **Git**
- Editor recomendado: VS Code (extensões: ESLint, Tailwind CSS IntelliSense, TypeScript)

### Passos

```powershell
git clone https://github.com/ValdirGR/goesarquitetos.git
cd goesarquitetos
npm install
Copy-Item .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

O dev server sobe em <http://localhost:8080> (porta configurada em [vite.config.ts](../vite.config.ts)).

### Variáveis de ambiente

| Variável | Onde é usada | Obrigatória |
|----------|--------------|-------------|
| `VITE_SUPABASE_URL` | Cliente browser ([src/lib/supabase.ts](../src/lib/supabase.ts)) | Sim |
| `VITE_SUPABASE_ANON_KEY` | Cliente browser | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Apenas para `npm run seed` | Só ao rodar seed |

> Prefixo `VITE_` é obrigatório para variáveis expostas ao bundle do browser. **Nunca** prefixe `SERVICE_ROLE_KEY` com `VITE_`.

---

## 2. Scripts npm

| Script | Comando | Quando usar |
|--------|---------|-------------|
| `dev` | `vite` | Desenvolvimento local |
| `build` | `vite build` | Build de produção |
| `build:dev` | `vite build --mode development` | Build com source maps verbosos |
| `preview` | `vite preview` | Servir `dist/` localmente |
| `lint` | `eslint .` | Antes de commitar |
| `test` | `vitest run` | CI / verificação rápida |
| `test:watch` | `vitest` | TDD |
| `seed` | `tsx scripts/seed.ts` | Popular DB (one-off) |

---

## 3. Convenções de código

### TypeScript
- **`strict` está ativo** em `tsconfig.json`. Não use `any` sem motivo.
- Use `type` para shapes simples, `interface` para contratos extensíveis (a base já usa ambos).
- Importações com alias `@/*` (configurado em [vite.config.ts](../vite.config.ts) e [tsconfig.json](../tsconfig.json)):
  ```ts
  import { Button } from "@/components/ui/button";
  import { useProjects } from "@/store/useStudioStore";
  ```

### React
- **Componentes funcionais** + hooks. Sem classes.
- Use **hooks dedicados** (`useProjects`, `useNews`, `useContent`, `useAuth`) — **nunca** chame `supabase` diretamente dos componentes de página, exceto em casos justificados (mantém uma única camada de acesso a dados).
- Prefira composição a herança. Componentes `ui/*` são primitivos do shadcn — não edite a menos que precise mudar o design system inteiro.

### Estilo
- **Tailwind apenas**. Não escreva CSS solto exceto em [src/index.css](../src/index.css) (tokens globais).
- Use `cn()` de [src/lib/utils.ts](../src/lib/utils.ts) para mesclar classes condicionais.
- Respeite os tokens (`bg-background`, `text-foreground`, `border-border`, etc.) ao invés de cores hardcoded.

### Naming
- Arquivos React: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilitários: `camelCase.ts`
- Pastas: minúsculas (`pages/`, `components/admin/`)

---

## 4. Padrões dos hooks de dados

Todos os hooks de dados ([src/store/useStudioStore.ts](../src/store/useStudioStore.ts)) seguem o mesmo formato:

```ts
export function useThing() {
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["thing"],
    queryFn: fetchThings,
    placeholderData: initialThings,   // evita flash
    staleTime: 30_000,
  });

  const upsertMut = useMutation({
    mutationFn: async (t) => { /* supabase.from(...).upsert(...) */ },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["thing"] }),
  });

  return {
    things: data ?? [],
    upsert: (t) => upsertMut.mutate(t),
    remove: (id) => removeMut.mutate(id),
  };
}
```

**Ao adicionar novos campos ou tabelas:**
1. Atualize o schema SQL ([supabase/schema.sql](../supabase/schema.sql)).
2. Atualize os tipos em `src/data/*.ts`.
3. Atualize o tipo `*Row` interno e a função `rowTo*` no hook.
4. Atualize todos os formulários do admin que tocam o campo.

---

## 5. Adicionando uma página pública

1. Crie o arquivo em `src/pages/MinhaPagina.tsx`.
2. Adicione a rota em [src/App.tsx](../src/App.tsx) dentro do `<Route element={<SiteLayout />}>`.
3. Adicione o link no [src/components/site/Header.tsx](../src/components/site/Header.tsx) se for público.
4. Use os hooks de dados existentes ou crie um novo seguindo o padrão.

## 6. Adicionando uma página admin

1. Crie em `src/pages/admin/AdminMinhaSecao.tsx`.
2. Rota em `App.tsx` **dentro** de `<Route path="/admin" element={<AdminLayout />}>`.
3. Adicione o item no array `items` em [src/pages/admin/AdminLayout.tsx](../src/pages/admin/AdminLayout.tsx).
4. Para upload de imagens use sempre `<ImageUploader />`.

---

## 7. Testes

Configurado em [vitest.config.ts](../vitest.config.ts) com `jsdom` e setup em [src/test/setup.ts](../src/test/setup.ts).

```ts
// src/test/example.test.ts
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
```

**Não há testes E2E** configurados. Para validar mutations no Supabase, prefira testar no painel admin local apontando para um projeto Supabase de staging.

---

## 8. Git workflow

```powershell
git checkout -b feat/minha-feature
# trabalhe
npm run lint
npm run build      # garanta que compila
git add -A
git commit -m "feat: descrição clara"
git push origin feat/minha-feature
# abra PR para main
```

**Convenções de commit** (sugeridas):
- `feat:` nova funcionalidade
- `fix:` correção
- `refactor:` reorganização sem mudança de comportamento
- `docs:` documentação
- `chore:` build, dependências, etc.

**Branch principal**: `main`. Não force-push.

---

## 9. Debugging comum

| Problema | Solução |
|----------|---------|
| `Cannot find module '@/...'` | Reinicie o TS server do VS Code |
| Dados não aparecem em dev | Confirme `.env` preenchido e schema rodado |
| "Invalid JWT" no console | Anon key errada ou expirada |
| Tela branca em produção | Olhe console; geralmente env var faltando na Vercel |
| Imagem 413 (payload too large) | Bucket pequeno demais ou arquivo acima do `maxSizeMB` do uploader |
| Build trava | `Remove-Item -Recurse node_modules, package-lock.json; npm install` |

---

## 10. Performance

- O bundle principal está em ~770 kB minified (warning do Vite). Aceitável para o porte, mas se crescer considere **code splitting** por rota (`React.lazy` + `Suspense`).
- React Query já cacheia queries por 30s (`staleTime`); evite refetches desnecessários.
- Imagens são redimensionadas client-side; isso reduz upload e bandwidth.

---

## 11. Onde NÃO mexer sem critério

| Arquivo / pasta | Por quê |
|-----------------|---------|
| `src/components/ui/*` | shadcn primitives — mudanças quebram consistência |
| `tailwind.config.ts` (tokens) | Afeta o design inteiro |
| `supabase/schema.sql` | Mudança no banco — sempre rode em staging primeiro |
| `vercel.json` | Quebra rotas SPA |
| `.env` | Nunca commitar |
