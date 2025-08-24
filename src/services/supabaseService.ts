import { supabase, supabaseAdmin, Database } from '../config/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

type Submission = Database['public']['Tables']['submissions']['Row']
type SubmissionInsert = Database['public']['Tables']['submissions']['Insert']
type SubmissionUpdate = Database['public']['Tables']['submissions']['Update']

type Payment = Database['public']['Tables']['payments']['Row']
type PaymentInsert = Database['public']['Tables']['payments']['Insert']
type PaymentUpdate = Database['public']['Tables']['payments']['Update']

type PaystackSettings = Database['public']['Tables']['paystack_settings']['Row']
type SocialMediaSettings = Database['public']['Tables']['social_media_settings']['Row']
type AppSettings = Database['public']['Tables']['app_settings']['Row']

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-secret-key-change-in-production'

export class SupabaseService {
  // User Management
  static async createUser(userData: Omit<UserInsert, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }

  static async updateUser(id: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }

  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  // Authentication
  static async authenticateUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.getUserByEmail(email)
    if (!user) throw new Error('User not found')

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) throw new Error('Invalid password')

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return { user, token }
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  // Submissions
  static async createSubmission(submissionData: Omit<SubmissionInsert, 'id' | 'submitted_at'>): Promise<Submission> {
    const { data, error } = await supabase
      .from('submissions')
      .insert([submissionData])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async getSubmissionById(id: string): Promise<Submission | null> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }

  static async getUserSubmissions(userId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getAllSubmissions(): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async updateSubmission(id: string, updates: SubmissionUpdate): Promise<Submission> {
    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deleteSubmission(id: string): Promise<void> {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  }

  // Payments
  static async createPayment(paymentData: Omit<PaymentInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async getPaymentByReference(reference: string): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }

  static async getUserPayments(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getAllPayments(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async updatePayment(id: string, updates: PaymentUpdate): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async checkUserPaymentStatus(userId: string): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'success')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }

  // Paystack Settings
  static async getPaystackSettings(): Promise<PaystackSettings | null> {
    const { data, error } = await supabase
      .from('paystack_settings')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }

  static async updatePaystackSettings(settings: Partial<PaystackSettings>): Promise<PaystackSettings> {
    // Check if settings exist
    const existing = await this.getPaystackSettings()
    
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('paystack_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('paystack_settings')
        .insert([settings])
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    }
  }

  // Social Media Settings
  static async getSocialMediaSettings(): Promise<SocialMediaSettings[]> {
    const { data, error } = await supabase
      .from('social_media_settings')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getAllSocialMediaSettings(): Promise<SocialMediaSettings[]> {
    const { data, error } = await supabase
      .from('social_media_settings')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async updateSocialMediaSettings(platform: string, updates: Partial<SocialMediaSettings>): Promise<SocialMediaSettings> {
    const { data, error } = await supabase
      .from('social_media_settings')
      .update(updates)
      .eq('platform', platform)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  // App Settings
  static async getAppSetting(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data?.setting_value || null
  }

  static async updateAppSetting(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ setting_key: key, setting_value: value })

    if (error) throw new Error(error.message)
  }

  // Utility Methods
  static async isUserAdmin(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId)
    return user?.is_admin || false
  }

  static async generateReference(): Promise<string> {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8)
    return `MECE-${timestamp}-${random}`.toUpperCase()
  }
}
