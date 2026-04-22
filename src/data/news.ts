export interface NewsSource {
  label: string;
  url: string;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: string;
  author: string;
  date: string; // ISO date
  sources?: NewsSource[];
}

export const initialNews: NewsPost[] = [
  {
    id: "premio-iab-2024",
    title: "Góes Arquitetos recebe menção no Prêmio IAB 2024",
    excerpt:
      "Projeto residencial em Criciúma é destacado pela integração entre paisagem e arquitetura contemporânea.",
    content:
      "O escritório Góes Arquitetos Associados foi homenageado na edição 2024 do Prêmio IAB pela proposta da Casa Pátio, residência localizada em Criciúma (SC).\n\nO júri destacou a maturidade do projeto na relação entre cheios e vazios, o uso honesto de materiais regionais e a sensibilidade com o entorno arborizado. A obra foi entregue em janeiro deste ano e já figura em publicações nacionais especializadas em arquitetura residencial.\n\n“Receber este reconhecimento reforça o compromisso do escritório com uma arquitetura atemporal, feita à medida do lugar e das pessoas”, comenta Fernando Gyrão Góes.",
    cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    category: "Reconhecimento",
    author: "Redação",
    date: "2024-11-12",
  },
  {
    id: "novo-plano-diretor",
    title: "Décio Góes participa de debate sobre novo Plano Diretor",
    excerpt:
      "Arquiteto e urbanista contribuiu com propostas para revisão do plano diretor de Balneário Rincão.",
    content:
      "Em audiência pública realizada no início de outubro, o arquiteto Décio Gomes Góes participou ativamente das discussões sobre a revisão do Plano Diretor de Balneário Rincão.\n\nCom mandatos anteriores como gestor público e décadas de atuação em planejamento territorial, Décio defendeu instrumentos urbanísticos que conciliem a vocação turística da cidade com a preservação ambiental e a moradia digna.\n\n“Um bom plano diretor é aquele que olha para o longo prazo, mas resolve os problemas concretos do presente”, afirmou durante sua fala.",
    cover: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80",
    category: "Urbanismo",
    author: "Redação",
    date: "2024-10-08",
  },
  {
    id: "interiores-tendencias-2025",
    title: "Tendências de interiores para 2025 segundo o nosso estúdio criativo",
    excerpt:
      "Materiais naturais, paletas terrosas e iluminação cênica devem dominar os projetos residenciais no próximo ano.",
    content:
      "A equipe de interiores do escritório, liderada por Fernando Gyrão Góes, compartilha as principais direções estéticas observadas nos projetos em andamento para 2025.\n\nEntre os destaques: o retorno da madeira maciça em tons médios, paletas terrosas combinadas com verdes profundos, marcenaria curvilínea e o uso da iluminação como elemento escultórico. A sustentabilidade segue como pilar — com prioridade para fornecedores locais e materiais de origem rastreável.\n\n“Buscamos ambientes que envelhecem com elegância, longe de modismos passageiros”, resume Fernando.",
    cover: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    category: "Interiores",
    author: "Fernando Gyrão Góes",
    date: "2024-09-22",
  },

  // ===== Tendências reais (com fontes) =====
  {
    id: "circularidade-biomateriais-2025",
    title: "Circularidade, biomateriais e design carbono-consciente convergem em 2025",
    excerpt:
      "ArchDaily aponta que a arquitetura global passa a tratar carbono incorporado, reúso de componentes e biomateriais como pauta única.",
    content:
      "Reportagem do ArchDaily mostra que três agendas antes paralelas — economia circular, biomateriais e descarbonização — começam a se sobrepor nos escritórios em 2025. A leitura prática: especificar materiais com origem rastreável, projetar para desmontagem e medir carbono incorporado desde o estudo preliminar.\n\nO movimento é puxado por novas exigências regulatórias na Europa e por clientes corporativos que cobram relatórios ESG. Edifícios passam a ser pensados como “bancos de materiais”, com componentes catalogados para futura reutilização — um deslocamento conceitual relevante para projetos comerciais e institucionais.\n\nPara o nosso estúdio, a leitura reforça uma prática já em curso: priorizar madeira certificada, alvenaria local e sistemas construtivos secos, que envelhecem bem e podem ser remontados.",
    cover: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80",
    category: "Sustentabilidade",
    author: "Redação",
    date: "2025-03-14",
    sources: [
      {
        label: "ArchDaily — Converging Architectural Trends in 2025",
        url: "https://www.archdaily.com/1037027/converging-trends-in-2025-architecture-circularity-biomaterials-and-carbon-conscious-design",
      },
    ],
  },
  {
    id: "design-biofilico-modular-2025",
    title: "Design biofílico e construção modular lideram pauta residencial em 2025",
    excerpt:
      "Levantamento mostra crescimento de projetos que combinam vegetação integrada, ventilação cruzada e pré-fabricação.",
    content:
      "Segundo análise publicada pela SDS Educa, a casa de 2025 nasce com dois eixos quase obrigatórios: biofilia (luz natural generosa, jardins internos, materiais vivos) e racionalização construtiva via módulos pré-fabricados.\n\nA combinação responde a três pressões simultâneas — bem-estar dos moradores, prazo de obra e controle de desperdício no canteiro. Estúdios brasileiros têm experimentado painéis em CLT, steel frame e marcenaria modular para reduzir o tempo de obra em até 40%.\n\nNo escritório, vemos o tema chegar com força em projetos de segunda residência e hotelaria boutique, em que cliente e operação se beneficiam de prazos curtos sem abrir mão de uma materialidade quente.",
    cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
    category: "Tendências",
    author: "Redação",
    date: "2025-02-20",
    sources: [
      {
        label: "SDS Educa — Tendências de Arquitetura 2025",
        url: "https://sdseduca.com.br/tendencias-de-arquitetura-para-2025-do-design-biofilico-a-construcao-modular/",
      },
      {
        label: "Yanko Design — Architectural Trends to Watch in 2025",
        url: "https://www.yankodesign.com/2025/01/16/architectural-trends-to-watch-in-2025-biophilic-design-adaptive-reuse-more/",
      },
    ],
  },
  {
    id: "madeira-massiva-clt-2025",
    title: "Madeira massiva (CLT) ganha tração em edifícios de média altura",
    excerpt:
      "Conferência internacional aponta avanço normativo e softwares dedicados como destravadores do mass timber.",
    content:
      "A International Mass Timber Conference de 2025 destaca que o gargalo do mass timber deixou de ser técnico e passou a ser de fluxo de projeto: faltam ferramentas BIM nativas e bibliotecas de detalhes prontas. Novos plug-ins com IA prometem encurtar essa lacuna nos próximos 24 meses.\n\nNo Brasil, fabricantes de CLT e glulam ampliam capacidade e há projetos residenciais de 4 a 8 pavimentos em estudo em SP, RS e SC. O material entrega bom desempenho térmico, acabamento aparente e redução expressiva de carbono incorporado em relação ao concreto.\n\nPara escritórios médios, a recomendação é começar por projetos pilotos — coberturas, anexos, escadas — antes de migrar para estruturas integralmente em madeira.",
    cover: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80",
    category: "Materiais",
    author: "Redação",
    date: "2025-04-02",
    sources: [
      {
        label: "International Mass Timber Conference — AI & AEC Software Report 2025",
        url: "https://masstimberconference.com/report/content/are-we-there-yet-closing-the-gap-removing-barriers-the-role-of-ai-and-aec-software-2025/",
      },
      {
        label: "NeoBambu — Tendências para Bambu e Madeira 2025",
        url: "https://neobambu.com.br/2025/01/09/tendencia-arquitetura-bambu-e-madeira/",
      },
    ],
  },
  {
    id: "retrofit-adaptive-reuse-2025",
    title: "Retrofit e adaptive reuse: o novo é reaproveitar o que já existe",
    excerpt:
      "Conversão de edifícios obsoletos em moradia e usos mistos vira estratégia central de cidades em 2025.",
    content:
      "Relatórios da Yanko Design e da JLL convergem em um diagnóstico: diante da crise habitacional e do alto custo do carbono incorporado, retrofit e adaptive reuse deixam de ser nicho e passam a ser estratégia urbana de primeira linha.\n\nPrédios de escritórios subutilizados são candidatos óbvios à conversão residencial; galpões industriais ganham vida nova como hubs criativos e equipamentos culturais. Pesquisas com IA já ajudam a triar rapidamente o estoque construído por viabilidade estrutural, normativa e econômica.\n\nNo escritório, o tema dialoga com nossa atuação em centros históricos e com projetos que partem da pré-existência como matéria-prima projetual — não como obstáculo.",
    cover: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
    category: "Urbanismo",
    author: "Redação",
    date: "2025-01-28",
    sources: [
      {
        label: "Yanko Design — Adaptive Reuse 2025",
        url: "https://www.yankodesign.com/2025/01/16/architectural-trends-to-watch-in-2025-biophilic-design-adaptive-reuse-more/",
      },
      {
        label: "JLL — Outlook on Design Trends 2025",
        url: "https://www.jll.nz/en/trends-and-insights/research/2025-outlook-on-global-design-trends",
      },
      {
        label: "Cutter Consortium — AI in Adaptive Reuse Decision-Making",
        url: "https://www.cutter.com/article/accelerating-adaptive-reuse-decision-making-ai",
      },
    ],
  },
  {
    id: "ia-projeto-arquitetura-2025",
    title: "Inteligência artificial entra no fluxo de projeto, do estudo à obra",
    excerpt:
      "Ferramentas generativas começam a apoiar massas, plantas e detalhamento — sem substituir o autor do projeto.",
    content:
      "Análises da JLL e do Cutter Consortium apontam 2025 como o ano em que a IA generativa migra de demonstração de capa para o cotidiano dos escritórios. Os ganhos mais consistentes ainda estão nas etapas iniciais — estudos de massa, comparações de implantação, otimização solar — e na compatibilização de projetos complementares.\n\nA recomendação dos autores é prática: tratar a IA como “estagiário rápido”, com revisão humana obrigatória em decisões autorais, normativas e de segurança. Estúdios que padronizam prompts, bibliotecas e templates extraem mais valor do que os que usam a tecnologia de forma pontual.\n\nNosso escritório acompanha o tema com cautela: adotamos as ferramentas onde liberam tempo para o projeto, mas mantemos o gesto autoral e o desenho como linguagem central.",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80",
    category: "Tecnologia",
    author: "Redação",
    date: "2025-03-30",
    sources: [
      {
        label: "JLL — Outlook on Design Trends 2025",
        url: "https://www.jll.nz/en/trends-and-insights/research/2025-outlook-on-global-design-trends",
      },
      {
        label: "Cutter Consortium — AI in Adaptive Reuse",
        url: "https://www.cutter.com/article/accelerating-adaptive-reuse-decision-making-ai",
      },
    ],
  },
  {
    id: "arquitetura-ancestral-yawanawa",
    title: "Arquitetura ancestral: aldeia Yawanawá propõe novas formas de habitar a floresta",
    excerpt:
      "Projeto de Marcelo Rosenbaum com o povo Yawanawá une saberes tradicionais, ciência e desenho contemporâneo.",
    content:
      "Reportagem da Casa Vogue / Globo apresenta a Aldeia Sagrada Yawanawá, projeto coletivo conduzido por Marcelo Rosenbaum em parceria com lideranças do povo Yawanawá no Acre. A proposta articula técnicas construtivas indígenas, materiais da floresta e parâmetros de conforto contemporâneos.\n\nMais do que estética, o trabalho aponta um caminho metodológico: o projeto nasce da escuta da comunidade e do território, e o arquiteto atua como mediador. Esse modelo dialoga com discussões globais sobre design regenerativo e justiça territorial.\n\nPara escritórios brasileiros, é uma referência valiosa de como projetar com — e não apenas para — comunidades, com impacto cultural e ambiental positivo.",
    cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
    category: "Cultura",
    author: "Redação",
    date: "2025-04-19",
    sources: [
      {
        label: "Casa Vogue — Aldeia Sagrada Yawanawá",
        url: "https://casavogue.globo.com/um-so-planeta/noticia/2026/04/como-esta-aldeia-propoe-novas-formas-de-habitar-a-floresta.ghtml",
      },
    ],
  },
];
