/**
 * Utilitários de processamento client-side de imagens.
 *
 * Estratégia:
 * - Pipeline rodando inteiramente no <canvas>; sem dependências externas.
 * - Compressão progressiva: varre qualidades JPEG e, se necessário, reduz a
 *   largura máxima até o blob caber no alvo (default 400 KB).
 * - Sempre devolve um Blob `image/jpeg` (exceto quando o original é PNG sem
 *   transparência relevante e ainda assim cabe — ver `preferJpeg`).
 */

export interface CompressOptions {
  /** Tamanho-alvo máximo em KB. Default: 400. */
  targetMaxKB?: number;
  /** Qualidades JPEG a tentar (descendente). */
  qualities?: number[];
  /** Larguras máximas (px) a tentar (descendente). */
  maxWidths?: number[];
  /** Força um cover-crop centralizado nessas dimensões antes de comprimir. */
  cropTo?: { width: number; height: number };
}

export interface CompressResult {
  blob: Blob;
  width: number;
  height: number;
  /** Tamanho final em bytes. */
  size: number;
  /** Qualidade JPEG usada na codificação final. */
  quality: number;
  /** `true` se ficou abaixo de `targetMaxKB`. */
  withinTarget: boolean;
}

const DEFAULT_QUALITIES = [0.85, 0.75, 0.65, 0.55, 0.45];
const DEFAULT_MAX_WIDTHS = [2400, 1920, 1600, 1280, 1024];

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao decodificar a imagem."));
    img.src = src;
  });

const fileToDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    r.readAsDataURL(file);
  });

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Falha ao codificar JPEG."))),
      "image/jpeg",
      quality,
    );
  });

/**
 * Faz cover-crop centralizado da imagem em um canvas no tamanho alvo,
 * preservando proporção.
 */
function drawCover(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
): HTMLCanvasElement {
  const targetRatio = targetW / targetH;
  const srcRatio = img.width / img.height;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
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
  if (!ctx) throw new Error("Canvas 2D indisponível.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
  return canvas;
}

/**
 * Redimensiona a imagem mantendo proporção, com largura máxima `maxW`.
 * Se a imagem original já for menor, devolve canvas em tamanho nativo.
 */
function drawScaled(img: HTMLImageElement, maxW: number): HTMLCanvasElement {
  const ratio = img.width > maxW ? maxW / img.width : 1;
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponível.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

/**
 * Comprime uma imagem (File/Blob) até caber em `targetMaxKB` (default 400 KB),
 * varrendo qualidades JPEG e, se necessário, reduzindo a largura máxima.
 *
 * - Quando `cropTo` é informado, aplica cover-crop nesse tamanho exato e usa
 *   apenas o canvas resultante (sem varrer `maxWidths`).
 * - Caso nenhum passo caiba no alvo, devolve o menor resultado obtido com
 *   `withinTarget=false` (o chamador decide se avisa o usuário).
 */
export async function compressImage(
  file: Blob,
  opts: CompressOptions = {},
): Promise<CompressResult> {
  const targetMaxKB = opts.targetMaxKB ?? 400;
  const targetMaxBytes = targetMaxKB * 1024;
  const qualities = opts.qualities ?? DEFAULT_QUALITIES;
  const maxWidths = opts.maxWidths ?? DEFAULT_MAX_WIDTHS;

  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  // Modo "crop fixo": tamanho-alvo definido pelo chamador (ex.: capa 1200×800).
  if (opts.cropTo) {
    const canvas = drawCover(img, opts.cropTo.width, opts.cropTo.height);
    let best: CompressResult | null = null;
    for (const q of qualities) {
      const blob = await canvasToBlob(canvas, q);
      const result: CompressResult = {
        blob,
        width: canvas.width,
        height: canvas.height,
        size: blob.size,
        quality: q,
        withinTarget: blob.size <= targetMaxBytes,
      };
      if (result.withinTarget) return result;
      if (!best || blob.size < best.size) best = result;
    }
    return best!;
  }

  // Modo livre: tenta cada largura × qualidade.
  let best: CompressResult | null = null;
  for (const maxW of maxWidths) {
    const canvas = drawScaled(img, maxW);
    for (const q of qualities) {
      const blob = await canvasToBlob(canvas, q);
      const result: CompressResult = {
        blob,
        width: canvas.width,
        height: canvas.height,
        size: blob.size,
        quality: q,
        withinTarget: blob.size <= targetMaxBytes,
      };
      if (result.withinTarget) return result;
      if (!best || blob.size < best.size) best = result;
    }
  }
  return best!;
}

export const formatBytes = (b: number): string => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};
