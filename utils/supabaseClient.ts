const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

import { createClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    Clerk: {
      session?: {
        getToken: (options: { template: string }) => Promise<string>
      }
    }
  }
}
function createClerkSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        console.log("Supabase client initialised")
        const clerkToken = await window.Clerk.session?.getToken({
          template: 'supabase', // Name should match the Clerk JWT Template name
        })

        const headers = new Headers(options?.headers)
        headers.set('Authorization', `Bearer ${clerkToken}`)

        return fetch(url, {
          ...options,
          headers,
        })
      },
    },
  })
}

export const client = createClerkSupabaseClient()
