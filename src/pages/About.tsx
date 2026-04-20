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
  { y: "2014", t: "Fundação do estúdio em São Paulo." },
  { y: "2018", t: "Primeiro prêmio nacional de arquitetura residencial." },
  { y: "2021", t: "Expansão para projetos comerciais e hospitalidade." },
  { y: "2024", t: "120 projetos entregues em 24 cidades brasileiras." },
];

const About = () => {
  return (
    <>
      <section className="container-editorial pt-32 md:pt-40 pb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Quem somos</p>
        <h1 className="font-serif text-4xl md:text-6xl max-w-3xl leading-[1.1]">
          Um estúdio dedicado à arquitetura como ofício.
        </h1>
      </section>

      <section className="container-editorial pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <img
            src={teamImg}
            alt="Sócias fundadoras do estúdio"
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
              {/* manifesto vem do conteúdo gerenciado */}
              <ManifestoText />
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div>
                <p className="font-serif text-xl">Helena Marques</p>
                <p className="text-sm text-muted-foreground">Sócia-fundadora</p>
              </div>
              <div>
                <p className="font-serif text-xl">Beatriz Antunes</p>
                <p className="text-sm text-muted-foreground">Sócia-fundadora</p>
              </div>
            </div>
          </div>
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

const ManifestoText = () => {
  const { content } = useContent();
  return <>{content.manifesto}</>;
};

export default About;
