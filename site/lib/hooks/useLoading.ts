import { useState } from 'react'

export default function useLoading() {
  const [pending, setPending] = useState(false)

  const start = () => setPending(true)
  const stop = () => setPending(false)

  return { pending, start, stop }
}
