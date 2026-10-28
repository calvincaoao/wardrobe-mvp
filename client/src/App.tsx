import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import Auth from './pages/Auth'
import Wardrobe from './pages/Wardrobe'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">
        Loading…
      </div>
    )
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="text-xl font-semibold">Wardrobe MVP</h1>
        <p className="mt-4 text-sm text-neutral-600">
          Supabase is not configured. Copy <code>client/.env.example</code> to{' '}
          <code>client/.env</code> and fill in your Supabase URL and anon key, then restart the
          dev server.
        </p>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <Routes>
      <Route path="/" element={<Wardrobe />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
