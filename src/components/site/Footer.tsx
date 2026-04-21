import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";
import { useContent } from "@/store/useStudioStore";

export const Footer = () => {
  const { content } = useContent();
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container-editorial py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl">góes<span className="text-primary-glow"> arquitetos</span></div>
          <p className="mt-4 text-background/70 max-w-md text-sm leading-relaxed">
            Arquitetura autoral para residências e espaços comerciais. Projetos sob medida, do conceito à obra.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-4">Navegar</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="/" className="hover:text-background">Home</Link></li>
            <li><Link to="/quem-somos" className="hover:text-background">Quem Somos</Link></li>
            <li><Link to="/projetos" className="hover:text-background">Projetos</Link></li>
            <li><Link to="/contato" className="hover:text-background">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-4">Contato</h4>
          <address className="not-italic text-sm text-background/70 space-y-2">
            <p>{content.contactAddress}</p>
            <p>{content.contactPhone}</p>
            <a href={`mailto:${content.contactEmail}`} className="block hover:text-background">{content.contactEmail}</a>
          </address>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="text-background/70 hover:text-background"><Instagram className="size-5" /></a>
            <a href="#" aria-label="LinkedIn" className="text-background/70 hover:text-background"><Linkedin className="size-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container-editorial py-6 flex flex-col md:flex-row justify-between text-xs text-background/50">
          <p>© {new Date().getFullYear()} Góes Arquitetos Associados Ltda. Todos os direitos reservados.</p>
          <Link to="/login" className="hover:text-background/80">Acesso restrito</Link>
        </div>
      </div>
    </footer>
  );
};
