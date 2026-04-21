import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/store/useStudioStore";
import type { SiteContent, ServiceItem } from "@/data/projects";

type StringKey = {
  [K in keyof SiteContent]: SiteContent[K] extends string ? K : never;
}[keyof SiteContent];

const AdminContent = () => {
  const { content, update } = useContent();
  const [form, setForm] = useState<SiteContent>(content);

  useEffect(() => { setForm(content); }, [content]);

  const save = () => {
    update(form);
    toast.success("Conteúdo atualizado");
  };

  const setText = (k: StringKey, v: string) => setForm({ ...form, [k]: v });

  const updateService = (i: number, patch: Partial<ServiceItem>) => {
    const services = form.services.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    setForm({ ...form, services });
  };
  const addService = () =>
    setForm({ ...form, services: [...form.services, { title: "Nova área", description: "" }] });
  const removeService = (i: number) =>
    setForm({ ...form, services: form.services.filter((_, idx) => idx !== i) });

  const Field = ({ k, label, area }: { k: StringKey; label: string; area?: boolean }) => (
    <div>
      <Label>{label}</Label>
      {area ? (
        <Textarea rows={4} value={form[k]} onChange={(e) => setText(k, e.target.value)} className="mt-2" />
      ) : (
        <Input value={form[k]} onChange={(e) => setText(k, e.target.value)} className="mt-2" />
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
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Áreas de atuação (Home)</h2>
            <Button type="button" variant="outline" size="sm" onClick={addService}>
              <Plus className="size-4 mr-1" /> Adicionar
            </Button>
          </div>
          <Field k="servicesEyebrow" label="Sobretítulo" />
          <Field k="servicesTitle" label="Título" />
          <Field k="servicesIntro" label="Texto introdutório" area />

          <div className="space-y-4 pt-2">
            {form.services.map((s, i) => (
              <div key={i} className="border border-border rounded-md p-4 bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Tópico {String(i + 1).padStart(2, "0")}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(i)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div>
                  <Label>Título</Label>
                  <Input
                    value={s.title}
                    onChange={(e) => updateService(i, { title: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    rows={3}
                    value={s.description}
                    onChange={(e) => updateService(i, { description: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
            ))}
          </div>
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
