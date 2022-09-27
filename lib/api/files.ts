import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { app } from './firebase'

const storage = getStorage(app)

export const uploadFile = async (path: string, file: File) => {
  if (!file) throw new Error('No file provided')

  const imageRef = ref(storage, path)
  await uploadBytes(imageRef, file)

  return await getFile(path)
}

export const getFile = (path: string) => getDownloadURL(ref(storage, path))

export const deleteFile = (path: string) => deleteObject(ref(storage, path))
