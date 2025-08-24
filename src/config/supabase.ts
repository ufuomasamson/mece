import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          full_name: string
          phone: string | null
          date_of_birth: string | null
          gender: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          occupation: string | null
          company: string | null
          education_level: string | null
          field_of_study: string | null
          graduation_year: number | null
          skills: string | null
          interests: string | null
          profile_picture: string | null
          is_admin: boolean
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          full_name: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          occupation?: string | null
          company?: string | null
          education_level?: string | null
          field_of_study?: string | null
          graduation_year?: number | null
          skills?: string | null
          interests?: string | null
          profile_picture?: string | null
          is_admin?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          full_name?: string
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          occupation?: string | null
          company?: string | null
          education_level?: string | null
          field_of_study?: string | null
          graduation_year?: number | null
          skills?: string | null
          interests?: string | null
          profile_picture?: string | null
          is_admin?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          submission_type: string
          title: string
          description: string | null
          content: string | null
          file_path: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          status: string
          score: number | null
          feedback: string | null
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          submission_type: string
          title: string
          description?: string | null
          content?: string | null
          file_path?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          status?: string
          score?: number | null
          feedback?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          submission_type?: string
          title?: string
          description?: string | null
          content?: string | null
          file_path?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          status?: string
          score?: number | null
          feedback?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          reference: string
          amount: number
          currency: string
          status: string
          payment_method: string | null
          paystack_transaction_id: string | null
          paystack_authorization_url: string | null
          paystack_access_code: string | null
          description: string | null
          metadata: any | null
          created_at: string
          updated_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          reference: string
          amount: number
          currency?: string
          status?: string
          payment_method?: string | null
          paystack_transaction_id?: string | null
          paystack_authorization_url?: string | null
          pay_code?: string | null
          description?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          reference?: string
          amount?: number
          currency?: string
          status?: string
          payment_method?: string | null
          paystack_transaction_id?: string | null
          paystack_authorization_url?: string | null
          paystack_access_code?: string | null
          description?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
          paid_at?: string | null
        }
      }
      paystack_settings: {
        Row: {
          id: string
          public_key: string | null
          secret_key: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          public_key?: string | null
          secret_key?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          public_key?: string | null
          secret_key?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      social_media_settings: {
        Row: {
          id: string
          platform: string
          display_name: string
          url: string | null
          icon_name: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          display_name: string
          url?: string | null
          icon_name?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          display_name?: string
          url?: string | null
          icon_name?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      app_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string | null
          setting_type: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value?: string | null
          setting_type?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string | null
          setting_type?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
