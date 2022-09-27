import { useEffect, useState } from 'react'

export function useSkipFirst() {
  const [skip, setSkip] = useState(true)

  return () => {
    if (skip) setSkip(false)

    return !skip
  }
}
