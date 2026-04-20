
# Site para Escritório de Arquitetura

Site institucional moderno, minimalista e elegante, com paleta **verde musgo + preto + off-white**, tipografia serifada nos títulos e sans-serif no corpo. Totalmente responsivo, com fotos de alta qualidade (Unsplash) e dados mockados.

## Identidade visual
- **Cores**: verde musgo (`#4A5D3A` aprox.), preto profundo, off-white, cinza claro para divisores
- **Tipografia**: Playfair Display (títulos) + Inter (corpo)
- **Estética**: muito espaço em branco, fotos grandes, transições suaves, micro-interações sutis ao hover

## Páginas públicas

### 1. Home
- **Hero** em tela cheia com foto arquitetônica de destaque, nome do escritório, tagline curta e CTA "Ver Projetos"
- Seção "Filosofia" — frase de impacto + breve apresentação
- **Projetos em destaque** — 3 a 4 cards selecionados
- Faixa de números (anos de atuação, projetos entregues, prêmios)
- Bloco de chamada para Contato

### 2. Quem Somos
- Manifesto do escritório (texto editorial)
- Foto da equipe / sócios fundadores com bio curta
- Linha do tempo / marcos
- Valores em ícones minimalistas

### 3. Projetos
- Header com título grande
- **Filtros**: Todos · Residenciais · Comerciais
- Grid responsivo (3 col desktop / 2 tablet / 1 mobile) com hover revelando título e categoria
- Clique abre **página de detalhe** do projeto com: galeria de fotos, ficha técnica (área, ano, local), descrição
- ~8 projetos mockados (4 residenciais, 4 comerciais)

### 4. Contato
- Formulário (nome, e-mail, telefone, mensagem) com validação e toast de sucesso
- Informações: endereço, telefone, e-mail, redes sociais
- Mapa estático ilustrativo

## Área Admin

### Login (`/login`)
- Tela minimalista com e-mail + senha
- **Mockado**: qualquer credencial válida entra (ex.: `admin@studio.com` / `admin123`), sessão guardada em localStorage
- Rotas admin protegidas por guard simples

### Dashboard Admin (`/admin`)
Layout com sidebar lateral (recolhível) e três seções:

1. **Projetos** — tabela com listagem, botões Novo/Editar/Excluir, formulário com: título, categoria (Residencial/Comercial), ano, local, área, descrição, URLs de fotos (galeria), capa
2. **Conteúdo do Site** — edição inline dos textos: hero (título, subtítulo, CTA), filosofia da Home, manifesto Quem Somos, dados de contato
3. **Sair**

> Dados ficam em **localStorage** + estado global (Zustand ou Context). Nada é persistido em backend nesta fase — preparado para migrar para Lovable Cloud depois.

## Navegação
- Header fixo translúcido com logo e menu (Home · Quem Somos · Projetos · Contato)
- No mobile, menu hambúrguer com drawer lateral
- Footer minimalista com links, redes sociais e copyright
- Link "Login" discreto no footer (não no menu principal)

## Responsividade & UX
- Breakpoints mobile-first
- Imagens com `loading="lazy"` e aspect-ratio fixo (sem layout shift)
- Animações sutis de entrada ao rolar (fade/slide curtos)
- Foco visível e navegação por teclado

## Fora do escopo desta entrega
- Backend real, e-mail transacional do formulário, upload de imagens (apenas URLs colados no admin), SEO avançado / CMS — podem entrar em iterações futuras.
