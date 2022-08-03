import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { db } from './firebase'

export type Link = {
  label: string
  href: string
  menu_position: number
  is_legal?: boolean
}

export async function getMenuItem(href: string): Promise<Link> {
  const menuItemData = await getDoc(doc(db, 'menu', href))

  return transform(menuItemData)
}

export async function setMenuItem({
  href,
  label,
  menu_position = -1,
  is_legal,
}: Link) {
  return await setDoc(doc(db, 'menu', href), {
    label,
    menu_position,
    is_legal,
  })
}

export async function deleteMenuItem(href: string | string[]) {
  return await Promise.all(
    (typeof href === 'string' ? [href] : href).map((href) =>
      deleteDoc(doc(db, 'menu', href))
    )
  )
}

export function useMenu(all = false) {
  const [menu, setMenu] = useState<Link[]>([])

  const filter = (item: Link) => item.menu_position > 0

  const main = useMemo(() => {
    const main = menu.filter((item) => !item.is_legal)

    return all ? main : main.filter(filter)
  }, [menu, all])

  const legal = useMemo(() => {
    const legal = menu.filter((item) => item.is_legal)

    return all ? legal : legal.filter(filter)
  }, [menu, all])

  useEffect(
    () =>
      onSnapshot(collection(db, 'menu'), (querySnapshot) => {
        setMenu(
          // @ts-ignore
          querySnapshot.docs
            .map(transform)
            // @ts-ignore
            .sort((a, b) => a.menu_position - b.menu_position)
        )
      }),
    []
  )

  return { main, legal, all: menu }
}

function transform(doc: any): Link {
  const data = doc.data()

  return {
    ...data,
    href: doc.id,
  }
}
