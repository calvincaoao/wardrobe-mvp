import { supabase } from '../lib/supabase'

export default function Wardrobe() {
  async function signOut() {
    await supabase?.auth.signOut()
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Wardrobe</h1>
        <button
          onClick={signOut}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
        >
          Sign out
        </button>
      </header>

      <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
        <p className="text-sm">No items yet.</p>
        <p className="mt-1 text-xs">Adding items from photos arrives in M1.</p>
      </div>
    </div>
  )
}
