# Banco de Dados — Supabase

Referência completa do schema, políticas, Storage e procedimentos de manutenção.

> **Fonte da verdade**: [supabase/schema.sql](../supabase/schema.sql). Toda alteração estrutural deve ser feita lá e replicada via SQL Editor.

---

## 1. Visão geral

| Recurso | Tipo | Função |
|---------|------|--------|
| `public.projects` | Tabela | Projetos do portfólio |
| `public.news` | Tabela | Notícias / artigos |
| `public.site_content` | Tabela (1 linha) | Conteúdo editorial das páginas |
| `public.set_updated_at()` | Function | Trigger genérico de timestamp |
| Bucket `media` | Storage | Imagens (capas, galerias, hero) |
| `auth.users` | Sistema | Usuários (admin) — gerenciado via painel |

---

## 2. Tabelas

### 2.1 `public.projects`

| Coluna | Tipo | Constraints | Observação |
|--------|------|-------------|------------|
| `id` | `text` | PK | Slug, ex.: `casa-moema` |
| `title` | `text` | NOT NULL | |
| `category` | `text` | NOT NULL, CHECK in (`residencial`,`comercial`) | |
| `year` | `int` | NOT NULL | |
| `location` | `text` | NOT NULL DEFAULT `''` | |
| `area` | `text` | NOT NULL DEFAULT `''` | Ex.: `420 m²` |
| `description` | `text` | NOT NULL DEFAULT `''` | |
| `cover` | `text` | NOT NULL DEFAULT `''` | URL da capa |
| `gallery` | `text[]` | NOT NULL DEFAULT `{}` | URLs públicas |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` | Atualizado por trigger |

Trigger: `trg_projects_updated BEFORE UPDATE → set_updated_at()`.

### 2.2 `public.news`

| Coluna | Tipo | Constraints | Observação |
|--------|------|-------------|------------|
| `id` | `text` | PK | Slug |
| `title` | `text` | NOT NULL | |
| `excerpt` | `text` | NOT NULL DEFAULT `''` | Resumo curto |
| `content` | `text` | NOT NULL DEFAULT `''` | Texto completo, parágrafos separados por linha em branco |
| `cover` | `text` | NOT NULL DEFAULT `''` | URL |
| `category` | `text` | NOT NULL DEFAULT `''` | Ex.: `Urbanismo` |
| `author` | `text` | NOT NULL DEFAULT `''` | |
| `date` | `date` | NOT NULL | ISO `YYYY-MM-DD` |
| `sources` | `jsonb` | NOT NULL DEFAULT `'[]'::jsonb` | Array de `{ label, url }` |
| `created_at` | `timestamptz` | NOT NULL DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL DEFAULT `now()` | |

Trigger: `trg_news_updated`.

### 2.3 `public.site_content`

Tabela **singleton**: contém uma única linha com `id = 'main'`.

| Coluna | Tipo | Observação |
|--------|------|------------|
| `id` | `text` PK DEFAULT `'main'` | Sempre `main` |
| `data` | `jsonb` NOT NULL | Estrutura espelhando `SiteContent` |
| `updated_at` | `timestamptz` | |

**Forma esperada de `data`** (ver `SiteContent` em [src/data/projects.ts](../src/data/projects.ts)):

```jsonc
{
  "heroTitle": "...",
  "heroSubtitle": "...",
  "heroCta": "Ver Projetos",
  "heroImages": [
    { "src": "https://...", "alt": "..." }
  ],
  "philosophy": "...",
  "manifesto": "...",
  "manifestoImage": "https://...",
  "contactAddress": "...",
  "contactPhone": "...",
  "contactEmail": "...",
  "servicesEyebrow": "...",
  "servicesTitle": "...",
  "servicesIntro": "...",
  "services": [
    { "title": "...", "description": "..." }
  ]
}
```

> O hook `useContent` faz merge com `initialContent` ao ler, então campos faltantes assumem o default. Mesmo assim, evite remover chaves do JSON.

---

## 3. Row Level Security (RLS)

RLS está **habilitada em todas as tabelas públicas**. As policies seguem o mesmo padrão:

| Tabela | Operação | Política | Regra |
|--------|----------|----------|-------|
| `projects`, `news`, `site_content` | `SELECT` | `*_read` | `USING (true)` — leitura pública |
| `projects`, `news`, `site_content` | `ALL` (INSERT/UPDATE/DELETE) | `*_write` | `auth.role() = 'authenticated'` |

**Implicações:**
- Usuários anônimos (anon key) podem **ler tudo**.
- Apenas sessões autenticadas (JWT do Supabase Auth) podem **escrever**.
- Não há ACL por usuário; qualquer usuário autenticado tem permissão total. Se for necessário multi-admin com permissões diferentes, será preciso revisar as policies.

---

## 4. Storage — bucket `media`

Criado em [schema.sql](../supabase/schema.sql) com `public = true`.

| Operação | Policy | Regra |
|----------|--------|-------|
| `SELECT` | `media_read` | `bucket_id = 'media'` — leitura pública |
| `INSERT` | `media_insert` | autenticado |
| `UPDATE` | `media_update` | autenticado |
| `DELETE` | `media_delete` | autenticado |

**Convenção de paths** (gerada por `uploadImage` em [src/lib/supabase.ts](../src/lib/supabase.ts)):

```
<folder>/<timestamp>-<random>.<ext>
```

- `folder` default: `misc`
- `projects` para uploads em lote do AdminProjects
- Extensão inferida do MIME type

**URL pública**:
```
https://<project>.supabase.co/storage/v1/object/public/media/<path>
```

> **Não há limpeza automática** de imagens órfãs. Ao remover uma linha de `projects/news`, as imagens permanecem no bucket. Ver [Manutenção](#6-manutenção).

---

## 5. Provisionar do zero

```sql
-- 1. Abra Supabase → SQL Editor → New query
-- 2. Cole e execute o conteúdo de supabase/schema.sql
-- 3. Confirme:
select count(*) from public.projects;
select count(*) from public.news;
select count(*) from public.site_content;
-- Bucket
select * from storage.buckets where id = 'media';
```

Depois do schema, **popule** com `npm run seed` (ver [DEPLOYMENT.md](DEPLOYMENT.md#seed)).

---

## 6. Manutenção

### 6.1 Backup
- Painel Supabase → **Database → Backups**: backup automático diário (planos pagos) ou snapshot manual.
- Para SQL puro: `pg_dump` via connection string em **Database → Connection**.

### 6.2 Limpar imagens órfãs do Storage
Não há rotina automatizada. Recomendação:

```sql
-- Listar todas as URLs referenciadas
select cover from projects
union all select unnest(gallery) from projects
union all select cover from news
union all select data->>'manifestoImage' from site_content
union all select x.value->>'src'
  from site_content, jsonb_array_elements(data->'heroImages') x;
```

Compare com `storage.objects` filtrando por `bucket_id = 'media'` e remova manualmente o que não estiver em uso.

### 6.3 Alterar schema
1. Edite [supabase/schema.sql](../supabase/schema.sql) com a mudança (sempre idempotente: `if not exists`, `drop policy if exists`...).
2. Atualize os tipos correspondentes em [src/data/projects.ts](../src/data/projects.ts) ou [src/data/news.ts](../src/data/news.ts).
3. Atualize as funções `rowTo*` e os tipos `*Row` em [src/store/useStudioStore.ts](../src/store/useStudioStore.ts).
4. Execute o SQL no painel.
5. Se for renomear/remover coluna, planeje a migração de dados antes.

### 6.4 Resetar (DESTRUTIVO)
```sql
truncate public.projects, public.news, public.site_content;
-- Storage: deletar via painel ou:
delete from storage.objects where bucket_id = 'media';
```

---

## 7. Diagnóstico rápido

| Sintoma | Verificar |
|---------|-----------|
| Site público vazio mas admin funciona | Policies `*_read` foram removidas? |
| Admin "Falha ao salvar" | RLS bloqueando? Sessão expirou? |
| Upload de imagem dá 403 | Policy `media_insert` ou login expirado |
| Imagem não aparece (404) | Bucket `media` não está público ou path errado |
| `column ... does not exist` | Schema desatualizado em relação ao código — rode `schema.sql` |
