import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useProjects } from "@/store/useStudioStore";

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gallery = project?.gallery ?? [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length)),
    [gallery.length]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % gallery.length)),
    [gallery.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  if (!project) {
    return (
      <div className="container-editorial pt-40 pb-24 text-center">
        <h1 className="font-serif text-3xl">Projeto não encontrado</h1>
        <Link to="/projetos" className="mt-6 inline-block text-primary underline">Voltar aos projetos</Link>
      </div>
    );
  }

  return (
    <>
      <section className="container-editorial pt-32 md:pt-40 pb-12">
        <Link to="/projetos" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="size-4" /> Voltar
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{project.category}</p>
        <h1 className="font-serif text-4xl md:text-6xl max-w-4xl leading-[1.05]">{project.title}</h1>
      </section>

      <section className="container-editorial pb-16">
        <div className="overflow-hidden bg-muted">
          <img src={project.cover} alt={project.title} className="block w-full h-auto" />
        </div>
      </section>

      <section className="container-editorial pb-24 grid md:grid-cols-12 gap-10">
        <aside className="md:col-span-4 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Local</p>
            <p className="font-serif text-xl mt-1">{project.location}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Ano</p>
            <p className="font-serif text-xl mt-1">{project.year}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Área</p>
            <p className="font-serif text-xl mt-1">{project.area}</p>
          </div>
        </aside>
        <div className="md:col-span-8">
          <p className="text-lg leading-relaxed text-foreground/80 whitespace-pre-line">{project.description}</p>
        </div>
      </section>

      <section className="container-editorial pb-24">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="group relative overflow-hidden bg-muted aspect-[3/2] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Abrir imagem ${i + 1} em tamanho original`}
            >
              <img
                src={src}
                alt={`${project.title} — imagem ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/90 hover:text-white p-2"
            aria-label="Fechar"
          >
            <X className="size-7" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="size-8 md:size-10" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="size-8 md:size-10" />
              </button>
            </>
          )}

          <img
            src={gallery[lightboxIndex]}
            alt={`${project.title} — imagem ${lightboxIndex + 1}`}
            className="max-h-[92vh] max-w-[94vw] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-xs tracking-[0.2em]">
              {lightboxIndex + 1} / {gallery.length}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectDetail;
