import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/quem-somos", label: "Quem Somos" },
  { to: "/projetos", label: "Projetos" },
  { to: "/contato", label: "Contato" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent ? "bg-transparent" : "bg-background/85 backdrop-blur-md border-b border-border",
      )}
    >
      <div className="container-editorial flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className={cn("font-serif text-xl md:text-2xl tracking-tight", transparent ? "text-background" : "text-foreground")}>
          góes<span className="text-primary"> arquitetos</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "text-sm tracking-wide uppercase transition-colors",
                transparent ? "text-background/90 hover:text-background" : "text-foreground/70 hover:text-primary",
                pathname === n.to && !transparent && "text-primary",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          aria-label="Abrir menu"
          className={cn("md:hidden", transparent ? "text-background" : "text-foreground")}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="container-editorial flex flex-col py-4">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="py-3 text-sm uppercase tracking-wide text-foreground/80">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
