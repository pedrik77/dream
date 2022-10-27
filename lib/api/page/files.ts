import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { app } from '@lib/firebase'

const storage = getStorage(app)

export const upload = async (path: string, file: File) => {
  if (!file) throw new Error('No file provided')

  const imageRef = ref(storage, path)
  await uploadBytes(imageRef, file)

  return await get(path)
}

export const get = (path: string) => getDownloadURL(ref(storage, path))

export const del = (path: string) => deleteObject(ref(storage, path))
