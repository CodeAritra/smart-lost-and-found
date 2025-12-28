import { NextResponse } from "next/server";
import {
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { extractSignals } from "@/lib/signalExtractor";

type Signals = {
    color?: string;
    brand?: string;
    damage?: string | null;
    accessory?: string | null;
    accessoryColor?: string | null;
};


/* -------------------- Helpers -------------------- */

const normalize = (value?: string) =>
    value?.toLowerCase().replace(/[^a-z0-9]/g, "").trim() || "";

/* -------------------- API -------------------- */

export async function POST(req: Request) {
    try {
        const { foundItemId, answers, userId } = await req.json();

        if (!foundItemId || !answers || !userId) {
            return NextResponse.json(
                { error: "Missing required data" },
                { status: 400 }
            );
        }

        /* ---------- Fetch Found Item ---------- */
        const foundRef = doc(db, "foundItems", foundItemId);
        const foundSnap = await getDoc(foundRef);

        if (!foundSnap.exists()) {
            return NextResponse.json(
                { error: "Item not found" },
                { status: 404 }
            );
        }

        const found = foundSnap.data();

        /* ---------- Prevent Double Claim ---------- */
        if (found.status === "claimed") {
            return NextResponse.json(
                { error: "Item already claimed" },
                { status: 409 }
            );
        }

        /* ---------- Extract Signals ---------- */
        const signals = extractSignals(found);

        let score = 0;
        let total = 0;

        /* ---------- Dynamic Answer Evaluation ---------- */
        for (const key of Object.keys(answers) as (keyof Signals)[]) {
            if (signals[key]) {
                total++;
                if (
                    normalize(answers[key]).includes(
                        normalize(signals[key])
                    )
                ) {
                    score++;
                }
            }
        }

        const confidence = total > 0 ? score / total : 0;

        /* ---------- Decision Logic ---------- */
        let decision: "approved" | "rejected" | "under_review" = "rejected";

        if (found.sensitiveItem) {
            if (confidence >= 0.85) decision = "approved";
            else if (confidence >= 0.6) decision = "under_review";
        } else {
            if (confidence >= 0.6) decision = "approved";
        }

        /* ---------- Store Claim Attempt (Audit) ---------- */
        await addDoc(collection(db, "claimAttempts"), {
            foundItemId,
            userId,
            answers,
            confidence,
            decision,
            createdAt: serverTimestamp(),
        });

        /* ---------- If Approved ---------- */
        if (decision === "approved") {
            await updateDoc(foundRef, {
                status: "claimed",
                claimedBy: userId,
                claimedAt: serverTimestamp(),
            });

            await addDoc(collection(db, "claims"), {
                foundItemId,
                claimantId: userId,
                confidence,
                createdAt: serverTimestamp(),
            });
        }

        /* ---------- Response ---------- */
        return NextResponse.json({
            decision,
            confidence,
        });
    } catch (error) {
        console.error("Claim verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
