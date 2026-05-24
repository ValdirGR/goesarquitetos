import { cn } from "@/lib/utils";

interface ProjectCoverProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Capa de projeto.
 *
 * Mantém todas as capas na mesma proporção (3:2 — 1200×800) para uniformizar
 * o grid. A imagem usa `object-cover` para preencher o card sem distorção.
 */
export const ProjectCover = ({ src, alt, className }: ProjectCoverProps) => {
  return (
    <div className={cn("relative overflow-hidden bg-muted aspect-[3/2]", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500" />
    </div>
  );
};

export default ProjectCover;
