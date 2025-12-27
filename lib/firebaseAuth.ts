import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { auth } from "./firebase"

const provider = new GoogleAuthProvider()

export const login = async () => {
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export const logout = async () => {
  await signOut(auth)
}
