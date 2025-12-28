import { collection, doc, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { extractSignals } from "@/lib/signalExtractor";
import { generateQuestions } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { foundItemId } = await req.json();

    if (!foundItemId) {
      return NextResponse.json(
        { error: "foundItemId required" },
        { status: 400 }
      );
    }

    //  Get found item
    const foundRef = doc(db, "foundItems", foundItemId);
    const foundSnap = await getDoc(foundRef);

    if (!foundSnap.exists()) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const found = foundSnap.data();

    //  AI logic
    const signals = extractSignals(found);
    const questions = await generateQuestions(signals);

    //  Store claim session
    await addDoc(collection(db, "claimSessions"), {
      foundItemId,
      questions,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
