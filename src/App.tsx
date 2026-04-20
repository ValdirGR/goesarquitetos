import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteLayout } from "@/components/site/SiteLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminContent from "./pages/admin/AdminContent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/quem-somos" element={<About />} />
            <Route path="/projetos" element={<Projects />} />
            <Route path="/projetos/:id" element={<ProjectDetail />} />
            <Route path="/contato" element={<Contact />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/projetos" replace />} />
            <Route path="projetos" element={<AdminProjects />} />
            <Route path="conteudo" element={<AdminContent />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
