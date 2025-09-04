import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Quick helper functions for PlanPal
export const planHelpers = {
  // Create a new plan
  async createPlan(planData: {
    name: string
    date: string
    time: string
    activity_type: string
    location_name?: string
    location_address?: string
    description?: string
  }) {
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
    response: 'going' | 'not-going' | 'maybe'
  }) {
    const { data, error } = await supabase
      .from('rsvps')
      .upsert({
        plan_id: planId,
        ...rsvpData
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
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data || []
  }
}
