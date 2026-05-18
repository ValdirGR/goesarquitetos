# Painel Admin — Guia do Usuário

Como usar `/admin` no dia a dia para manter o site atualizado.

> Acesso: `https://<seu-dominio>/login`

---

## 1. Login

1. Acesse `/login`.
2. Informe email e senha cadastrados no Supabase.
3. Após sucesso, será redirecionado para `/admin/projetos`.

**Esqueceu a senha?** Hoje não há fluxo de recuperação automática. Solicite ao administrador técnico que redefina pelo painel do Supabase (Authentication → Users → ⋯ → Send password recovery / Reset password).

---

## 2. Estrutura do painel

| Seção | Caminho | O que controla |
|-------|---------|----------------|
| Projetos | `/admin/projetos` | Portfólio (página `/projetos`) |
| Notícias | `/admin/noticias` | Blog/Notícias (página `/noticias`) |
| Conteúdo do Site | `/admin/conteudo` | Textos e imagens do Home, Quem Somos e Contato |

A navegação fica na barra lateral. **Sair** está no rodapé da sidebar.

---

## 3. Projetos

### 3.1 Listar
A tabela mostra capa, título, categoria, ano e local. Ordenada do mais recente para o mais antigo.

### 3.2 Criar
1. Botão **"Novo projeto"** (topo direito).
2. Preencha:
   - **Título** (obrigatório)
   - **Categoria** (`Residencial` / `Comercial`)
   - **Ano**
   - **Área** (texto livre, ex.: `320 m²`)
   - **Local**
   - **Imagem de capa** (recomendado 1600×2000 px)
   - **Galeria** (várias imagens)
   - **Descrição**
3. **Salvar**.

> O `id` do projeto é gerado automaticamente a partir do título (slug). Isso vira a URL: `/projetos/<id>`.

### 3.3 Editar
Clique no ícone de lápis na linha do projeto. Faça alterações e salve.

### 3.4 Excluir
Ícone de lixeira. **Não há undo** — confirme antes.

### 3.5 Galeria — upload em lote
Dentro do formulário, na seção **Galeria de imagens**:
- Botão **"Upload múltiplo"**: selecione vários arquivos.
- Ou arraste arquivos para a área tracejada.
- Limite: 3 MB por arquivo.
- As imagens vão direto para o Supabase Storage; a URL pública é guardada no projeto.

### 3.6 Reordenar galeria
Hoje a ordem é a ordem de upload. Para reorganizar:
- Use o "X" para remover uma imagem.
- Re-uploade na nova ordem.

---

## 4. Notícias

### 4.1 Criar
1. Botão **"Nova notícia"**.
2. Campos:
   - **Título** (obrigatório)
   - **Categoria** (texto livre, ex.: `Urbanismo`, `Tendências`)
   - **Autor**
   - **Data** (data de publicação)
   - **Imagem de capa** (1600×1200 px)
   - **Resumo** (aparece em cards e SEO)
   - **Conteúdo** (corpo completo — separe parágrafos com **linha em branco**)
3. Salvar.

> Não há editor rich-text. Use apenas texto puro. Parágrafos = linha em branco entre blocos.

### 4.2 Editar / Excluir
Mesmos ícones da página de Projetos.

### 4.3 Fontes / Referências
A funcionalidade existe no banco (`sources jsonb`) mas **não há campo no formulário** ainda. Para adicionar fontes manualmente, é necessário intervenção via SQL.

---

## 5. Conteúdo do Site

Página única com várias seções editáveis:

### 5.1 Hero da Home
- **Título**, **Subtítulo**, **Texto do botão**.

### 5.2 Carrossel do Hero
- 3 slides com **imagem** (1920×1080) e **texto alternativo** (acessibilidade).
- Use as setas para reordenar.

### 5.3 Filosofia
- Texto exibido no Home, abaixo do hero.

### 5.4 Áreas de atuação (Home)
- **Sobretítulo**, **Título**, **Texto introdutório**.
- Lista de tópicos (título + descrição). Adicione/remova com os botões.

### 5.5 Manifesto (Quem Somos)
- Texto e imagem (1280×1600).

### 5.6 Contato
- Endereço, telefone, e-mail (aparecem em `/contato`).

> **Importante**: clique em **"Salvar alterações"** ao final da página para persistir. Caso saia sem salvar, as edições são perdidas.

---

## 6. Upload de imagens — detalhes

O uploader é o mesmo em todas as telas:

| Item | Detalhe |
|------|---------|
| Formatos aceitos | JPG, PNG, WebP, AVIF |
| Tamanho máx. | 3 MB por arquivo |
| Redimensionamento | Automático para o tamanho recomendado mostrado abaixo do upload |
| Crop | Cover central (recorta sobras para preencher) |
| Cole URL | Opcional — cole uma URL externa em vez de subir arquivo |

> Se a imagem for menor que o recomendado, ela será ampliada (com perda de qualidade). Prefira sempre originais maiores.

---

## 7. Boas práticas editoriais

- **Imagens**: prefira originais grandes (≥ 2000 px no lado maior) e bem iluminadas.
- **Slugs (URL)**: derivam do título — escolha títulos sem caracteres especiais para URLs limpas.
- **Datas das notícias**: respeitam a ordenação. Backdating é permitido.
- **Categorias**: padronize (não misture `urbanismo` e `Urbanismo`).
- **Descrições**: 2–4 parágrafos curtos rendem melhor leitura mobile.

---

## 8. Problemas comuns

| Problema | O que fazer |
|----------|-------------|
| "Falha ao enviar a imagem" | Verifique tamanho do arquivo, conexão; tente outro formato |
| Sumiu do site público após salvar | Recarregue (Ctrl+F5). O cache do React Query expira em 30s |
| Não consigo entrar | Verifique se está usando o email exato cadastrado; peça reset ao admin técnico |
| Página fica "Carregando..." indefinidamente | Sessão expirada — vá para `/login` |

---

## 9. Logout

Botão **"Sair"** no rodapé da sidebar. Encerra a sessão imediatamente e redireciona para a home pública.
