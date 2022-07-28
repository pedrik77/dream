import { useState } from 'react'

export default function useLoading(defaultValue = false) {
  const [pending, setPending] = useState(defaultValue)

  const start = () => setPending(true)
  const stop = () => setPending(false)

  return { pending, start, stop }
}
