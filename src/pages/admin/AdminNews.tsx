import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useNews } from "@/store/useStudioStore";
import type { NewsPost } from "@/data/news";

const empty: NewsPost = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  cover: "",
  category: "",
  author: "",
  date: new Date().toISOString().slice(0, 10),
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
};

const AdminNews = () => {
  const { news, upsert, remove } = useNews();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsPost>(empty);
  const isNew = !news.find((n) => n.id === editing.id);

  const openNew = () => {
    setEditing({ ...empty, date: new Date().toISOString().slice(0, 10) });
    setOpen(true);
  };
  const openEdit = (n: NewsPost) => {
    setEditing({ ...n });
    setOpen(true);
  };

  const save = () => {
    if (!editing.title.trim()) {
      toast.error("Título obrigatório");
      return;
    }
    const id = editing.id || slugify(editing.title);
    upsert({ ...editing, id });
    toast.success(isNew ? "Notícia criada" : "Notícia atualizada");
    setOpen(false);
  };

  const onDelete = (id: string) => {
    if (confirm("Excluir esta notícia?")) {
      remove(id);
      toast.success("Notícia excluída");
    }
  };

  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl">Notícias</h1>
          <p className="text-sm text-muted-foreground mt-1">{news.length} matérias publicadas</p>
        </div>
        <Button onClick={openNew}><Plus className="size-4" /> Nova notícia</Button>
      </div>

      <div className="border border-border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((n) => (
              <TableRow key={n.id}>
                <TableCell>
                  {n.cover && <img src={n.cover} alt="" className="size-12 object-cover rounded" loading="lazy" />}
                </TableCell>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell className="text-muted-foreground">{n.category}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(n.date)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(n)}><Pencil className="size-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(n.id)}><Trash2 className="size-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{isNew ? "Nova notícia" : "Editar notícia"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Título</Label>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mt-2" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Categoria</Label>
                <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="ex: Urbanismo" className="mt-2" />
              </div>
              <div>
                <Label>Autor</Label>
                <Input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="mt-2" />
              </div>
              <div>
                <Label>Data</Label>
                <Input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="mt-2" />
              </div>
            </div>
            <ImageUploader
              label="Imagem de capa"
              value={editing.cover}
              onChange={(url) => setEditing({ ...editing, cover: url })}
              recommendedWidth={1600}
              recommendedHeight={1200}
            />
            <div>
              <Label>Resumo</Label>
              <Textarea rows={3} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className="mt-2" />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Textarea rows={10} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Use linhas em branco para separar parágrafos.</p>
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

export default AdminNews;
