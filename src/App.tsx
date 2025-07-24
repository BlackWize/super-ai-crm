import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Leads from "./pages/Leads";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/leads" element={<Layout><Leads /></Layout>} />
          <Route path="/tarefas" element={<Layout><div className="p-6">Tarefas em desenvolvimento</div></Layout>} />
          <Route path="/chat" element={<Layout><div className="p-6">Chat IA em desenvolvimento</div></Layout>} />
          <Route path="/campanhas" element={<Layout><div className="p-6">Campanhas em desenvolvimento</div></Layout>} />
          <Route path="/importar" element={<Layout><div className="p-6">Importar em desenvolvimento</div></Layout>} />
          <Route path="/integracoes" element={<Layout><div className="p-6">Integrações em desenvolvimento</div></Layout>} />
          <Route path="/configuracoes" element={<Layout><div className="p-6">Configurações em desenvolvimento</div></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
