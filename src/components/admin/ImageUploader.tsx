import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Largura recomendada em px (apenas referência ao usuário) */
  recommendedWidth?: number;
  /** Altura recomendada em px (apenas referência ao usuário) */
  recommendedHeight?: number;
  /** Proporção visual da pré-visualização (CSS aspect-ratio). Ex: "3/4", "16/9". */
  previewAspect?: string;
  /** Tamanho máximo do arquivo em MB (default 3) */
  maxSizeMB?: number;
  /** Esconde o campo de URL e mostra só o uploader */
  hideUrlInput?: boolean;
  className?: string;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

const formatBytes = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

export const ImageUploader = ({
  value,
  onChange,
  label,
  recommendedWidth,
  recommendedHeight,
  previewAspect = "4/3",
  maxSizeMB = 3,
  hideUrlInput = false,
  className,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const aspectRatio = recommendedWidth && recommendedHeight
    ? `${recommendedWidth}/${recommendedHeight}`
    : previewAspect;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`Imagem maior que ${maxSizeMB} MB (${formatBytes(file.size)}). Otimize antes de enviar.`);
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      // Valida dimensões para alertar o usuário (não bloqueia)
      if (recommendedWidth && recommendedHeight) {
        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          const targetRatio = recommendedWidth / recommendedHeight;
          if (Math.abs(ratio - targetRatio) > 0.15) {
            toast.warning(
              `Proporção diferente da recomendada (${recommendedWidth}×${recommendedHeight}). A imagem será cortada para encaixar.`,
            );
          }
          onChange(dataUrl);
          setLoading(false);
        };
        img.onerror = () => {
          onChange(dataUrl);
          setLoading(false);
        };
        img.src = dataUrl;
      } else {
        onChange(dataUrl);
        setLoading(false);
      }
    };
    reader.onerror = () => {
      toast.error("Falha ao ler o arquivo.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const dimsLabel =
    recommendedWidth && recommendedHeight
      ? `${recommendedWidth} × ${recommendedHeight} px`
      : null;

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label>{label}</Label>}

      <div className="grid sm:grid-cols-[180px_1fr] gap-4 items-start">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="relative w-full overflow-hidden rounded-md border border-dashed border-border bg-muted/40"
          style={{ aspectRatio }}
        >
          {value ? (
            <>
              <img src={value} alt="Pré-visualização" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Remover imagem"
                className="absolute top-1.5 right-1.5 size-7 inline-flex items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background border border-border"
              >
                <X className="size-3.5" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground p-3 text-center">
              <ImageIcon className="size-6" strokeWidth={1.4} />
              <p className="text-[11px] leading-tight">Arraste aqui ou clique abaixo</p>
            </div>
          )}
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-3.5 mr-1.5" />
              {loading ? "Carregando..." : value ? "Substituir imagem" : "Enviar do computador"}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
          <ul className="space-y-0.5">
            {dimsLabel && <li>Dimensões recomendadas: <span className="text-foreground/80">{dimsLabel}</span></li>}
            <li>Formatos: JPG, PNG, WebP, AVIF</li>
            <li>Tamanho máximo: {maxSizeMB} MB</li>
          </ul>
        </div>
      </div>

      {!hideUrlInput && (
        <div>
          <Label className="text-xs text-muted-foreground font-normal">Ou cole uma URL</Label>
          <Input
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="mt-1.5"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
