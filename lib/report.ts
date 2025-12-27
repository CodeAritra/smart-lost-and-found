import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

// REPORT LOST
export const reportLostItem = async (data: any) => {
  await addDoc(collection(db, "lostItems"), {
    ...data,
    status: "open",
    createdAt: serverTimestamp(),
  })
}

// REPORT FOUND
export const reportFoundItem = async (data: any) => {
  await addDoc(collection(db, "foundItems"), {
    ...data,
    status: "unclaimed",
    createdAt: serverTimestamp(),
  })
}
