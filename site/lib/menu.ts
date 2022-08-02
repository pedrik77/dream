import { useEffect, useMemo, useState } from 'react'
import { useCategories } from './categories'

type Link = {
  label: string
  href: string
}

export function useMenu() {
  const categories = useCategories()

  const [main, setMain] = useState<Link[]>([])
  const [legal, setLegal] = useState<Link[]>([])

  useEffect(() => {
    setMain(
      categories.map((c) => ({
        label: c.title,
        href: `/products?category=${c.slug}`,
      }))
    )
  }, [categories])

  return { main, legal }
}
