import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { noop } from './common'
import { db } from './firebase'
import { AnyClosure } from './types'

const DEFAULT_BLOCK = {
  components: [
    {
      type: 'text',
      value: '',
    },
  ],
}

export type CmsBlock = typeof DEFAULT_BLOCK

interface UseCmsBlockOptions {
  id: string
  onError?: AnyClosure
}

export function useCmsBlock({ id, onError = noop }: UseCmsBlockOptions) {
  const [block, setBlock] = useState<CmsBlock>()

  useEffect(
    () =>
      onSnapshot(
        doc(db, 'cms', id),
        (doc) => setBlock(doc.data() as CmsBlock),
        onError
      ),
    [id, onError]
  )

  return block || DEFAULT_BLOCK
}
