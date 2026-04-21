import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNews } from "@/store/useStudioStore";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

const truncate = (s: string, n: number) =>
  s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;

const NewsDetail = () => {
  const { id } = useParams();
  const { news } = useNews();
  const post = news.find((n) => n.id === id);
  if (!post) return <Navigate to="/noticias" replace />;

  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const others = sorted.filter((n) => n.id !== post.id).slice(0, 3);

  const pageTitle = truncate(`${post.title} · Góes Arquitetos`, 60);
  const description = truncate(post.excerpt || post.content.replace(/\s+/g, " "), 158);
  const url = typeof window !== "undefined" ? window.location.href : `/noticias/${post.id}`;
  const image = post.cover;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        {image && <meta property="og:image" content={image} />}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: post.title,
            description,
            image: image ? [image] : undefined,
            datePublished: post.date,
            author: { "@type": "Person", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "Góes Arquitetos Associados",
            },
            mainEntityOfPage: url,
          })}
        </script>
      </Helmet>
      <article className="container-editorial pt-32 md:pt-40 pb-16 md:pb-24 max-w-3xl">
        <Link
          to="/noticias"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground/60 hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="size-4" /> Todas as notícias
        </Link>

        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5">
          {post.category} · {formatDate(post.date)}
        </p>
        <h1 className="font-serif text-3xl md:text-5xl leading-[1.1]">{post.title}</h1>
        <p className="mt-6 text-sm text-muted-foreground">Por {post.author}</p>
      </article>

      <div className="container-editorial pb-12 md:pb-20">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          <img src={post.cover} alt={post.title} className="h-full w-full object-cover" />
        </div>
      </div>

      <article className="container-editorial pb-24 md:pb-32 max-w-3xl">
        <div className="space-y-6 text-base md:text-lg text-foreground/85 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>

      {others.length > 0 && (
        <section className="bg-secondary py-20 md:py-28">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-12">
              <h2 className="font-serif text-2xl md:text-4xl">Continue lendo</h2>
              <Link
                to="/noticias"
                className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wide text-foreground/70 hover:text-primary"
              >
                Ver todas <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {others.map((n) => (
                <Link key={n.id} to={`/noticias/${n.id}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={n.cover}
                      alt={n.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-primary">
                    {formatDate(n.date)}
                  </p>
                  <h3 className="font-serif text-lg md:text-xl mt-2 leading-snug group-hover:text-primary transition-colors">
                    {n.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default NewsDetail;
