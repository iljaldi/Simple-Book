export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          allow_override: boolean
          created_at: string
          default_taxation_type: string | null
          id: string
          is_deductible: boolean
          name: string
          sort_order: number | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          allow_override?: boolean
          created_at?: string
          default_taxation_type?: string | null
          id?: string
          is_deductible?: boolean
          name: string
          sort_order?: number | null
          transaction_type?: string
          user_id: string
        }
        Update: {
          allow_override?: boolean
          created_at?: string
          default_taxation_type?: string | null
          id?: string
          is_deductible?: boolean
          name?: string
          sort_order?: number | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      receipts: {
        Row: {
          deleted_at: string | null
          file_size: number | null
          file_url: string
          id: string
          match_confidence: number | null
          mime_type: string | null
          ocr_status: Database["public"]["Enums"]["ocr_status"] | null
          ocr_text: string | null
          original_filename: string | null
          transaction_id: string | null
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          deleted_at?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          match_confidence?: number | null
          mime_type?: string | null
          ocr_status?: Database["public"]["Enums"]["ocr_status"] | null
          ocr_text?: string | null
          original_filename?: string | null
          transaction_id?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          deleted_at?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          match_confidence?: number | null
          mime_type?: string | null
          ocr_status?: Database["public"]["Enums"]["ocr_status"] | null
          ocr_text?: string | null
          original_filename?: string | null
          transaction_id?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          business_id: string | null
          deleted_at: string | null
          file_url: string
          format: Database["public"]["Enums"]["report_format"]
          generated_at: string
          id: string
          parameters: Json | null
          period_end: string
          period_start: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          deleted_at?: string | null
          file_url: string
          format?: Database["public"]["Enums"]["report_format"]
          generated_at?: string
          id?: string
          parameters?: Json | null
          period_end: string
          period_start: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          deleted_at?: string | null
          file_url?: string
          format?: Database["public"]["Enums"]["report_format"]
          generated_at?: string
          id?: string
          parameters?: Json | null
          period_end?: string
          period_start?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_gross: number
          amount_original: number | null
          business_id: string | null
          business_use_ratio: number | null
          category: string | null
          category_id: string | null
          counterparty_biz_no: string | null
          counterparty_name: string | null
          created_at: string
          currency: string
          currency_original: string | null
          date: string
          deleted_at: string | null
          description: string | null
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          fx_rate: number | null
          id: string
          is_deductible: boolean | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          project: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          taxation_type: Database["public"]["Enums"]["taxation_type"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
          vat_amount: number
          withholding_income_tax: number | null
          withholding_local_tax: number | null
        }
        Insert: {
          amount_gross?: number
          amount_original?: number | null
          business_id?: string | null
          business_use_ratio?: number | null
          category?: string | null
          category_id?: string | null
          counterparty_biz_no?: string | null
          counterparty_name?: string | null
          created_at?: string
          currency?: string
          currency_original?: string | null
          date?: string
          deleted_at?: string | null
          description?: string | null
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          fx_rate?: number | null
          id?: string
          is_deductible?: boolean | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          taxation_type?: Database["public"]["Enums"]["taxation_type"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
          vat_amount?: number
          withholding_income_tax?: number | null
          withholding_local_tax?: number | null
        }
        Update: {
          amount_gross?: number
          amount_original?: number | null
          business_id?: string | null
          business_use_ratio?: number | null
          category?: string | null
          category_id?: string | null
          counterparty_biz_no?: string | null
          counterparty_name?: string | null
          created_at?: string
          currency?: string
          currency_original?: string | null
          date?: string
          deleted_at?: string | null
          description?: string | null
          evidence_type?: Database["public"]["Enums"]["evidence_type"]
          fx_rate?: number | null
          id?: string
          is_deductible?: boolean | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          taxation_type?: Database["public"]["Enums"]["taxation_type"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
          vat_amount?: number
          withholding_income_tax?: number | null
          withholding_local_tax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          biz_type_code: string | null
          business_reg_no: string | null
          created_at: string
          deleted_at: string | null
          email: string
          email_verified: boolean
          id: string
          last_login_at: string | null
          name: string
          password: string | null
          privacy_agreed_at: string | null
          reset_expiry: string | null
          reset_token: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          terms_agreed_at: string | null
          updated_at: string
          verification_expiry: string | null
          verification_token: string | null
        }
        Insert: {
          biz_type_code?: string | null
          business_reg_no?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          email_verified?: boolean
          id?: string
          last_login_at?: string | null
          name: string
          password?: string | null
          privacy_agreed_at?: string | null
          reset_expiry?: string | null
          reset_token?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          terms_agreed_at?: string | null
          updated_at?: string
          verification_expiry?: string | null
          verification_token?: string | null
        }
        Update: {
          biz_type_code?: string | null
          business_reg_no?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          email_verified?: boolean
          id?: string
          last_login_at?: string | null
          name?: string
          password?: string | null
          privacy_agreed_at?: string | null
          reset_expiry?: string | null
          reset_token?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          terms_agreed_at?: string | null
          updated_at?: string
          verification_expiry?: string | null
          verification_token?: string | null
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
      evidence_type:
        | "TAX_INVOICE"
        | "INVOICE"
        | "CARD"
        | "CASH_RCPT"
        | "SIMPLE_RCPT"
        | "NONE"
      ocr_status: "pending" | "done" | "failed"
      payment_method: "transfer" | "card" | "cash" | "etc"
      report_format: "excel" | "csv" | "pdf" | "zip"
      taxation_type: "TAXABLE" | "ZERO_RATED" | "EXEMPT"
      transaction_status: "draft" | "confirmed"
      transaction_type: "income" | "expense"
      user_role: "user" | "admin"
      user_status: "active" | "suspended" | "deleted"
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
      evidence_type: [
        "TAX_INVOICE",
        "INVOICE",
        "CARD",
        "CASH_RCPT",
        "SIMPLE_RCPT",
        "NONE",
      ],
      ocr_status: ["pending", "done", "failed"],
      payment_method: ["transfer", "card", "cash", "etc"],
      report_format: ["excel", "csv", "pdf", "zip"],
      taxation_type: ["TAXABLE", "ZERO_RATED", "EXEMPT"],
      transaction_status: ["draft", "confirmed"],
      transaction_type: ["income", "expense"],
      user_role: ["user", "admin"],
      user_status: ["active", "suspended", "deleted"],
    },
  },
} as const
