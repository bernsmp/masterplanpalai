import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have real credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

// Quick helper functions for PlanPal
export const planHelpers = {
  // Check if Supabase is properly configured
  isConfigured() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL && 
           process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key'
  },

  // Create a new plan
  async createPlan(planData: {
    name: string
    date: string
    time: string
    activity_type: string
    location_name?: string
    location_address?: string
    description?: string
    creator_email?: string
    creator_name?: string
  }) {
    if (!this.isConfigured()) {
      throw new Error('Supabase not configured')
    }
    
    // Check for duplicate events (same creator, name, date, time)
    if (planData.creator_email) {
      const { data: existingPlans, error: checkError } = await supabase
        .from('plans')
        .select('id')
        .eq('creator_email', planData.creator_email)
        .eq('name', planData.name)
        .eq('date', planData.date)
        .eq('time', planData.time)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Within last 5 minutes
      
      if (checkError) {
        console.warn('Error checking for duplicates:', checkError)
      } else if (existingPlans && existingPlans.length > 0) {
        throw new Error('A similar event was created recently. Please wait a moment before creating another.')
      }
    }
    
    const { data, error } = await supabase
      .from('plans')
      .insert(planData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get plan by share code
  async getPlanByShareCode(shareCode: string) {
    if (!this.isConfigured()) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('plans')
      .select(`
        *,
        rsvps (*)
      `)
      .eq('share_code', shareCode)
      .single()
    
    if (error) throw error
    return data
  },

  // Submit RSVP
  async submitRSVP(planId: string, rsvpData: {
    name: string
    email?: string
    response: 'going' | 'not_going' | 'maybe'
    notes?: string
  }) {
    if (!this.isConfigured()) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('rsvps')
      .upsert({
        plan_id: planId,
        name: rsvpData.name,
        email: rsvpData.email,
        response: rsvpData.response,
        notes: rsvpData.notes
      }, {
        onConflict: 'plan_id,email'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get all plans (for dashboard)
  async getAllPlans() {
    if (!this.isConfigured()) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data || []
  }
}
