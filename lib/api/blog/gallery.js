import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { deleteFile, uploadFile } from './files'
import { app } from './firebase'

// TODO ts

const db = getFirestore(app)

export function useGallery(postId) {
  const [images, setImages] = useState([])

  useEffect(() => {
    if (!postId) return

    return onSnapshot(doc(db, 'gallery', postId), (gallery) =>
      setImages(gallery.data()?.images || [])
    )
  }, [postId])

  return { images }
}

export async function uploadGallery(postId, files) {
  const urls = await Promise.all(
    Array.from(files).map(async (file) => {
      const path = `gallery/${postId}/${file.name}`
      const src = await uploadFile(path, file)

      return { src, path, fileName: file.name }
    })
  )

  return await setGallery(postId, urls)
}

export async function setGallery(postId, images) {
  const gallery = await getDoc(doc(db, 'gallery', postId))

  const currentImages = gallery.data()?.images || []

  return await setDoc(doc(db, 'gallery', postId), {
    images: [...currentImages, ...images],
  })
}

export async function deleteImage(postId, image) {
  const gallery = await getDoc(doc(db, 'gallery', postId))

  const currentImages = gallery.data()?.images || []

  await setDoc(doc(db, 'gallery', postId), {
    images: currentImages.filter((i) => i.path !== image.path),
  })

  return await deleteFile(image.path)
}
