import { useState } from "react";
import { cn } from "@/lib/utils";

type Orientation = "portrait" | "landscape" | "square";

interface ProjectCoverProps {
  src: string;
  alt: string;
}

/**
 * Capa de projeto adaptativa: detecta a orientação real da imagem ao carregar
 * e aplica o melhor aspect ratio para evitar cortes excessivos.
 * - Retrato  -> aspect-[4/5]
 * - Paisagem -> aspect-[4/3]
 * - Quadrado -> aspect-square
 */
export const ProjectCover = ({ src, alt }: ProjectCoverProps) => {
  // Default em retrato preserva o ritmo editorial enquanto a imagem carrega.
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  const aspectClass =
    orientation === "landscape"
      ? "aspect-[4/3]"
      : orientation === "square"
        ? "aspect-square"
        : "aspect-[4/5]";

  return (
    <div className={cn("overflow-hidden bg-muted relative", aspectClass)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={(e) => {
          const img = e.currentTarget;
          const ratio = img.naturalWidth / img.naturalHeight;
          if (ratio > 1.15) setOrientation("landscape");
          else if (ratio < 0.9) setOrientation("portrait");
          else setOrientation("square");
        }}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500" />
    </div>
  );
};

export default ProjectCover;
