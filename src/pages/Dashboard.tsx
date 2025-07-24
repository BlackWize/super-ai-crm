import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Target,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface DashboardStats {
  leadsNovosHoje: number;
  totalLeads: number;
  tarefasPendentes: number;
  mensagensPendentes: number;
  taxaConversao: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    leadsNovosHoje: 0,
    totalLeads: 0,
    tarefasPendentes: 0,
    mensagensPendentes: 0,
    taxaConversao: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Leads novos hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: leadsHoje } = await supabase
        .from('clientes')
        .select('id')
        .gte('data_cadastro', today);

      // Total de leads
      const { data: totalLeads } = await supabase
        .from('clientes')
        .select('id');

      // Tarefas pendentes
      const { data: tarefasPendentes } = await supabase
        .from('tarefas')
        .select('id')
        .eq('status', 'pendente');

      // Mensagens pendentes (interações sem resposta)
      const { data: mensagensPendentes } = await supabase
        .from('interacoes')
        .select('id')
        .is('resposta', null);

      // Taxa de conversão semanal (leads fechados na semana)
      const semanaAtras = new Date();
      semanaAtras.setDate(semanaAtras.getDate() - 7);
      
      const { data: leadsFechados } = await supabase
        .from('clientes')
        .select('id')
        .eq('status', 'fechado')
        .gte('updated_at', semanaAtras.toISOString());

      const { data: leadsSemana } = await supabase
        .from('clientes')
        .select('id')
        .gte('data_cadastro', semanaAtras.toISOString());

      const taxaConversao = leadsSemana?.length ? 
        Math.round((leadsFechados?.length || 0) / leadsSemana.length * 100) : 0;

      setStats({
        leadsNovosHoje: leadsHoje?.length || 0,
        totalLeads: totalLeads?.length || 0,
        tarefasPendentes: tarefasPendentes?.length || 0,
        mensagensPendentes: mensagensPendentes?.length || 0,
        taxaConversao
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const atalhos = [
    {
      title: "Cadastrar Cliente",
      description: "Adicionar novo lead ao sistema",
      icon: UserPlus,
      action: () => navigate('/leads?action=new'),
      color: "bg-green-500"
    },
    {
      title: "Ver Mensagens Pendentes",
      description: `${stats.mensagensPendentes} mensagens aguardando resposta`,
      icon: MessageSquare,
      action: () => navigate('/chat'),
      color: "bg-blue-500"
    },
    {
      title: "Nova Campanha",
      description: "Criar campanha de marketing",
      icon: Target,
      action: () => navigate('/campanhas?action=new'),
      color: "bg-purple-500"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao Super CRM! Aqui está um resumo do seu negócio.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date().toLocaleDateString('pt-BR')}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Novos Hoje</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.leadsNovosHoje}</div>
            <p className="text-xs text-muted-foreground">
              Novos leads cadastrados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Leads cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.taxaConversao}%</div>
            <p className="text-xs text-muted-foreground">
              Conversão nos últimos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.tarefasPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas aguardando execução
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atalhos Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle>Atalhos Rápidos</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {atalhos.map((atalho, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={atalho.action}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-md ${atalho.color}`}>
                    <atalho.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-medium">{atalho.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  {atalho.description}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tarefas do Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Tarefas do Dia</CardTitle>
          <CardDescription>
            Suas tarefas programadas para hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Nenhuma tarefa programada para hoje
            </p>
            <Button className="mt-2" onClick={() => navigate('/tarefas')}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Tarefa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;