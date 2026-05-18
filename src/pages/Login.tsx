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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        toast.success("Bem-vindo de volta");
        navigate("/admin");
      } else {
        toast.error("Credenciais inválidas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block bg-foreground relative">
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-background">
          <Link to="/" className="font-serif text-2xl">góes<span className="text-primary-glow"> arquitetos</span></Link>
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
          <Button type="submit" className="w-full uppercase tracking-[0.2em]" size="lg" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary">← Voltar ao site</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
