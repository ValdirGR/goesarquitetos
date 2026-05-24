import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/supabase";
import { compressImage, formatBytes } from "@/lib/image";

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
  /** Tamanho-alvo da imagem final em KB. Default 400. */
  targetMaxKB?: number;
  /** Teto absoluto do arquivo de entrada em MB (antes da compressão). Default 25. */
  maxInputMB?: number;
  /** @deprecated Substituído por `targetMaxKB`. Mantido para compatibilidade. */
  maxSizeMB?: number;
  /** Esconde o campo de URL e mostra só o uploader */
  hideUrlInput?: boolean;
  /** Pasta no bucket onde a imagem será salva. */
  folder?: string;
  className?: string;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

export const ImageUploader = ({
  value,
  onChange,
  label,
  recommendedWidth,
  recommendedHeight,
  previewAspect = "4/3",
  targetMaxKB = 400,
  maxInputMB = 25,
  hideUrlInput = false,
  folder = "misc",
  className,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const aspectRatio = recommendedWidth && recommendedHeight
    ? `${recommendedWidth}/${recommendedHeight}`
    : previewAspect;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > maxInputMB * 1024 * 1024) {
      toast.error(
        `Arquivo muito grande (${formatBytes(file.size)}). Limite de entrada: ${maxInputMB} MB.`,
      );
      return;
    }
    setLoading(true);
    try {
      const cropTo =
        recommendedWidth && recommendedHeight
          ? { width: recommendedWidth, height: recommendedHeight }
          : undefined;
      const result = await compressImage(file, { targetMaxKB, cropTo });
      const url = await uploadImage(result.blob, folder, "jpg");
      onChange(url);
      if (!result.withinTarget) {
        toast.warning(
          `Imagem enviada com ${formatBytes(result.size)} (alvo de ${targetMaxKB} KB não atingido).`,
        );
      } else if (file.size > result.size) {
        toast.success(
          `Imagem otimizada: ${formatBytes(file.size)} → ${formatBytes(result.size)}.`,
        );
      } else {
        toast.success("Imagem enviada.");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast.error("Falha ao processar a imagem.");
    } finally {
      setLoading(false);
    }
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
              {loading ? "Otimizando..." : value ? "Substituir imagem" : "Enviar do computador"}
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
            <li>Compressão automática até <span className="text-foreground/80">{targetMaxKB} KB</span></li>
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
