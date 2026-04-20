import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/store/useStudioStore";
import type { SiteContent } from "@/data/projects";

const AdminContent = () => {
  const { content, update } = useContent();
  const [form, setForm] = useState<SiteContent>(content);

  useEffect(() => { setForm(content); }, [content]);

  const save = () => {
    update(form);
    toast.success("Conteúdo atualizado");
  };

  const Field = ({ k, label, area }: { k: keyof SiteContent; label: string; area?: boolean }) => (
    <div>
      <Label>{label}</Label>
      {area ? (
        <Textarea rows={4} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-2" />
      ) : (
        <Input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-2" />
      )}
    </div>
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl">Conteúdo do site</h1>
        <p className="text-sm text-muted-foreground mt-1">Edite os textos exibidos nas páginas públicas.</p>
      </div>

      <div className="space-y-10 max-w-3xl">
        <section className="space-y-4 p-6 border border-border rounded-md bg-card">
          <h2 className="font-serif text-xl">Hero da Home</h2>
          <Field k="heroTitle" label="Título" />
          <Field k="heroSubtitle" label="Subtítulo" area />
          <Field k="heroCta" label="Texto do botão" />
        </section>

        <section className="space-y-4 p-6 border border-border rounded-md bg-card">
          <h2 className="font-serif text-xl">Filosofia (Home)</h2>
          <Field k="philosophy" label="Texto" area />
        </section>

        <section className="space-y-4 p-6 border border-border rounded-md bg-card">
          <h2 className="font-serif text-xl">Manifesto (Quem Somos)</h2>
          <Field k="manifesto" label="Texto" area />
        </section>

        <section className="space-y-4 p-6 border border-border rounded-md bg-card">
          <h2 className="font-serif text-xl">Contato</h2>
          <Field k="contactAddress" label="Endereço" />
          <Field k="contactPhone" label="Telefone" />
          <Field k="contactEmail" label="E-mail" />
        </section>

        <Button onClick={save} size="lg">Salvar alterações</Button>
      </div>
    </>
  );
};

export default AdminContent;
