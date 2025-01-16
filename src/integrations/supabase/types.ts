export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_history: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          message: string
          metadata: Json | null
          response: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          response?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          response?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      property_requests: {
        Row: {
          api_data: Json | null
          api_execution_logs: Json[] | null
          api_progress: Json | null
          city: string
          coordinates: Json | null
          created_at: string
          description: string | null
          email: string
          id: string
          lightbox_data: Json | null
          lightbox_endpoints: Json | null
          lightbox_parsed_data: Json | null
          lightbox_processed_at: string | null
          lightbox_raw_responses: Json | null
          lightbox_request_id: string | null
          name: string
          processing_steps: Json | null
          state: string
          status: string | null
          status_details: Json | null
          street_address: string
          updated_at: string
          user_id: string | null
          zip_code: string
        }
        Insert: {
          api_data?: Json | null
          api_execution_logs?: Json[] | null
          api_progress?: Json | null
          city: string
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          lightbox_data?: Json | null
          lightbox_endpoints?: Json | null
          lightbox_parsed_data?: Json | null
          lightbox_processed_at?: string | null
          lightbox_raw_responses?: Json | null
          lightbox_request_id?: string | null
          name: string
          processing_steps?: Json | null
          state: string
          status?: string | null
          status_details?: Json | null
          street_address: string
          updated_at?: string
          user_id?: string | null
          zip_code: string
        }
        Update: {
          api_data?: Json | null
          api_execution_logs?: Json[] | null
          api_progress?: Json | null
          city?: string
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          lightbox_data?: Json | null
          lightbox_endpoints?: Json | null
          lightbox_parsed_data?: Json | null
          lightbox_processed_at?: string | null
          lightbox_raw_responses?: Json | null
          lightbox_request_id?: string | null
          name?: string
          processing_steps?: Json | null
          state?: string
          status?: string | null
          status_details?: Json | null
          street_address?: string
          updated_at?: string
          user_id?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          metadata: Json | null
          report_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          report_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          report_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports_orders: {
        Row: {
          amount: number
          created_at: string
          download_url: string | null
          id: string
          notes: string | null
          purchase_date: string
          report_id: string | null
          report_name: string
          shipping_address: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          download_url?: string | null
          id?: string
          notes?: string | null
          purchase_date?: string
          report_id?: string | null
          report_name: string
          shipping_address?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          download_url?: string | null
          id?: string
          notes?: string | null
          purchase_date?: string
          report_id?: string | null
          report_name?: string
          shipping_address?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_orders_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_api_execution: {
        Args: {
          request_id: string
          endpoint: string
          status: string
          message: string
          details?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
