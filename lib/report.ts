import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
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

//UPDATE CLIAM ITEMS

export const approveClaim = async (
  itemId: string,
  claimerUserId: string,
  status :string,
  confidence?: number
) => {
  const itemRef = doc(db, "foundItems", itemId)
  // const claimRef = doc(db, "foundItems", itemId, "claims", claimId)

  // update claim
  // await updateDoc(claimRef, {
  //   status: "approved",
  //   approvedAt: serverTimestamp(),
  // })

  // update item
  await updateDoc(itemRef, {
    status: status,
    claimedBy: claimerUserId,
    claimConfidence: confidence ?? null,
  })
}
