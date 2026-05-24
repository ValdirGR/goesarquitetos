import { useRef, useState } from "react";
import { Pencil, Plus, Trash2, X, Upload, Images } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useProjects } from "@/store/useStudioStore";
import { uploadImage } from "@/lib/supabase";
import { compressImage } from "@/lib/image";
import type { Project, ProjectCategory } from "@/data/projects";

const empty: Project = {
  id: "",
  title: "",
  category: "residencial",
  year: new Date().getFullYear(),
  location: "",
  area: "",
  description: "",
  cover: "",
  gallery: [],
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminProjects = () => {
  const { projects, upsert, remove } = useProjects();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project>(empty);
  const [bulkLoading, setBulkLoading] = useState(false);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const isNew = !projects.find((p) => p.id === editing.id);
  const MAX_BULK_INPUT_MB = 25;
  const TARGET_KB = 400;

  const handleBulkFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setBulkLoading(true);
    const maxInputBytes = MAX_BULK_INPUT_MB * 1024 * 1024;
    const accepted: File[] = [];
    let skippedType = 0;
    let skippedSize = 0;
    for (const f of arr) {
      if (!f.type.startsWith("image/")) { skippedType++; continue; }
      if (f.size > maxInputBytes) { skippedSize++; continue; }
      accepted.push(f);
    }
    try {
      const urls: string[] = [];
      let overTarget = 0;
      for (const f of accepted) {
        const result = await compressImage(f, { targetMaxKB: TARGET_KB });
        if (!result.withinTarget) overTarget++;
        urls.push(await uploadImage(result.blob, "projects", "jpg"));
      }
      setEditing((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
      if (urls.length > 0) toast.success(`${urls.length} imagem(ns) adicionada(s) à galeria`);
      if (overTarget > 0) toast.warning(`${overTarget} imagem(ns) ficaram acima de ${TARGET_KB} KB após otimização.`);
      if (skippedType > 0) toast.warning(`${skippedType} arquivo(s) ignorado(s) (não são imagens)`);
      if (skippedSize > 0) toast.warning(`${skippedSize} arquivo(s) ignorado(s) (acima de ${MAX_BULK_INPUT_MB} MB)`);
      if (urls.length === 0 && skippedType === 0 && skippedSize === 0) toast.error("Nenhum arquivo válido.");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast.error("Falha ao enviar uma ou mais imagens.");
    } finally {
      setBulkLoading(false);
    }
  };

  const onBulkDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleBulkFiles(e.dataTransfer.files);
  };

  const openNew = () => {
    setEditing({ ...empty, gallery: [] });
    setOpen(true);
  };
  const openEdit = (p: Project) => {
    setEditing({ ...p, gallery: [...p.gallery] });
    setOpen(true);
  };

  const save = () => {
    if (!editing.title.trim()) {
      toast.error("Título obrigatório");
      return;
    }
    const id = editing.id || slugify(editing.title);
    const gallery = editing.gallery.filter(Boolean);
    upsert({ ...editing, id, gallery, cover: editing.cover || gallery[0] || "" });
    toast.success(isNew ? "Projeto criado" : "Projeto atualizado");
    setOpen(false);
  };

  const setGalleryItem = (i: number, url: string) => {
    const next = [...editing.gallery];
    next[i] = url;
    setEditing({ ...editing, gallery: next });
  };
  const removeGalleryItem = (i: number) => {
    setEditing({ ...editing, gallery: editing.gallery.filter((_, idx) => idx !== i) });
  };
  const addGalleryItem = () => {
    setEditing({ ...editing, gallery: [...editing.gallery, ""] });
  };

  const onDelete = (id: string) => {
    if (confirm("Excluir este projeto?")) {
      remove(id);
      toast.success("Projeto excluído");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projetos cadastrados</p>
        </div>
        <Button onClick={openNew}><Plus className="size-4" /> Novo projeto</Button>
      </div>

      <div className="border border-border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Local</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.cover && <img src={p.cover} alt="" className="size-12 object-cover rounded" loading="lazy" />}
                </TableCell>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="capitalize">{p.category}</TableCell>
                <TableCell>{p.year}</TableCell>
                <TableCell className="text-muted-foreground">{p.location}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)}><Trash2 className="size-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{isNew ? "Novo projeto" : "Editar projeto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Título</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mt-2" />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v as ProjectCategory })}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residencial">Residencial</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ano</Label>
                <Input type="number" value={editing.year} onChange={(e) => setEditing({ ...editing, year: +e.target.value })} className="mt-2" />
              </div>
              <div>
                <Label>Área</Label>
                <Input value={editing.area} onChange={(e) => setEditing({ ...editing, area: e.target.value })} placeholder="ex: 320 m²" className="mt-2" />
              </div>
            </div>
            <div>
              <Label>Local</Label>
              <Input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="mt-2" />
            </div>
            <ImageUploader
              label="Imagem de capa"
              value={editing.cover}
              onChange={(url) => setEditing({ ...editing, cover: url })}
              recommendedWidth={1200}
              recommendedHeight={800}
              cropToRecommended={false}
              folder="projects"
            />
            <div>
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <Label>Galeria de imagens</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={bulkLoading}
                    onClick={() => bulkInputRef.current?.click()}
                  >
                    <Images className="size-3.5 mr-1" />
                    {bulkLoading ? "Carregando..." : "Upload múltiplo"}
                  </Button>
                  <input
                    ref={bulkInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleBulkFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addGalleryItem}>
                    <Plus className="size-3.5 mr-1" /> Adicionar imagem
                  </Button>
                </div>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onBulkDrop}
                className="mb-4 border border-dashed border-border rounded-md p-4 text-center text-xs text-muted-foreground bg-muted/30"
              >
                Arraste várias imagens aqui para adicionar de uma vez (otimizadas até {TARGET_KB} KB cada).
              </div>

              {editing.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {editing.gallery.map((url, i) =>
                    url ? (
                      <div key={`thumb-${i}`} className="relative group aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
                        <img src={url} alt={`Galeria ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(i)}
                          aria-label="Remover imagem"
                          className="absolute top-1 right-1 size-6 inline-flex items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-background/80 text-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {editing.gallery.length === 0 && (
                <p className="text-xs text-muted-foreground border border-dashed border-border rounded-md p-4 text-center">
                  Nenhuma imagem na galeria. Use "Upload múltiplo" ou "Adicionar imagem".
                </p>
              )}
              <div className="space-y-4">
                {editing.gallery.map((url, i) => (
                  <div key={i} className="relative border border-border rounded-md p-3 bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Imagem {String(i + 1).padStart(2, "0")}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGalleryItem(i)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <ImageUploader
                      value={url}
                      onChange={(u) => setGalleryItem(i, u)}
                      recommendedWidth={1600}
                      recommendedHeight={1200}
                      folder="projects"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea rows={5} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProjects;
