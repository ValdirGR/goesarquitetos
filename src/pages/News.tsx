import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useNews } from "@/store/useStudioStore";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

const News = () => {
  const { news } = useNews();
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = sorted;

  return (
    <>
      <section className="container-editorial pt-32 md:pt-40 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Notícias</p>
        <h1 className="font-serif text-4xl md:text-6xl max-w-3xl leading-[1.1]">
          Reflexões, projetos e novidades do escritório.
        </h1>
        <p className="mt-6 max-w-2xl text-base md:text-lg text-foreground/70 leading-relaxed">
          Acompanhe artigos, premiações e bastidores do nosso processo de criação em arquitetura, urbanismo e interiores.
        </p>
      </section>

      {featured && (
        <section className="container-editorial pb-16 md:pb-24">
          <Link to={`/noticias/${featured.id}`} className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={featured.cover}
                alt={featured.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
                {featured.category} · {formatDate(featured.date)}
              </p>
              <h2 className="font-serif text-2xl md:text-4xl leading-snug group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="mt-5 text-base md:text-lg text-foreground/75 leading-relaxed">
                {featured.excerpt}
              </p>
              <span className="mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-foreground/80 border-b border-border pb-2 group-hover:gap-5 group-hover:text-primary transition-all">
                Ler matéria <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section className="container-editorial pb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 border-t border-border pt-16">
            {rest.map((n) => (
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
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default News;
