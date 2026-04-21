export type ProjectCategory = "residencial" | "comercial";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: number;
  location: string;
  area: string;
  description: string;
  cover: string;
  gallery: string[];
}

export const initialProjects: Project[] = [
  {
    id: "casa-moema",
    title: "Casa Moema",
    category: "residencial",
    year: 2024,
    location: "São Paulo, SP",
    area: "420 m²",
    description:
      "Residência em terreno arborizado, com pátio interno e integração total entre interior e jardim. Estrutura em concreto aparente e brises de madeira filtram a luz natural ao longo do dia.",
    cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80",
    ],
  },
  {
    id: "refugio-serra",
    title: "Refúgio na Serra",
    category: "residencial",
    year: 2023,
    location: "Petrópolis, RJ",
    area: "280 m²",
    description:
      "Casa de campo implantada em encosta, com telhado borboleta e grandes vãos envidraçados que emolduram a mata atlântica.",
    cover: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
    ],
  },
  {
    id: "apto-jardins",
    title: "Apartamento Jardins",
    category: "residencial",
    year: 2024,
    location: "São Paulo, SP",
    area: "180 m²",
    description:
      "Reforma integral de apartamento em prédio histórico. Paleta neutra, marcenaria sob medida em freijó e iluminação cenográfica.",
    cover: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80",
    ],
  },
  {
    id: "casa-litoral",
    title: "Casa Litoral Norte",
    category: "residencial",
    year: 2022,
    location: "São Sebastião, SP",
    area: "510 m²",
    description:
      "Casa de praia em platibandas brancas com cobogós artesanais. Ventilação cruzada e piscina em concreto pigmentado.",
    cover: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1600&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600&q=80",
    ],
  },
  {
    id: "escritorio-faria-lima",
    title: "Escritório Faria Lima",
    category: "comercial",
    year: 2024,
    location: "São Paulo, SP",
    area: "1.200 m²",
    description:
      "Sede corporativa de duas lajes, com átrio central, jardins internos e mobiliário desenhado sob medida para integrar equipes.",
    cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1600&q=80",
    ],
  },
  {
    id: "restaurante-vila",
    title: "Restaurante Vila",
    category: "comercial",
    year: 2023,
    location: "Curitiba, PR",
    area: "320 m²",
    description:
      "Restaurante autoral em casarão restaurado. Tijolo aparente, iluminação quente e cozinha exposta como protagonista.",
    cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80",
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1600&q=80",
    ],
  },
  {
    id: "boutique-oscar",
    title: "Boutique Oscar",
    category: "comercial",
    year: 2024,
    location: "Belo Horizonte, MG",
    area: "180 m²",
    description:
      "Loja conceito em concreto polido e travertino, com vitrine escultural e provadores em madeira ripada.",
    cover: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&q=80",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1600&q=80",
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1600&q=80",
    ],
  },
  {
    id: "cafe-hub",
    title: "Café Hub",
    category: "comercial",
    year: 2022,
    location: "Florianópolis, SC",
    area: "210 m²",
    description:
      "Café e coworking em pavilhão industrial. Estrutura metálica preta, mobiliário leve e jardim suspenso.",
    cover: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1600&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1600&q=80",
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1600&q=80",
    ],
  },
];

export interface ServiceItem {
  title: string;
  description: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  philosophy: string;
  manifesto: string;
  manifestoImage: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesIntro: string;
  services: ServiceItem[];
}

export const initialContent: SiteContent = {
  heroTitle: "Arquitetura que respira o tempo.",
  heroSubtitle:
    "Escritório dedicado a projetos residenciais, comerciais, urbanísticos e de interiores — onde luz, matéria e silêncio se encontram.",
  heroCta: "Ver Projetos",
  philosophy:
    "Acreditamos em espaços que envelhecem com elegância. Cada projeto começa pela escuta — do lugar, da luz, do cliente — e se constrói com materiais honestos e proporções justas.",
  manifesto:
    "A Góes Arquitetos Associados nasce do encontro entre arquitetura, urbanismo e interiores. Trabalhamos sob medida, dedicando atenção integral a cada detalhe — da implantação ao último puxador.",
  contactAddress: "Rua dos Pinheiros, 240 — São Paulo, SP",
  contactPhone: "+55 11 4002-8922",
  contactEmail: "contato@goesarquitetos.com.br",
  servicesEyebrow: "O que fazemos",
  servicesTitle: "Áreas de atuação",
  servicesIntro:
    "A Góes Arquitetos Associados Ltda. atua de forma integrada em todas as etapas do processo arquitetônico e urbanístico, do estudo inicial à entrega da obra.",
  services: [
    { title: "Arquitetura na construção civil", description: "Concepção e desenvolvimento de projetos arquitetônicos para os mais diversos segmentos da construção civil, do residencial ao institucional." },
    { title: "Arquitetura de Interiores", description: "Ambientes funcionais, sensoriais e atemporais — pensados sob medida para refletir a identidade de quem os habita." },
    { title: "Urbanismo", description: "Soluções urbanas que articulam paisagem, mobilidade e convivência, respeitando a vocação de cada território." },
    { title: "Parcelamento do solo", description: "Projetos de parcelamento do solo e planejamento físico-territorial, alinhados às diretrizes legais e ao desenho urbano." },
    { title: "Acompanhamento de obras", description: "Acompanhamento técnico na execução e/ou fiscalização de obras, garantindo fidelidade ao projeto e qualidade construtiva." },
    { title: "Consultoria", description: "Pareceres e orientações técnicas em arquitetura, urbanismo e processos de aprovação junto aos órgãos competentes." },
    { title: "Análise de terrenos", description: "Estudo das potencialidades de terrenos conforme os Planos Diretores Urbanos, identificando o melhor aproveitamento." },
    { title: "Investimentos imobiliários", description: "Assessoria em investimentos e empreendimentos imobiliários, conectando viabilidade técnica e estratégia de negócio." },
  ],
};
