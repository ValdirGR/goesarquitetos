export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: string;
  author: string;
  date: string; // ISO date
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
];
