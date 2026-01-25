import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  getDoc,
  doc
} from "firebase/firestore"

/* ---------- TEXT SIMILARITY ---------- */
const tokenize = (text: string = "") =>
  text.toLowerCase().split(/\s+/).filter(Boolean)

const textSimilarity = (a: string = "", b: string = "") => {
  const A = new Set(tokenize(a))
  const B = new Set(tokenize(b))

  const intersection = [...A].filter(x => B.has(x)).length
  const union = new Set([...A, ...B]).size

  return union === 0 ? 0 : intersection / union
}

/* ---------- MATCH SCORE ---------- */
const calculateMatchScore = (lost: any, found: any) => {
  let score = 0
  const reasons: string[] = []

  if (lost.category === found.category) {
    score += 30
    reasons.push("Same category")
  }

  const textScore = textSimilarity(
    `${lost.name} ${lost.description} ${lost.brand}`,
    `${found.name} ${found.description} ${found.brand}`
  )

  if (textScore > 0.3) {
    score += Math.floor(textScore * 30)
    reasons.push("Similar name/description")
  }

  if (lost.color && lost.color === found.color) {
    score += 15
    reasons.push("Color match")
  }

  if (lost.brand && lost.brand === found.brand) {
    score += 10
    reasons.push("Brand match")
  }

  if (lost.location === found.location) {
    score += 10
    reasons.push("Same location")
  }

  const lostTime = new Date(lost.time).getTime()
  const foundTime = new Date(found.time).getTime()
  const daysDiff =
    Math.abs(lostTime - foundTime) / (1000 * 60 * 60 * 24)

  if (daysDiff <= 7) {
    score += 5
    reasons.push("Reported within 7 days")
  }

  return { score, reasons }
}

/* ---------- LOST ➜ FOUND MATCH ---------- */
export const matchLostItem = async (lostItem: any) => {
  const foundSnap = await getDocs(collection(db, "foundItems"))
  const createdMatches = []

  for (const docSnap of foundSnap.docs) {
    const foundItem = docSnap.data()
    const { score, reasons } =
      calculateMatchScore(lostItem, foundItem)

    // console.log("found item = ", foundItem, "\nlost item = ", lostItem)
    // console.log("found item id = ", foundItem.foundBy, "\nlost item id = ", lostItem.userId)

    const foundUserId = foundItem.foundBy
    const lostUserId = lostItem.userId

    const [lostUserSnap, foundUserSnap] = await Promise.all([
      getDoc(doc(db, "users", lostUserId)),
      getDoc(doc(db, "users", foundUserId)),
    ])

    if (!lostUserSnap.exists() || !foundUserSnap.exists()) {
      continue
    }

    const lostUserEmail = lostUserSnap.data().email
    const foundUserEmail = foundUserSnap.data().email

    if (score >= 60) {
      const matchRef = await addDoc(collection(db, "matches"), {
        lostItemId: lostItem.id,
        foundItemId: docSnap.id,
        lostUserId,
        foundUserId,
        score,
        reasons,
        status: "pending",
        notified: false,
        createdAt: Timestamp.now()
      })


      createdMatches.push({
        id: matchRef.id,
        foundItemId: docSnap.id,
        lostUserId,
        lostUserEmail,
        foundUserId,
        foundUserEmail,
        score
      })
    }
  }

  return createdMatches
}


/* ---------- FOUND ➜ LOST MATCH ---------- */
export const matchFoundItem = async (foundItem: any) => {
  const lostSnap = await getDocs(collection(db, "lostItems"))
  const createdMatches = []

  for (const docSnap of lostSnap.docs) {
    const lostItem = docSnap.data()

    const { score, reasons } =
      calculateMatchScore(lostItem, foundItem)

    const foundUserId = foundItem.foundBy
    const lostUserId = lostItem.userId

    const [lostUserSnap, foundUserSnap] = await Promise.all([
      getDoc(doc(db, "users", lostUserId)),
      getDoc(doc(db, "users", foundUserId)),
    ])

    if (!lostUserSnap.exists() || !foundUserSnap.exists()) {
      continue
    }

    const lostUserEmail = lostUserSnap.data().email
    const foundUserEmail = foundUserSnap.data().email

    console.log("lost email = ", lostUserEmail, "\nfound email = ", foundUserEmail)

    if (score >= 60) {
      const matchRef = await addDoc(collection(db, "matches"), {
        lostItemId: docSnap.id,        
        foundItemId: foundItem.id,     
        lostUserId,
        foundUserId,
        score,
        reasons,
        status: "pending",
        notified: false,
        createdAt: Timestamp.now(),
      })

      createdMatches.push({
        id: matchRef.id,
        foundItemId: docSnap.id,
        lostUserId,
        lostUserEmail,
        foundUserId,
        foundUserEmail,
        score
      })
    }
  }
  return createdMatches

}
