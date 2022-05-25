import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export function subscribe(email) {
  return setDoc(doc(db, 'newsletter', email), {
    subscribed: Timestamp.now(),
  })
}
