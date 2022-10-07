import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export async function subscribe(email: string, gdpr: boolean) {
  if (!email) throw Error('Zadajte email')

  if (!validateEmail(email)) throw Error('Email nie je v správnom formáte')

  if (!gdpr) throw Error('Musíte súhlasiť s GDPR')

  return await setDoc(doc(db, 'newsletter', email), {
    subscribed: Timestamp.now(),
  })
}
