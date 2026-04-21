import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useContent, useProjects } from "@/store/useStudioStore";

const Home = () => {
  const { content } = useContent();
  const { projects } = useProjects();
  const featured = projects.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Interior arquitetônico minimalista com grandes janelas"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/70" />
        <div className="relative z-10 container-editorial h-full flex flex-col justify-end pb-24 md:pb-32 text-background fade-in-up">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 text-background/80">Escritório de Arquitetura</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.05]">
            {content.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-background/85 leading-relaxed">
            {content.heroSubtitle}
          </p>
          <Link
            to="/projetos"
            className="mt-10 inline-flex items-center gap-3 self-start border-b border-background/60 pb-2 text-sm uppercase tracking-[0.2em] hover:border-background hover:gap-5 transition-all"
          >
            {content.heroCta} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Filosofia */}
      <section className="container-editorial py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <p className="md:col-span-3 text-xs uppercase tracking-[0.3em] text-primary">Filosofia</p>
          <div className="md:col-span-9">
            <p className="font-serif text-2xl md:text-4xl leading-snug text-foreground">
              {content.philosophy}
            </p>
          </div>
        </div>
      </section>

      {/* Projetos em destaque */}
      <section className="container-editorial pb-24 md:pb-36">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Selecionados</p>
            <h2 className="font-serif text-3xl md:text-5xl">Projetos em destaque</h2>
          </div>
          <Link to="/projetos" className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wide text-foreground/70 hover:text-primary">
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <Link key={p.id} to={`/projetos/${p.id}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</p>
                <h3 className="font-serif text-xl mt-1 group-hover:text-primary transition-colors">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container-editorial py-24 md:py-36">
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{content.servicesEyebrow}</p>
              <h2 className="font-serif text-3xl md:text-5xl leading-tight">{content.servicesTitle}</h2>
            </div>
            <p className="md:col-span-7 md:col-start-6 text-base md:text-lg text-foreground/75 leading-relaxed self-end">
              {content.servicesIntro}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {content.services.map((item, i) => (
              <article
                key={`${item.title}-${i}`}
                className="bg-background p-8 md:p-10 group hover:bg-card transition-colors"
              >
                <p className="font-serif text-2xl text-primary mb-5">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-xl md:text-2xl leading-snug mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="bg-foreground text-background py-20">
        <div className="container-editorial grid grid-cols-2 md:grid-cols-4 gap-10 text-center md:text-left">
          {[
            { n: "10+", l: "anos de atuação" },
            { n: "120", l: "projetos entregues" },
            { n: "8", l: "prêmios recebidos" },
            { n: "24", l: "cidades atendidas" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-serif text-5xl md:text-6xl text-primary-glow">{s.n}</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-background/70">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Contato */}
      <section className="container-editorial py-24 md:py-36 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Vamos conversar</p>
        <h2 className="font-serif text-3xl md:text-5xl max-w-3xl mx-auto leading-tight">
          Tem um projeto em mente? Adoraríamos ouvir sua história.
        </h2>
        <Link
          to="/contato"
          className="mt-10 inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-primary-glow transition-colors"
        >
          Iniciar conversa <ArrowRight className="size-4" />
        </Link>
      </section>
    </>
  );
};

export default Home;
