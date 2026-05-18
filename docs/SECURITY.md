# Segurança

Modelo de segurança, segredos, riscos conhecidos e boas práticas operacionais.

---

## 1. Modelo geral

- **Front-end estático** servido pela Vercel (HTTPS sempre).
- **Não há backend custom**: o browser fala direto com o Supabase via `@supabase/supabase-js`.
- **Autorização** é feita inteiramente pelo Supabase através de **RLS (Row Level Security)** nas tabelas e policies no Storage.
- **Autenticação** via Supabase Auth (email/senha) com JWT armazenado em `localStorage` (gerenciado pelo SDK).

---

## 2. Segredos e variáveis

### Classificação

| Variável | Sensível? | Onde pode existir |
|----------|-----------|-------------------|
| `VITE_SUPABASE_URL` | Não | `.env` local, Vercel envs, commit do código (bundle) |
| `VITE_SUPABASE_ANON_KEY` | **Pública por design** | Mesma de cima — o Supabase espera que ela vá no browser |
| `SUPABASE_SERVICE_ROLE_KEY` | **CRÍTICA** | **Apenas em `.env` local** para rodar `npm run seed`, e mesmo assim deve ser removida após uso |
| Senha do usuário admin | Crítica | Painel Supabase apenas. Nunca em código, env ou comunicação não criptografada |

### Regras

1. `.env` está em [.gitignore](../.gitignore) — confirme antes de commitar (`git status` não deve listar `.env`).
2. **Nunca** coloque `SUPABASE_SERVICE_ROLE_KEY` em variáveis da Vercel; o app não precisa.
3. **Nunca** prefixe `SERVICE_ROLE_KEY` com `VITE_` — isso a colocaria no bundle do browser.
4. Se a `service_role` vazar, **regenere imediatamente** em Supabase → Settings → API → "Generate new key".
5. Se a `anon` key vazar, em teoria não há problema (ela é pública), mas você pode regenerá-la se quiser invalidar caches/dispositivos.

---

## 3. Anon key — por que é pública?

A `anon` key identifica requisições não autenticadas. Toda a segurança real está nas **policies RLS**:

```sql
-- Leitura: liberada para todos (anon ou autenticado)
create policy "projects_read" on public.projects for select using (true);

-- Escrita: APENAS autenticados
create policy "projects_write" on public.projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

Sem essa configuração, expor a anon key seria perigoso. **Não desabilite RLS em nenhuma tabela pública**.

---

## 4. Auth

### Fluxo
1. Usuário envia email/senha em `/login`.
2. `supabase.auth.signInWithPassword(...)` valida e retorna sessão (JWT).
3. SDK armazena em `localStorage` e adiciona o JWT no header `Authorization` de toda requisição subsequente.
4. RLS checa `auth.role()` ≡ `'authenticated'` para autorizar escritas.
5. Logout (`signOut`) limpa o storage e invalida a sessão.

### Sessão
- Auto-refresh ativo (renova o JWT antes de expirar).
- Persistência ativa (sobrevive a reloads e fechamento do browser).
- Para forçar logout em todos os dispositivos: Supabase → Authentication → Users → ⋯ → **Sign out**.

### Permissões granulares (não implementadas)
Hoje qualquer usuário criado tem **acesso total** ao admin (`role = 'authenticated'`). Se for necessário multi-tenant ou roles diferenciados:
1. Crie uma tabela `user_profiles` com `role text` ligada a `auth.users.id`.
2. Substitua as policies por verificações tipo:
   ```sql
   exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
   ```

---

## 5. Storage

- Bucket `media` é **público para leitura** (necessário para o CDN servir imagens).
- Upload/update/delete exigem sessão autenticada.
- **Não há rate limiting customizado**. O Supabase aplica limites por plano (consulte o dashboard).

### Risco: enumeração de arquivos
URLs do Storage são previsíveis em parte (`<timestamp>-<rand>.<ext>`). Para mitigar:
- Não armazene **nada sensível** no bucket `media`.
- O `<rand>` (8 chars) torna brute-force inviável na prática.

---

## 6. OWASP — pontos relevantes

| Risco (OWASP Top 10) | Status | Mitigação |
|----------------------|--------|-----------|
| A01 Broken Access Control | Mitigado | RLS em todas as tabelas + policies de Storage |
| A02 Cryptographic Failures | OK | HTTPS obrigatório (Vercel/Supabase). Senhas hasheadas pelo Supabase Auth (bcrypt) |
| A03 Injection | OK | Cliente Supabase usa parâmetros, não concatenação SQL. JSX é safe-by-default (sem `dangerouslySetInnerHTML`) |
| A04 Insecure Design | Aceitável | Modelo simples; admin único role |
| A05 Security Misconfiguration | Cuidado | Verifique sempre que RLS continue ativo após `truncate`/migration |
| A07 Authentication Failures | Aceitável | Senha forte é responsabilidade do operador; sem MFA hoje |
| A08 Data Integrity | OK | Trigger `set_updated_at` garante auditoria de timestamp |
| A09 Logging | Limitado | Logs ficam no Supabase Dashboard → Logs. Não há alertas custom |

---

## 7. Cabeçalhos HTTP

A Vercel aplica defaults razoáveis (HSTS, X-Content-Type-Options). Para hardening adicional considere adicionar em `vercel.json`:

```jsonc
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

CSP (Content Security Policy) restritivo exige cuidado porque o site carrega imagens do Supabase Storage e fontes do Google. Se for implementar, permita pelo menos:
```
img-src 'self' https://*.supabase.co data:;
font-src https://fonts.gstatic.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
connect-src 'self' https://*.supabase.co;
```

---

## 8. Dependências

- Rode `npm audit` periodicamente.
- Atualize com `npm update` (minor/patch). Major updates: revise changelog antes.
- Os pacotes Radix/shadcn são bem mantidos; foco maior em manter `@supabase/supabase-js` atualizado.

---

## 9. Resposta a incidente

### Suspeita de vazamento de credencial
1. **Regenerar** a chave comprometida (Supabase → Settings → API).
2. Atualizar `.env` local e env vars da Vercel.
3. Redeploy.
4. Revisar logs do Supabase (Authentication → Logs, Database → Logs) por atividade anômala.

### Conteúdo malicioso inserido via admin
1. Logue como admin e remova o conteúdo.
2. Se houve criação de usuário desconhecido, delete em Authentication → Users.
3. Considere rotacionar senhas dos admins legítimos.
4. Audite a tabela: `select id, updated_at from projects order by updated_at desc limit 50;`.

### DB corrompido
1. Restaure do backup (Supabase → Database → Backups).
2. Comunique downtime aos usuários.
3. Investigue causa antes de reabrir escrita.

---

## 10. Boas práticas operacionais

- [ ] Apenas pessoas autorizadas têm acesso ao painel Supabase.
- [ ] Senhas dos admins têm ≥ 12 caracteres, não reusadas.
- [ ] `.env` nunca é compartilhado por canal não seguro (email, chat).
- [ ] Revisões de PR sempre olham se `.env` ou chaves não foram commitadas por engano.
- [ ] Após `npm run seed`, a `SUPABASE_SERVICE_ROLE_KEY` é removida do `.env`.
- [ ] Backups semanais (mínimo) confirmados.
