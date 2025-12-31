import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import type { Item, ItemType } from "../types/item"

// Get user-specific reports
export async function getMyReports(userId: string): Promise<Item[]> {
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

  const [lostSnap, foundSnap] = await Promise.all([getDocs(lostQ), getDocs(foundQ)])

  return [
    ...lostSnap.docs.map(d => ({ id: d.id, type: "lost" as ItemType, ...d.data() })),
    ...foundSnap.docs.map(d => ({ id: d.id, type: "found" as ItemType, ...d.data() })),
  ] as Item[]
}

// Global lost items
export async function getGlobalLost(): Promise<Item[]> {
  const q = query(collection(db, "lostItems"), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, type: "lost" as ItemType, ...d.data() })) as Item[]
}

// Global found items
export async function getGlobalFound(): Promise<Item[]> {
  const q = query(collection(db, "foundItems"), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, type: "found" as ItemType, ...d.data() })) as Item[]
}
