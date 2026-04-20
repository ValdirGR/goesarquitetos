import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useContent } from "@/store/useStudioStore";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Conte-nos um pouco mais").max(1000),
});

const Contact = () => {
  const { content } = useContent();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Mensagem enviada", { description: "Retornaremos em breve." });
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 700);
  };

  return (
    <>
      <section className="container-editorial pt-32 md:pt-40 pb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Contato</p>
        <h1 className="font-serif text-4xl md:text-6xl max-w-3xl leading-[1.1]">
          Vamos desenhar algo juntos.
        </h1>
      </section>

      <section className="container-editorial pb-24 grid md:grid-cols-12 gap-12">
        <aside className="md:col-span-4 space-y-8">
          <div className="flex gap-4">
            <MapPin className="size-5 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Endereço</p>
              <p className="mt-1">{content.contactAddress}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Phone className="size-5 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Telefone</p>
              <p className="mt-1">{content.contactPhone}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Mail className="size-5 text-primary shrink-0 mt-1" />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</p>
              <a href={`mailto:${content.contactEmail}`} className="mt-1 block hover:text-primary">{content.contactEmail}</a>
            </div>
          </div>
          <div className="aspect-square bg-muted overflow-hidden mt-6">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80" alt="Localização do estúdio" loading="lazy" className="h-full w-full object-cover grayscale" />
          </div>
        </aside>

        <form onSubmit={onSubmit} noValidate className="md:col-span-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Telefone (opcional)</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2" />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
          </div>
          <Button type="submit" size="lg" disabled={loading} className="uppercase tracking-[0.2em]">
            {loading ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>
      </section>
    </>
  );
};

export default Contact;
