import { cn } from "@/lib/utils";

interface ProjectCoverProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Capa de projeto.
 *
 * A imagem ocupa 100% da largura do card e a altura é definida pela
 * proporção original do arquivo — sem corte e sem letterbox lateral.
 * O container existe apenas para o overlay de hover.
 */
export const ProjectCover = ({ src, alt, className }: ProjectCoverProps) => {
  return (
    <div className={cn("overflow-hidden bg-muted relative", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block w-full h-auto transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500" />
    </div>
  );
};

export default ProjectCover;
