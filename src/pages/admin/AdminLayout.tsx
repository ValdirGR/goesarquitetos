import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FileText, FolderKanban, LogOut, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useStudioStore";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/admin/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { to: "/admin/conteudo", label: "Conteúdo do Site", icon: FileText },
];

const AdminLayout = () => {
  const { authed, logout } = useAuth();
  const navigate = useNavigate();
  if (!authed) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <p className="font-serif text-xl">góes<span className="text-sidebar-primary"> arquitetos</span></p>
          <p className="text-xs text-sidebar-foreground/60 mt-1 uppercase tracking-wider">Painel admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )
              }
            >
              <i.icon className="size-4" />
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <LogOut className="size-4" /> Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-10 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
