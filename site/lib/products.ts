import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getFirestore,
  deleteDoc,
  doc,
  limit as limitQuery,
  startAfter,
  getDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useUser } from './auth'
import { app } from './firebase'

const db = getFirestore(app)

export async function getProducts() {
  const products = await getDocs(collection(db, 'products'))
  return products.docs
}

export async function getProduct(slug: string) {
  const product = await getDoc(doc(db, 'products', slug))
  return product
}
