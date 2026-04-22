import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import heroImg from "@/assets/hero.jpg";
import { useContent, useProjects, useNews } from "@/store/useStudioStore";

const FALLBACK_HERO = [
  { src: heroImg, alt: "Interior arquitetônico minimalista com grandes janelas" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

const Home = () => {
  const { content } = useContent();
  const { projects } = useProjects();
  const { news } = useNews();
  const featured = projects.slice(0, 4);
  const latestNews = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  const configuredHero = (content.heroImages ?? []).filter((s) => s?.src?.trim());
  const heroSlides = configuredHero.length > 0 ? configuredHero : FALLBACK_HERO;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    emblaApi.reInit();
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <div ref={emblaRef} className="absolute inset-0 h-full w-full overflow-hidden">
          <div className="flex h-full">
            {heroSlides.map((slide, i) => (
              <div key={i} className="relative h-full min-w-0 flex-[0_0_100%]">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="h-full w-full object-cover"
                  width={1920}
                  height={1280}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/70" />

        <button
          type="button"
          aria-label="Imagem anterior"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          className="absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full border border-background/40 bg-foreground/20 text-background backdrop-blur-sm transition hover:bg-foreground/40 hover:border-background/70 disabled:opacity-40"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          aria-label="Próxima imagem"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          className="absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full border border-background/40 bg-foreground/20 text-background backdrop-blur-sm transition hover:bg-foreground/40 hover:border-background/70 disabled:opacity-40"
        >
          <ChevronRight className="size-6" />
        </button>
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

      {/* Notícias */}
      {latestNews.length > 0 && (
        <section className="container-editorial py-24 md:py-36">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Jornal</p>
              <h2 className="font-serif text-3xl md:text-5xl">Últimas notícias</h2>
            </div>
            <Link
              to="/noticias"
              className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wide text-foreground/70 hover:text-primary"
            >
              Ver todas <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {latestNews.map((n) => (
              <Link key={n.id} to={`/noticias/${n.id}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={n.cover}
                    alt={n.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.25em] text-primary">
                  {n.category} · {formatDate(n.date)}
                </p>
                <h3 className="font-serif text-xl md:text-2xl mt-3 leading-snug group-hover:text-primary transition-colors">
                  {n.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-3">
                  {n.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/70 group-hover:text-primary group-hover:gap-3 transition-all">
                  Ler matéria <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="md:hidden mt-10">
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-foreground/70 hover:text-primary"
            >
              Ver todas <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

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
