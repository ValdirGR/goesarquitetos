import { useState } from "react";
import { Pencil, Plus, Trash2, X, Upload } from "lucide-react";
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
  const [galleryText, setGalleryText] = useState("");
  const isNew = !projects.find((p) => p.id === editing.id);

  const openNew = () => {
    setEditing({ ...empty });
    setGalleryText("");
    setOpen(true);
  };
  const openEdit = (p: Project) => {
    setEditing({ ...p });
    setGalleryText(p.gallery.join("\n"));
    setOpen(true);
  };

  const save = () => {
    if (!editing.title.trim()) {
      toast.error("Título obrigatório");
      return;
    }
    const id = editing.id || slugify(editing.title);
    const gallery = galleryText.split("\n").map((s) => s.trim()).filter(Boolean);
    upsert({ ...editing, id, gallery, cover: editing.cover || gallery[0] || "" });
    toast.success(isNew ? "Projeto criado" : "Projeto atualizado");
    setOpen(false);
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
              recommendedWidth={1600}
              recommendedHeight={2000}
              maxSizeMB={3}
            />
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Galeria de imagens</Label>
                <Button type="button" variant="outline" size="sm" onClick={addGalleryItem}>
                  <Plus className="size-3.5 mr-1" /> Adicionar imagem
                </Button>
              </div>
              {editing.gallery.length === 0 && (
                <p className="text-xs text-muted-foreground border border-dashed border-border rounded-md p-4 text-center">
                  Nenhuma imagem na galeria. Clique em "Adicionar imagem" para enviar.
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
                      maxSizeMB={3}
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
