import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!supabase) return

    const { error } =
      mode === 'signUp'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else if (mode === 'signUp') {
      setMessage('Account created — check your email to confirm, then sign in.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Sign in to your wardrobe</h1>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            {mode === 'signIn' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}

        <button
          type="button"
          onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
          className="mt-4 text-sm text-neutral-500 underline"
        >
          {mode === 'signIn' ? "Don't have an account? Sign up" : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
