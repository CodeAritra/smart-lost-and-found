import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore"

export async function getMyReports(userId: string) {
  const lostQ = query(
    collection(db, "lostItems"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )

  const foundQ = query(
    collection(db, "foundItems"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )

  const [lostSnap, foundSnap] = await Promise.all([
    getDocs(lostQ),
    getDocs(foundQ),
  ])

  return [
    ...lostSnap.docs.map(d => ({ id: d.id, type: "lost", ...d.data() })),
    ...foundSnap.docs.map(d => ({ id: d.id, type: "found", ...d.data() })),
  ]
}

export async function getGlobalLost() {
  const q = query(
    collection(db, "lostItems"),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getGlobalFound() {
  const q = query(
    collection(db, "foundItems"),
    orderBy("createdAt", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
