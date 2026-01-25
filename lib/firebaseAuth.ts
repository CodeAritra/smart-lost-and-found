import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { auth, db } from "./firebase"
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore"
const provider = new GoogleAuthProvider()

export const login = async () => {
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  if (!user) return null

  await setDoc(
    doc(db, "users", user.uid),
    {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      provider: "google",
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true } // 🔑 important
  )

  return user
}

export const logout = async () => {
  await signOut(auth)
}
