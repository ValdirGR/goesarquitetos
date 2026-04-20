import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
            <div>
              <Label>URL da capa</Label>
              <Input value={editing.cover} onChange={(e) => setEditing({ ...editing, cover: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label>Galeria (uma URL por linha)</Label>
              <Textarea rows={5} value={galleryText} onChange={(e) => setGalleryText(e.target.value)} className="mt-2 font-mono text-xs" />
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
