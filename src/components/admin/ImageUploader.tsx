import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadImage, dataUrlToBlob } from "@/lib/supabase";

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

  const resizeToRecommended = (dataUrl: string, mime: string): Promise<string> =>
    new Promise((resolve) => {
      if (!recommendedWidth || !recommendedHeight) return resolve(dataUrl);
      const img = new Image();
      img.onload = () => {
        const targetW = recommendedWidth;
        const targetH = recommendedHeight;
        const targetRatio = targetW / targetH;
        const srcRatio = img.width / img.height;

        // Cover crop: pega a maior área central que respeita a proporção alvo
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (srcRatio > targetRatio) {
          sw = Math.round(img.height * targetRatio);
          sx = Math.round((img.width - sw) / 2);
        } else if (srcRatio < targetRatio) {
          sh = Math.round(img.width / targetRatio);
          sy = Math.round((img.height - sh) / 2);
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(dataUrl);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);

        const outMime = mime === "image/png" ? "image/png" : "image/jpeg";
        const quality = outMime === "image/jpeg" ? 0.88 : undefined;
        try {
          resolve(canvas.toDataURL(outMime, quality));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });

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
    reader.onload = async () => {
      try {
        const dataUrl = String(reader.result);
        let finalDataUrl = dataUrl;
        let resized = false;
        if (recommendedWidth && recommendedHeight) {
          finalDataUrl = await resizeToRecommended(dataUrl, file.type);
          resized = finalDataUrl !== dataUrl;
        }
        const blob = dataUrlToBlob(finalDataUrl);
        const url = await uploadImage(blob);
        if (resized) {
          toast.success(`Imagem ajustada para ${recommendedWidth}×${recommendedHeight} px e enviada.`);
        } else {
          toast.success("Imagem enviada.");
        }
        onChange(url);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        toast.error("Falha ao enviar a imagem.");
      } finally {
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
            value={value}
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
