import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export function subscribe(email: string) {
  return setDoc(doc(db, 'newsletter', email), {
    subscribed: Timestamp.now(),
  })
}
