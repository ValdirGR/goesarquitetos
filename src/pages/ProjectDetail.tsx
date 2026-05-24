import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProjects } from "@/store/useStudioStore";

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === id);

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
          {project.gallery.map((src, i) => (
            <div key={i} className={`overflow-hidden bg-muted ${i % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/5]"}`}>
              <img src={src} alt={`${project.title} — imagem ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;
