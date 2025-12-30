import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import { matchLostItem, matchFoundItem } from "@/lib/aimatchmaking"

// REPORT LOST
export const reportLostItem = async (data: any) => {
  //  Add lost item
  const docRef = await addDoc(collection(db, "lostItems"), {
    ...data,
    status: "open",
    createdAt: serverTimestamp(),
  })

  //  AI MATCHMAKING (lost ➜ found)
  await matchLostItem({
    ...data,
    id: docRef.id,
  })

  return docRef.id
}

// REPORT FOUND
export const reportFoundItem = async (data: any) => {
  //  Add found item
  const docRef = await addDoc(collection(db, "foundItems"), {
    ...data,
    status: "unclaimed",
    createdAt: serverTimestamp(),
  })

  //  AI MATCHMAKING (found ➜ lost)
  await matchFoundItem({
    ...data,
    id: docRef.id,
  })

  return docRef.id
}
