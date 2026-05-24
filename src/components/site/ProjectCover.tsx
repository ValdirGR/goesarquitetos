import { useState } from "react";
import { cn } from "@/lib/utils";

type Orientation = "portrait" | "landscape" | "square";
type AspectMode = "auto" | "landscape" | "portrait" | "square";

interface ProjectCoverProps {
  src: string;
  alt: string;
  /**
   * Define o aspect ratio da capa.
   * - "auto" (padrão): detecta a orientação real da imagem.
   * - "landscape" | "portrait" | "square": força o formato para padronizar a grade.
   */
  aspect?: AspectMode;
}

const ASPECT_CLASS: Record<Exclude<AspectMode, "auto">, string> = {
  landscape: "aspect-[3/2]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
};

/**
 * Capa de projeto. Quando `aspect="auto"` detecta a orientação da imagem
 * para evitar cortes; caso contrário usa o formato informado.
 */
export const ProjectCover = ({ src, alt, aspect = "auto" }: ProjectCoverProps) => {
  // Default em retrato preserva o ritmo editorial enquanto a imagem carrega.
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  const aspectClass =
    aspect === "auto" ? ASPECT_CLASS[orientation] : ASPECT_CLASS[aspect];

  return (
    <div className={cn("overflow-hidden bg-muted relative", aspectClass)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={(e) => {
          if (aspect !== "auto") return;
          const img = e.currentTarget;
          const ratio = img.naturalWidth / img.naturalHeight;
          if (ratio > 1.15) setOrientation("landscape");
          else if (ratio < 0.9) setOrientation("portrait");
          else setOrientation("square");
        }}
        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500" />
    </div>
  );
};

export default ProjectCover;
