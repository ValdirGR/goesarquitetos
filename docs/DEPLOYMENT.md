# Deploy

Procedimentos para provisionar Supabase, popular dados e publicar na Vercel.

> **Plataforma**: Vercel (hospedagem SPA) + Supabase (DB/Auth/Storage). Não há servidor próprio.

---

## 1. Visão geral do fluxo

```
1. Provisionar Supabase
   ├── Rodar schema.sql
   ├── Criar usuário admin
   └── Coletar URL + Anon Key

2. Popular dados (uma vez)
   └── npm run seed

3. Configurar Vercel
   ├── Conectar repo
   ├── Variáveis de ambiente
   └── Deploy

4. Verificar produção
```

---

## 2. Supabase — provisionamento

### 2.1 Criar projeto
1. Acesse <https://supabase.com> → **New Project**.
2. Defina nome, região (sugestão: `South America (São Paulo)`), senha do Postgres.
3. Aguarde provisioning (~2 min).

### 2.2 Rodar o schema
1. **SQL Editor** → **New query**.
2. Cole o conteúdo completo de [supabase/schema.sql](../supabase/schema.sql).
3. Execute (`Run`).
4. Verifique em **Table Editor** que `projects`, `news`, `site_content` aparecem.
5. Em **Storage** verifique se o bucket `media` foi criado e está marcado como público.

### 2.3 Criar usuário admin
1. **Authentication → Users → Add user → Create new user**.
2. Email: `deciogoes@truesites.com.br` (ou outro)
3. Defina uma senha forte
4. Marque **"Auto Confirm User"** (caso contrário precisa confirmar por email).

> Para criar outros admins basta repetir. Como a RLS é `auth.role() = 'authenticated'`, qualquer usuário criado terá acesso total ao admin.

### 2.4 Coletar credenciais
1. **Settings → API**:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → **secreto**, usar **apenas** localmente para o seed

---

## 3. Seed

Popular o banco com os dados iniciais (projetos, notícias e conteúdo) — **uma única vez**.

### Passos

```powershell
# 1. Garantir que .env contém TODAS as três variáveis:
#    VITE_SUPABASE_URL=...
#    VITE_SUPABASE_ANON_KEY=...
#    SUPABASE_SERVICE_ROLE_KEY=...

# 2. Rodar:
npm run seed
```

Saída esperada:
```
✔ Projects seeded (8)
✔ News seeded (8)
✔ Site content seeded

Seed concluído.
```

### Após o seed

> **IMPORTANTE**: Remova `SUPABASE_SERVICE_ROLE_KEY` do `.env` após rodar o seed. Essa chave dá acesso total ao banco (bypassa RLS) e não deve permanecer em arquivos no disco do desenvolvedor.

```powershell
# Edite .env e apague a linha SUPABASE_SERVICE_ROLE_KEY=...
```

### Idempotência

O seed usa `upsert(..., { onConflict: "id" })`. Rodar de novo **atualiza** as linhas existentes em vez de duplicar — útil para corrigir dados iniciais, mas **sobrescreve** edições manuais feitas via admin.

---

## 4. Vercel — deploy

### 4.1 Conectar repositório
1. Acesse <https://vercel.com> → **Add New → Project**.
2. Importe `ValdirGR/goesarquitetos`.
3. Vercel detecta **Vite** automaticamente:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

### 4.2 Environment Variables

Adicione em **Settings → Environment Variables** (escopos: Production + Preview + Development):

| Nome | Valor | Tipo |
|------|-------|------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Plaintext |
| `VITE_SUPABASE_ANON_KEY` | Anon key | Plaintext (segura no browser) |

> **Não** adicione `SUPABASE_SERVICE_ROLE_KEY` na Vercel. O app não precisa dela em runtime.

### 4.3 Deploy
- Push para `main` → deploy automático em produção.
- Push para qualquer outro branch → Preview deployment com URL temporária.

### 4.4 Rewrite SPA
O arquivo [vercel.json](../vercel.json) já está configurado:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Sem isso, rotas como `/projetos/casa-moema` retornariam 404 ao recarregar.

---

## 5. Pós-deploy — verificação

Checklist a cada deploy de produção:

- [ ] Homepage carrega
- [ ] `/projetos` lista projetos vindos do banco
- [ ] `/projetos/<slug>` abre detalhe
- [ ] `/noticias` lista notícias
- [ ] `/login` aceita credenciais do admin
- [ ] `/admin/projetos` carrega lista
- [ ] Editar e salvar projeto persiste após reload
- [ ] Upload de imagem retorna URL `*.supabase.co/storage/v1/object/public/media/...`
- [ ] Logout funciona

Se algo falhar, abra o **DevTools → Network/Console** e veja [Troubleshooting](#7-troubleshooting).

---

## 6. Rollback

### Cenário: deploy quebrou produção

**Opção A — Vercel (mais rápido):**
1. Vercel → **Deployments**
2. Encontre o último deploy estável
3. Botão **⋯ → Promote to Production**

**Opção B — Git revert:**
```powershell
git revert <hash-do-commit-ruim>
git push origin main
# Vercel faz deploy automático
```

### Cenário: alteração de schema quebrou o banco

Não há rollback automático. Restaure via:
1. **Backup** (Supabase → Database → Backups), ou
2. SQL manual para desfazer (`drop column`, `alter table`...).

> Por isso: **sempre teste mudanças de schema em um projeto Supabase de staging** antes da produção.

---

## 7. Troubleshooting

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| Tela branca + console "Supabase URL/Anon Key ausentes" | Env vars não configuradas | Vercel → Settings → Environment Variables |
| Login retorna "Credenciais inválidas" | Usuário não criado / não confirmado | Criar em Authentication → Users → Auto Confirm |
| "new row violates row-level security policy" | Tentativa de escrita sem sessão | Logue novamente; cheque expiração JWT |
| `/projetos/casa-moema` dá 404 ao recarregar | `vercel.json` não foi commitado | Confira o arquivo na branch deployada |
| Imagens não aparecem (403) | Bucket não público | Storage → `media` → toggle public |
| Build da Vercel falha em `vite build` | TypeScript error | Rode `npm run build` local primeiro |
| "Module not found: @supabase/supabase-js" | Cache da Vercel | Vercel → Deployments → ⋯ → Redeploy (clear cache) |
| Cards de imagem em base64 (legado) | Conteúdo pré-refatoração | Reabra o registro no admin e re-uploade |

---

## 8. Manutenção contínua

| Tarefa | Frequência |
|--------|------------|
| Verificar deploys da Vercel | A cada PR |
| Backup do Supabase | Diário (automático no plano pago) ou semanal manual |
| Limpar imagens órfãs do Storage | Trimestral (ver [DATABASE.md §6.2](DATABASE.md#62-limpar-imagens-órfãs-do-storage)) |
| Atualizar dependências (`npm outdated`) | Mensal |
| Rotacionar Anon Key | Em caso de suspeita de vazamento (regenera no painel) |

---

## 9. Domínio customizado

Para apontar `goesarquitetos.com.br` (ou similar) para a Vercel:

1. Vercel → **Settings → Domains → Add**
2. Configure os registros DNS no provedor (geralmente `A` ou `CNAME` apontando para `cname.vercel-dns.com`).
3. Aguarde propagação (até 24h, geralmente minutos).
4. HTTPS é provisionado automaticamente (Let's Encrypt).
