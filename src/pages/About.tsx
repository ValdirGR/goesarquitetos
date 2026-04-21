import teamImg from "@/assets/team.jpg";
import { Compass, Leaf, Ruler, Sun } from "lucide-react";
import { useContent } from "@/store/useStudioStore";

const values = [
  { icon: Compass, t: "Escuta", d: "Cada projeto começa pelo lugar e pelas pessoas que vão habitá-lo." },
  { icon: Ruler, t: "Precisão", d: "Detalhamento minucioso, do conceito à última junta de piso." },
  { icon: Leaf, t: "Permanência", d: "Materiais honestos que envelhecem com beleza." },
  { icon: Sun, t: "Luz", d: "Desenhamos com a luz natural como matéria-prima essencial." },
];

const milestones = [
  { y: "1978", t: "Formação de Décio Gomes Góes pela Unisinos (RS)." },
  { y: "2001", t: "Início do mandato na Prefeitura de Criciúma (até 2004)." },
  { y: "2007", t: "Atuação na Assembleia Legislativa de Santa Catarina (até 2010)." },
  { y: "2013", t: "Início do mandato na Prefeitura de Balneário Rincão (até 2016)." },
  { y: "2014", t: "Formação de Fernando Gyrão Góes pela Unisul (SC)." },
];

const About = () => {
  return (
    <>
      <section className="container-editorial pt-32 md:pt-40 pb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Quem somos</p>
        <h1 className="font-serif text-4xl md:text-6xl max-w-3xl leading-[1.1]">
          Um escritório dedicado à arquitetura como ofício.
        </h1>
      </section>

      <section className="container-editorial pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <img
            src={teamImg}
            alt="Arquitetos sócios do escritório"
            loading="lazy"
            width={1280}
            height={1600}
            className="w-full h-auto object-cover"
          />
          <div className="md:pt-10">
            <p className="font-serif text-2xl md:text-3xl leading-snug text-foreground">
              Manifesto
            </p>
            <p className="mt-6 text-base md:text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
              <ManifestoText />
            </p>
          </div>
        </div>
      </section>

      {/* Arquitetos */}
      <section className="container-editorial pb-24">
        <h2 className="font-serif text-3xl md:text-4xl mb-12">Arquitetos</h2>
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <article>
            <p className="font-serif text-2xl md:text-3xl">Décio Gomes Góes</p>
            <p className="text-sm text-muted-foreground mt-1">
              Arquiteto e Urbanista · CAU A3612-9
            </p>
            <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed text-base">
              <p>
                Formado em 1978 pela Universidade do Vale do Rio dos Sinos — Unisinos,
                São Leopoldo/Rio Grande do Sul.
              </p>
              <p>
                Ao longo de quase 48 anos de exercício profissional, vem compondo um amplo
                portfólio de projetos e reformas de casas, edifícios residenciais, comerciais
                e industriais, clubes recreativos e propostas urbanísticas, alguns dos quais
                em parceria com colegas.
              </p>
              <p>
                Os mandatos conquistados nas Prefeituras de Criciúma (2001 a 2004) e Balneário
                Rincão (2013 a 2016) e na Assembleia Legislativa do Estado de Santa Catarina —
                ALESC (2007 a 2010) lhe possibilitaram acumular grande experiência no
                planejamento e desenvolvimento regional, estadual e em planos diretores urbanos.
              </p>
              <p>
                Participa de entidades de classe, como o IAB e a ASCEA. Foi Conselheiro do
                CREA e CAU/SC.
              </p>
              <p>
                Continua sendo um apaixonado por sua arte, muito mais do que nos primeiros
                projetos arquitetônicos e urbanísticos.
              </p>
            </div>
          </article>

          <article>
            <p className="font-serif text-2xl md:text-3xl">Fernando Gyrão Góes</p>
            <p className="text-sm text-muted-foreground mt-1">
              Arquiteto e Urbanista · CAU 14.9368-0
            </p>
            <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed text-base">
              <p>
                Formado em 2014 pela Universidade do Sul de Santa Catarina — Unisul,
                Tubarão/Santa Catarina, seus trabalhos estão ligados à Arquitetura de
                Interiores, Iluminação, Pintura, Escultura, Marketing e Gestão de Negócios.
              </p>
              <p>
                Além disso, atua nas áreas de corretagem e avaliação imobiliária.
              </p>
              <p>
                Atualmente, cursa Design de Interiores no SENAC.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Linha do tempo */}
      <section className="bg-secondary py-24">
        <div className="container-editorial">
          <h2 className="font-serif text-3xl md:text-4xl mb-12">Marcos</h2>
          <ol className="space-y-8 max-w-3xl">
            {milestones.map((m) => (
              <li key={m.y} className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-6 border-b border-border pb-6">
                <span className="font-serif text-2xl text-primary">{m.y}</span>
                <p className="text-foreground/80 self-center">{m.t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Valores */}
      <section className="container-editorial py-24 md:py-32">
        <h2 className="font-serif text-3xl md:text-4xl mb-12">Valores</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {values.map((v) => (
            <div key={v.t}>
              <v.icon className="size-7 text-primary" strokeWidth={1.4} />
              <h3 className="font-serif text-xl mt-5">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

const ManifestoSection = () => {
  const { content } = useContent();
  const src = content.manifestoImage?.trim() ? content.manifestoImage : teamImg;
  return (
    <section className="container-editorial pb-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <img
          src={src}
          alt="Arquitetos sócios do escritório"
          loading="lazy"
          width={1280}
          height={1600}
          className="w-full h-auto object-cover"
        />
        <div className="md:pt-10">
          <p className="font-serif text-2xl md:text-3xl leading-snug text-foreground">
            Manifesto
          </p>
          <p className="mt-6 text-base md:text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
            {content.manifesto}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
