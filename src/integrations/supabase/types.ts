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
      agent_coordination: {
        Row: {
          agent_type: string
          coordination_score: number | null
          created_at: string | null
          feedback: string | null
          id: string
          metadata: Json | null
          sync_status: string | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          agent_type: string
          coordination_score?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          metadata?: Json | null
          sync_status?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_type?: string
          coordination_score?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          metadata?: Json | null
          sync_status?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_coordination_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "debug_thread_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_interactions: {
        Row: {
          action: string
          agent_id: string
          created_at: string | null
          details: Json | null
          flow_data: Json | null
          id: string
          metadata: Json | null
          parent_interaction_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          action: string
          agent_id: string
          created_at?: string | null
          details?: Json | null
          flow_data?: Json | null
          id?: string
          metadata?: Json | null
          parent_interaction_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          action?: string
          agent_id?: string
          created_at?: string | null
          details?: Json | null
          flow_data?: Json | null
          id?: string
          metadata?: Json | null
          parent_interaction_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_interactions_parent_interaction_id_fkey"
            columns: ["parent_interaction_id"]
            isOneToOne: false
            referencedRelation: "agent_interactions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_metrics: {
        Row: {
          active_flows: number | null
          cpu_usage: number | null
          created_at: string | null
          id: string
          memory_usage: number | null
          metrics_data: Json | null
          network_latency: number | null
          network_metrics: Json | null
          performance_indicators: Json | null
          success_rate: number | null
          system_load: Json | null
          timestamp: string | null
          total_interactions: number | null
        }
        Insert: {
          active_flows?: number | null
          cpu_usage?: number | null
          created_at?: string | null
          id?: string
          memory_usage?: number | null
          metrics_data?: Json | null
          network_latency?: number | null
          network_metrics?: Json | null
          performance_indicators?: Json | null
          success_rate?: number | null
          system_load?: Json | null
          timestamp?: string | null
          total_interactions?: number | null
        }
        Update: {
          active_flows?: number | null
          cpu_usage?: number | null
          created_at?: string | null
          id?: string
          memory_usage?: number | null
          metrics_data?: Json | null
          network_latency?: number | null
          network_metrics?: Json | null
          performance_indicators?: Json | null
          success_rate?: number | null
          system_load?: Json | null
          timestamp?: string | null
          total_interactions?: number | null
        }
        Relationships: []
      }
      api_performance_metrics: {
        Row: {
          endpoint: string
          error_count: number | null
          id: string
          metadata: Json | null
          response_time: number | null
          service_name: string
          success_rate: number | null
          timestamp: string | null
          total_requests: number | null
        }
        Insert: {
          endpoint: string
          error_count?: number | null
          id?: string
          metadata?: Json | null
          response_time?: number | null
          service_name: string
          success_rate?: number | null
          timestamp?: string | null
          total_requests?: number | null
        }
        Update: {
          endpoint?: string
          error_count?: number | null
          id?: string
          metadata?: Json | null
          response_time?: number | null
          service_name?: string
          success_rate?: number | null
          timestamp?: string | null
          total_requests?: number | null
        }
        Relationships: []
      }
      auth_thread_connections: {
        Row: {
          connection_score: number | null
          connection_status: string
          connection_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          connection_score?: number | null
          connection_status?: string
          connection_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          connection_score?: number | null
          connection_status?: string
          connection_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          context: Json | null
          created_at: string
          embedding: string | null
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
          embedding?: string | null
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
          embedding?: string | null
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
      computation_registry: {
        Row: {
          assigned_service: string | null
          complexity_score: number | null
          computation_type: string
          created_at: string | null
          execution_stats: Json | null
          id: string
          updated_at: string | null
        }
        Insert: {
          assigned_service?: string | null
          complexity_score?: number | null
          computation_type: string
          created_at?: string | null
          execution_stats?: Json | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          assigned_service?: string | null
          complexity_score?: number | null
          computation_type?: string
          created_at?: string | null
          execution_stats?: Json | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "computation_registry_assigned_service_fkey"
            columns: ["assigned_service"]
            isOneToOne: false
            referencedRelation: "microservice_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      debug_agent_monitoring: {
        Row: {
          agent_id: string
          created_at: string | null
          id: string
          last_action: string | null
          metrics: Json | null
          performance_data: Json | null
          status: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: string
          last_action?: string | null
          metrics?: Json | null
          performance_data?: Json | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: string
          last_action?: string | null
          metrics?: Json | null
          performance_data?: Json | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      debug_analytics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          timestamp: string | null
          value: number | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          timestamp?: string | null
          value?: number | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          timestamp?: string | null
          value?: number | null
        }
        Relationships: []
      }
      debug_logs: {
        Row: {
          context: Json | null
          id: string
          level: string
          message: string
          source: string | null
          timestamp: string | null
        }
        Insert: {
          context?: Json | null
          id?: string
          level: string
          message: string
          source?: string | null
          timestamp?: string | null
        }
        Update: {
          context?: Json | null
          id?: string
          level?: string
          message?: string
          source?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      debug_panel_states: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          panel_id: string
          position: Json | null
          route: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          panel_id: string
          position?: Json | null
          route: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          panel_id?: string
          position?: Json | null
          route?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      debug_sessions: {
        Row: {
          console_history: Json[] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          participants: Json | null
          session_data: Json | null
          updated_at: string | null
        }
        Insert: {
          console_history?: Json[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          participants?: Json | null
          session_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          console_history?: Json[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          participants?: Json | null
          session_data?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debug_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      debug_thread_analysis: {
        Row: {
          agent_feedback: Json | null
          agent_states: Json | null
          analysis_data: Json | null
          analysis_frequency: number | null
          analysis_interval: number | null
          analysis_status: string | null
          auto_analysis_enabled: boolean | null
          claude_feedback: string | null
          connection_score: number | null
          connection_status: string | null
          created_at: string | null
          element_identifier: string | null
          id: string
          last_agent_sync: string | null
          last_analysis_timestamp: string | null
          network_stats: Json | null
          page_path: string
          performance_metrics: Json | null
          suggested_connections: Json[] | null
          system_load: Json | null
          thread_type: string
          updated_at: string | null
        }
        Insert: {
          agent_feedback?: Json | null
          agent_states?: Json | null
          analysis_data?: Json | null
          analysis_frequency?: number | null
          analysis_interval?: number | null
          analysis_status?: string | null
          auto_analysis_enabled?: boolean | null
          claude_feedback?: string | null
          connection_score?: number | null
          connection_status?: string | null
          created_at?: string | null
          element_identifier?: string | null
          id?: string
          last_agent_sync?: string | null
          last_analysis_timestamp?: string | null
          network_stats?: Json | null
          page_path: string
          performance_metrics?: Json | null
          suggested_connections?: Json[] | null
          system_load?: Json | null
          thread_type: string
          updated_at?: string | null
        }
        Update: {
          agent_feedback?: Json | null
          agent_states?: Json | null
          analysis_data?: Json | null
          analysis_frequency?: number | null
          analysis_interval?: number | null
          analysis_status?: string | null
          auto_analysis_enabled?: boolean | null
          claude_feedback?: string | null
          connection_score?: number | null
          connection_status?: string | null
          created_at?: string | null
          element_identifier?: string | null
          id?: string
          last_agent_sync?: string | null
          last_analysis_timestamp?: string | null
          network_stats?: Json | null
          page_path?: string
          performance_metrics?: Json | null
          suggested_connections?: Json[] | null
          system_load?: Json | null
          thread_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      debug_visualizations: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          panel_type: string
          settings: Json | null
          updated_at: string | null
          visualization_data: Json | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          panel_type: string
          settings?: Json | null
          updated_at?: string | null
          visualization_data?: Json | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          panel_type?: string
          settings?: Json | null
          updated_at?: string | null
          visualization_data?: Json | null
        }
        Relationships: []
      }
      enterprise_api_metrics: {
        Row: {
          created_at: string | null
          endpoint: string
          error_count: number | null
          id: string
          performance_data: Json | null
          response_time: number | null
          service_name: string
          success_rate: number | null
          system_metrics: Json | null
          total_requests: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          error_count?: number | null
          id?: string
          performance_data?: Json | null
          response_time?: number | null
          service_name: string
          success_rate?: number | null
          system_metrics?: Json | null
          total_requests?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          error_count?: number | null
          id?: string
          performance_data?: Json | null
          response_time?: number | null
          service_name?: string
          success_rate?: number | null
          system_metrics?: Json | null
          total_requests?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          parent_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          parent_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      microservice_registry: {
        Row: {
          created_at: string | null
          dependencies: Json | null
          health_score: number | null
          id: string
          performance_metrics: Json | null
          service_name: string
          service_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: Json | null
          health_score?: number | null
          id?: string
          performance_metrics?: Json | null
          service_name: string
          service_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: Json | null
          health_score?: number | null
          id?: string
          performance_metrics?: Json | null
          service_name?: string
          service_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      project_connections: {
        Row: {
          created_at: string
          id: string
          shared_components: Json | null
          source_project_id: string
          sync_settings: Json | null
          target_project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          shared_components?: Json | null
          source_project_id: string
          sync_settings?: Json | null
          target_project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          shared_components?: Json | null
          source_project_id?: string
          sync_settings?: Json | null
          target_project_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_assessments: {
        Row: {
          assessment_date: string | null
          assessment_year: number | null
          created_at: string | null
          id: string
          improvement_value: number | null
          land_value: number | null
          last_sale_date: string | null
          last_sale_price: number | null
          property_class: string | null
          property_request_id: string | null
          tax_rate: number | null
          tax_status: string | null
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessment_year?: number | null
          created_at?: string | null
          id?: string
          improvement_value?: number | null
          land_value?: number | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          property_class?: string | null
          property_request_id?: string | null
          tax_rate?: number | null
          tax_status?: string | null
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessment_year?: number | null
          created_at?: string | null
          id?: string
          improvement_value?: number | null
          land_value?: number | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          property_class?: string | null
          property_request_id?: string | null
          tax_rate?: number | null
          tax_status?: string | null
          total_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_assessments_property_request_id_fkey"
            columns: ["property_request_id"]
            isOneToOne: false
            referencedRelation: "property_requests"
            referencedColumns: ["id"]
          },
        ]
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
          view_count: number | null
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
          view_count?: number | null
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
          view_count?: number | null
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
      service_health_status: {
        Row: {
          alerts: Json | null
          dependencies: Json | null
          id: string
          last_check: string | null
          resource_usage: Json | null
          service_name: string
          status: string
          uptime_percentage: number | null
        }
        Insert: {
          alerts?: Json | null
          dependencies?: Json | null
          id?: string
          last_check?: string | null
          resource_usage?: Json | null
          service_name: string
          status?: string
          uptime_percentage?: number | null
        }
        Update: {
          alerts?: Json | null
          dependencies?: Json | null
          id?: string
          last_check?: string | null
          resource_usage?: Json | null
          service_name?: string
          status?: string
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      service_interactions: {
        Row: {
          created_at: string | null
          data_volume: number | null
          id: string
          interaction_type: string
          latency: number | null
          source_service: string | null
          success_rate: number | null
          target_service: string | null
        }
        Insert: {
          created_at?: string | null
          data_volume?: number | null
          id?: string
          interaction_type: string
          latency?: number | null
          source_service?: string | null
          success_rate?: number | null
          target_service?: string | null
        }
        Update: {
          created_at?: string | null
          data_volume?: number | null
          id?: string
          interaction_type?: string
          latency?: number | null
          source_service?: string | null
          success_rate?: number | null
          target_service?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_interactions_source_service_fkey"
            columns: ["source_service"]
            isOneToOne: false
            referencedRelation: "microservice_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_interactions_target_service_fkey"
            columns: ["target_service"]
            isOneToOne: false
            referencedRelation: "microservice_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_computer_sessions: {
        Row: {
          active_users: Json | null
          created_at: string | null
          id: string
          screen_sharing: Json | null
          session_id: string
          system_metrics: Json | null
          updated_at: string | null
          video_chat: Json | null
          voice_chat: Json | null
        }
        Insert: {
          active_users?: Json | null
          created_at?: string | null
          id?: string
          screen_sharing?: Json | null
          session_id: string
          system_metrics?: Json | null
          updated_at?: string | null
          video_chat?: Json | null
          voice_chat?: Json | null
        }
        Update: {
          active_users?: Json | null
          created_at?: string | null
          id?: string
          screen_sharing?: Json | null
          session_id?: string
          system_metrics?: Json | null
          updated_at?: string | null
          video_chat?: Json | null
          voice_chat?: Json | null
        }
        Relationships: []
      }
      site_structure: {
        Row: {
          analytics_config: Json | null
          component_data: Json | null
          created_at: string | null
          custom_components: Json | null
          description: string | null
          hub_name: string | null
          id: string
          integration_points: Json | null
          is_active: boolean | null
          layout_type: string | null
          metadata: Json | null
          page_category: string | null
          page_path: string
          page_type: string | null
          parent_path: string | null
          requires_auth: boolean | null
          sub_pages: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          analytics_config?: Json | null
          component_data?: Json | null
          created_at?: string | null
          custom_components?: Json | null
          description?: string | null
          hub_name?: string | null
          id?: string
          integration_points?: Json | null
          is_active?: boolean | null
          layout_type?: string | null
          metadata?: Json | null
          page_category?: string | null
          page_path: string
          page_type?: string | null
          parent_path?: string | null
          requires_auth?: boolean | null
          sub_pages?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          analytics_config?: Json | null
          component_data?: Json | null
          created_at?: string | null
          custom_components?: Json | null
          description?: string | null
          hub_name?: string | null
          id?: string
          integration_points?: Json | null
          is_active?: boolean | null
          layout_type?: string | null
          metadata?: Json | null
          page_category?: string | null
          page_path?: string
          page_type?: string | null
          parent_path?: string | null
          requires_auth?: boolean | null
          sub_pages?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_analysis_intelligence: {
        Row: {
          analysis_layer: string
          analysis_type: string
          architecture_metrics: Json | null
          correlations: Json | null
          created_at: string | null
          historical_context: Json | null
          id: string
          insights: Json | null
          learning_progress: Json | null
          metrics: Json | null
          patterns: Json | null
          performance_metrics: Json | null
          predictions: Json | null
          recommendations: Json | null
          resource_metrics: Json | null
          timestamp: string | null
          updated_at: string | null
          user_experience_metrics: Json | null
        }
        Insert: {
          analysis_layer: string
          analysis_type: string
          architecture_metrics?: Json | null
          correlations?: Json | null
          created_at?: string | null
          historical_context?: Json | null
          id?: string
          insights?: Json | null
          learning_progress?: Json | null
          metrics?: Json | null
          patterns?: Json | null
          performance_metrics?: Json | null
          predictions?: Json | null
          recommendations?: Json | null
          resource_metrics?: Json | null
          timestamp?: string | null
          updated_at?: string | null
          user_experience_metrics?: Json | null
        }
        Update: {
          analysis_layer?: string
          analysis_type?: string
          architecture_metrics?: Json | null
          correlations?: Json | null
          created_at?: string | null
          historical_context?: Json | null
          id?: string
          insights?: Json | null
          learning_progress?: Json | null
          metrics?: Json | null
          patterns?: Json | null
          performance_metrics?: Json | null
          predictions?: Json | null
          recommendations?: Json | null
          resource_metrics?: Json | null
          timestamp?: string | null
          updated_at?: string | null
          user_experience_metrics?: Json | null
        }
        Relationships: []
      }
      system_events: {
        Row: {
          component: string
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          related_agents: string[] | null
          severity: string
        }
        Insert: {
          component: string
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          related_agents?: string[] | null
          severity: string
        }
        Update: {
          component?: string
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          related_agents?: string[] | null
          severity?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          component: string
          id: string
          metadata: Json | null
          metric_type: string
          timestamp: string | null
          value: number
        }
        Insert: {
          component: string
          id?: string
          metadata?: Json | null
          metric_type: string
          timestamp?: string | null
          value: number
        }
        Update: {
          component?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          timestamp?: string | null
          value?: number
        }
        Relationships: []
      }
      ui_versions: {
        Row: {
          component_data: Json
          component_registry: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          feature_list: Json | null
          id: string
          integration_data: Json | null
          is_active: boolean | null
          metadata: Json | null
          name: string
          parent_version_id: string | null
          performance_metrics: Json | null
          preview_data: Json | null
          restore_point_hash: string | null
          route: string
          synthesis_history: Json | null
          updated_at: string | null
          version_tags: string[] | null
          version_type: string | null
        }
        Insert: {
          component_data?: Json
          component_registry?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          feature_list?: Json | null
          id?: string
          integration_data?: Json | null
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          parent_version_id?: string | null
          performance_metrics?: Json | null
          preview_data?: Json | null
          restore_point_hash?: string | null
          route: string
          synthesis_history?: Json | null
          updated_at?: string | null
          version_tags?: string[] | null
          version_type?: string | null
        }
        Update: {
          component_data?: Json
          component_registry?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          feature_list?: Json | null
          id?: string
          integration_data?: Json | null
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          parent_version_id?: string | null
          performance_metrics?: Json | null
          preview_data?: Json | null
          restore_point_hash?: string | null
          route?: string
          synthesis_history?: Json | null
          updated_at?: string | null
          version_tags?: string[] | null
          version_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ui_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ui_versions_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "ui_versions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      log_agent_interaction: {
        Args: {
          agent_id: string
          action: string
          details?: Json
          parent_interaction_id?: string
        }
        Returns: string
      }
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
      search_agent_context: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          source: string
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
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
