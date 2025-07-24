export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      apis_conectadas: {
        Row: {
          ativo: boolean
          chave_token: string
          created_at: string
          descricao: string | null
          id: string
          nome_api: string
          tipo_autenticacao: Database["public"]["Enums"]["tipo_autenticacao"]
          updated_at: string
          url_base: string
        }
        Insert: {
          ativo?: boolean
          chave_token: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome_api: string
          tipo_autenticacao: Database["public"]["Enums"]["tipo_autenticacao"]
          updated_at?: string
          url_base: string
        }
        Update: {
          ativo?: boolean
          chave_token?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome_api?: string
          tipo_autenticacao?: Database["public"]["Enums"]["tipo_autenticacao"]
          updated_at?: string
          url_base?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cpf: string | null
          created_at: string
          data_cadastro: string
          email: string | null
          id: string
          nome: string
          origem: string | null
          status: Database["public"]["Enums"]["cliente_status"]
          tags: string[] | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          data_cadastro?: string
          email?: string | null
          id?: string
          nome: string
          origem?: string | null
          status?: Database["public"]["Enums"]["cliente_status"]
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          data_cadastro?: string
          email?: string | null
          id?: string
          nome?: string
          origem?: string | null
          status?: Database["public"]["Enums"]["cliente_status"]
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      interacoes: {
        Row: {
          canal: Database["public"]["Enums"]["interacao_canal"]
          cliente_id: string
          created_at: string
          data: string
          id: string
          mensagem: string
          resposta: string | null
          usuario_id: string | null
        }
        Insert: {
          canal: Database["public"]["Enums"]["interacao_canal"]
          cliente_id: string
          created_at?: string
          data?: string
          id?: string
          mensagem: string
          resposta?: string | null
          usuario_id?: string | null
        }
        Update: {
          canal?: Database["public"]["Enums"]["interacao_canal"]
          cliente_id?: string
          created_at?: string
          data?: string
          id?: string
          mensagem?: string
          resposta?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          cliente_id: string
          created_at: string
          data_limite: string | null
          descricao: string
          id: string
          responsavel: string
          status: Database["public"]["Enums"]["tarefa_status"]
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_limite?: string | null
          descricao: string
          id?: string
          responsavel: string
          status?: Database["public"]["Enums"]["tarefa_status"]
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_limite?: string | null
          descricao?: string
          id?: string
          responsavel?: string
          status?: Database["public"]["Enums"]["tarefa_status"]
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          cargo: Database["public"]["Enums"]["cargo_usuario"]
          created_at: string
          email: string
          id: string
          login: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cargo?: Database["public"]["Enums"]["cargo_usuario"]
          created_at?: string
          email: string
          id?: string
          login: string
          nome: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cargo?: Database["public"]["Enums"]["cargo_usuario"]
          created_at?: string
          email?: string
          id?: string
          login?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cargo_usuario: "admin" | "vendedor" | "supervisor" | "atendente"
      cliente_status: "novo" | "em_andamento" | "fechado" | "perdido"
      interacao_canal: "whatsapp" | "email" | "telefone" | "chat" | "presencial"
      tarefa_status: "pendente" | "em_andamento" | "concluida" | "cancelada"
      tipo_autenticacao: "api_key" | "bearer_token" | "basic_auth" | "oauth"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cargo_usuario: ["admin", "vendedor", "supervisor", "atendente"],
      cliente_status: ["novo", "em_andamento", "fechado", "perdido"],
      interacao_canal: ["whatsapp", "email", "telefone", "chat", "presencial"],
      tarefa_status: ["pendente", "em_andamento", "concluida", "cancelada"],
      tipo_autenticacao: ["api_key", "bearer_token", "basic_auth", "oauth"],
    },
  },
} as const
