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
      attendance: {
        Row: {
          check_in_time: string | null
          checked_in: boolean | null
          created_at: string | null
          id: number
          justification: string | null
          leader_comment: string | null
          session_id: number | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          check_in_time?: string | null
          checked_in?: boolean | null
          created_at?: string | null
          id?: number
          justification?: string | null
          leader_comment?: string | null
          session_id?: number | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          check_in_time?: string | null
          checked_in?: boolean | null
          created_at?: string | null
          id?: number
          justification?: string | null
          leader_comment?: string | null
          session_id?: number | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sessions: {
        Row: {
          course_id: number | null
          created_at: string | null
          id: number
          is_completed: boolean | null
          notes: string | null
          session_date: string
          session_number: number | null
          topic: string | null
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          id?: number
          is_completed?: boolean | null
          notes?: string | null
          session_date: string
          session_number?: number | null
          topic?: string | null
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          id?: number
          is_completed?: boolean | null
          notes?: string | null
          session_date?: string
          session_number?: number | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          capacity: number
          course_tag: string | null
          created_at: string | null
          end_date: string
          enrolled_count: number | null
          format: string | null
          id: number
          initial_date: string
          is_active: boolean | null
          leader_id: number | null
          repense_group: string
          status: string | null
          title: string | null
          updated_at: string | null
          whatsapp_group_link: string | null
        }
        Insert: {
          capacity: number
          course_tag?: string | null
          created_at?: string | null
          end_date: string
          enrolled_count?: number | null
          format?: string | null
          id?: number
          initial_date: string
          is_active?: boolean | null
          leader_id?: number | null
          repense_group: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
          whatsapp_group_link?: string | null
        }
        Update: {
          capacity?: number
          course_tag?: string | null
          created_at?: string | null
          end_date?: string
          enrolled_count?: number | null
          format?: string | null
          id?: number
          initial_date?: string
          is_active?: boolean | null
          leader_id?: number | null
          repense_group?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
          whatsapp_group_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "leaders"
            referencedColumns: ["id"]
          },
        ]
      }
      courses_list: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      leaders: {
        Row: {
          created_at: string | null
          dob: string | null
          email: string | null
          id: number
          is_active: boolean
          name: string
          phone: string | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dob?: string | null
          email?: string | null
          id?: number
          is_active?: boolean
          name: string
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dob?: string | null
          email?: string | null
          id?: number
          is_active?: boolean
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      student_courses: {
        Row: {
          attended: boolean | null
          course_id: number | null
          course_tag: string | null
          created_at: string | null
          feedback: string | null
          id: number
          is_youth_course: boolean | null
          registration_date: string | null
          student_id: string | null
        }
        Insert: {
          attended?: boolean | null
          course_id?: number | null
          course_tag?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: number
          is_youth_course?: boolean | null
          registration_date?: string | null
          student_id?: string | null
        }
        Update: {
          attended?: boolean | null
          course_id?: number | null
          course_tag?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: number
          is_youth_course?: boolean | null
          registration_date?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_courses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          email: string | null
          gender: string | null
          id: string
          marital_status: string | null
          name: string
          phone: string | null
          registration_date: string | null
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          gender?: string | null
          id: string
          marital_status?: string | null
          name: string
          phone?: string | null
          registration_date?: string | null
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          marital_status?: string | null
          name?: string
          phone?: string | null
          registration_date?: string | null
          updated_at?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
