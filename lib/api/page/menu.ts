import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { db } from '@lib/firebase'
import { QueryBase } from '@lib/types'

export type Link = {
  label: string
  href: string
  menu_position: number | null
  is_legal?: boolean
}

interface MenuQuery extends QueryBase<Link> {
  withHidden?: boolean
}

export const IGNORE_PARAMS = ['/winners']

export async function getMenuItem(href: string): Promise<Link> {
  const menuItemData = await getDoc(doc(db, 'menu', hrefTo(href)))

  return transform(menuItemData)
}

export async function setMenuItem({
  href,
  label,
  menu_position,
  is_legal,
}: Link) {
  return await setDoc(doc(db, 'menu', hrefTo(href)), {
    label,
    menu_position,
    is_legal,
  })
}

export async function deleteMenuItem(href: string | string[]) {
  return await Promise.all(
    (typeof href === 'string' ? [href] : href).map((href) =>
      deleteDoc(doc(db, 'menu', hrefTo(href)))
    )
  )
}

export function useMenu({
  withHidden = false,
  onError = console.error,
}: MenuQuery = {}) {
  const [menu, setMenu] = useState<Link[]>([])

  const filter = (item: Link) => item.menu_position !== null

  const main = useMemo(() => {
    const main = menu.filter((item) => !item.is_legal)

    return withHidden ? main : main.filter(filter)
  }, [menu, withHidden])

  const legal = useMemo(() => {
    const legal = menu.filter((item) => item.is_legal)

    return withHidden ? legal : legal.filter(filter)
  }, [menu, withHidden])

  useEffect(
    () =>
      onSnapshot(
        collection(db, 'menu'),
        (querySnapshot) => {
          setMenu(
            // @ts-ignore
            querySnapshot.docs
              .map(transform)
              // @ts-ignore
              .sort((a, b) => {
                const positionA =
                  a.menu_position !== null ? a.menu_position : Infinity
                const positionB =
                  b.menu_position !== null ? b.menu_position : Infinity

                return positionA - positionB
              })
          )
        },
        onError
      ),
    [onError]
  )

  return { main, legal, all: menu }
}

function transform(doc: any): Link {
  const data = doc.data()

  return {
    ...data,
    href: hrefFrom(doc.id),
  }
}

function hrefTo(href: string) {
  return href.replaceAll('/', '%2F')
}

function hrefFrom(href: string) {
  return href.replaceAll('%2F', '/')
}
