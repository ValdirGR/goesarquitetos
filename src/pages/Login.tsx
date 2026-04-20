import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/useStudioStore";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@studio.com");
  const [password, setPassword] = useState("admin123");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Bem-vinda de volta");
      navigate("/admin");
    } else {
      toast.error("Credenciais inválidas");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block bg-foreground relative">
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-background">
          <Link to="/" className="font-serif text-2xl">estúdio<span className="text-primary-glow">musgo</span></Link>
          <div>
            <p className="font-serif text-3xl leading-snug max-w-md">"A arquitetura é a vontade da época traduzida em espaço."</p>
            <p className="mt-4 text-background/60 text-sm">— Mies van der Rohe</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Acesso restrito</p>
            <h1 className="font-serif text-3xl">Entrar no painel</h1>
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
          </div>
          <Button type="submit" className="w-full uppercase tracking-[0.2em]" size="lg">Entrar</Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo: qualquer e-mail válido + senha com 4+ caracteres.
          </p>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary">← Voltar ao site</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
