import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Search, 
  Filter,
  MessageSquare,
  Calendar,
  History,
  Bot
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  status: 'novo' | 'em_andamento' | 'fechado' | 'perdido';
  tags: string[];
  origem: string;
  data_cadastro: string;
}

const statusColors = {
  novo: 'bg-blue-500',
  em_andamento: 'bg-yellow-500',
  fechado: 'bg-green-500',
  perdido: 'bg-red-500'
};

const statusLabels = {
  novo: 'Novo',
  em_andamento: 'Em Andamento',
  fechado: 'Fechado',
  perdido: 'Perdido'
};

const Leads = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewClienteOpen, setIsNewClienteOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [sugestaoIA, setSugestaoIA] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [newCliente, setNewCliente] = useState({
    nome: '',
    telefone: '',
    email: '',
    cpf: '',
    origem: ''
  });

  useEffect(() => {
    loadClientes();
    if (searchParams.get('action') === 'new') {
      setIsNewClienteOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    filterClientes();
  }, [clientes, searchTerm, statusFilter]);

  const loadClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterClientes = () => {
    let filtered = clientes;

    if (searchTerm) {
      filtered = filtered.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(cliente => cliente.status === statusFilter);
    }

    setFilteredClientes(filtered);
  };

  const handleCreateCliente = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([{
          ...newCliente,
          tags: ['quente'] // Tag padrão gerada pela IA
        }])
        .select()
        .single();

      if (error) throw error;

      setClientes([data, ...clientes]);
      setNewCliente({
        nome: '',
        telefone: '',
        email: '',
        cpf: '',
        origem: ''
      });
      setIsNewClienteOpen(false);

      toast({
        title: "Sucesso",
        description: "Cliente cadastrado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o cliente",
        variant: "destructive",
      });
    }
  };

  const gerarSugestaoIA = async (cliente: Cliente) => {
    // Simulação de IA - em produção, conectaria com OpenAI/DeepSeek
    const interacoes = Math.floor(Math.random() * 5) + 1;
    const dias = Math.floor(Math.random() * 30) + 1;
    
    const sugestoes = [
      `Envie uma mensagem de follow-up. Cliente tem ${interacoes} interações nos últimos ${dias} dias.`,
      `Agende uma ligação. Cliente demonstrou interesse em produtos similares.`,
      `Ofereça desconto especial. Cliente está há ${dias} dias sem contato.`,
      `Envie material informativo. Cliente fez várias perguntas sobre o serviço.`,
      `Marque reunião presencial. Cliente tem perfil para fechamento.`
    ];

    setSugestaoIA(sugestoes[Math.floor(Math.random() * sugestoes.length)]);
  };

  const handleEnviarMensagem = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    gerarSugestaoIA(cliente);
    setIsMessageDialogOpen(true);
  };

  const handleAgendarTarefa = (cliente: Cliente) => {
    // Implementar navegação para página de tarefas
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Agendamento de tarefas será implementado",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-lg">Carregando leads...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Leads</h1>
          <p className="text-muted-foreground">
            Gerencie seus leads e oportunidades de negócio
          </p>
        </div>
        
        <Dialog open={isNewClienteOpen} onOpenChange={setIsNewClienteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              <DialogDescription>
                Adicione um novo lead ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={newCliente.nome}
                  onChange={(e) => setNewCliente({...newCliente, nome: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={newCliente.telefone}
                  onChange={(e) => setNewCliente({...newCliente, telefone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCliente.email}
                  onChange={(e) => setNewCliente({...newCliente, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={newCliente.cpf}
                  onChange={(e) => setNewCliente({...newCliente, cpf: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="origem">Origem</Label>
                <Input
                  id="origem"
                  value={newCliente.origem}
                  onChange={(e) => setNewCliente({...newCliente, origem: e.target.value})}
                  placeholder="Ex: Site, Indicação, Facebook..."
                />
              </div>
              <Button onClick={handleCreateCliente} className="w-full">
                Cadastrar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({filteredClientes.length})</CardTitle>
          <CardDescription>
            Lista de todos os leads cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{cliente.email}</div>
                      <div className="text-muted-foreground">{cliente.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`${statusColors[cliente.status]} text-white`}
                    >
                      {statusLabels[cliente.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cliente.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{cliente.origem}</TableCell>
                  <TableCell>
                    {new Date(cliente.data_cadastro).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEnviarMensagem(cliente)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAgendarTarefa(cliente)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Mensagem com IA */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Mensagem - {selectedCliente?.nome}</DialogTitle>
            <DialogDescription>
              Use a sugestão da IA ou escreva sua própria mensagem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {sugestaoIA && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Bot className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-600">Sugestão da IA</span>
                </div>
                <p className="text-sm text-blue-800">{sugestaoIA}</p>
              </div>
            )}
            <div>
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                placeholder="Digite sua mensagem..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Enviar via WhatsApp</Button>
              <Button variant="outline" className="flex-1">Enviar via Email</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;