"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Lock, CheckCircle2, XCircle } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/authContext"
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { extractSignals } from "@/lib/signalExtractor"
import { generateQuestions } from "@/lib/ai"

const MOCK_SIGNALS = {
  brand: "Apple",
  color: "Black",
  damage: "Scratched screen",
};

const MOCK_QUESTIONS = [
  {
    id: "brand",
    question: "What is the brand of the item?",
  },
  {
    id: "color",
    question: "What color is the item?",
  },
  {
    id: "damage",
    question: "Does the item have any damage?",
  },
];

const isMock = false

export default function VerifyOwnershipPage() {
  const router = useRouter()
  const params = useParams()

  const { user } = useAuth()

  // console.log("\nUser = ", user)

  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [decision, setDecision] = useState<string | null>(null)
  const [signals, setSignals] = useState<any>(null);
  const [ownerId, setOwnerId] = useState("")
  const [error, setError] = useState<string | null>(null)


  // user id
  const userId = user?.uid
  // let ownerId: string

  const fetchFoundItemAndSignals = async () => {
    const ref = doc(db, "foundItems", params.id as string);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Found item not found");
    }

    const foundItem = snap.data();
    // console.log("\nfound items = ", foundItem)
    setOwnerId(foundItem?.userId)
    // console.log("\nOwner id = ", ownerId)
    return extractSignals(foundItem);
  };

  /* ---------------- FETCH AI QUESTIONS ---------------- */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        if (isMock) {
          await new Promise((res) => setTimeout(res, 800)); // simulate delay

          setSignals(MOCK_SIGNALS as any);
          setQuestions(MOCK_QUESTIONS as any);
          setOwnerId("HC4nxxqYLpYqazYEKXsFy5tWoCF2")

          return;
        }

        //  Fetch & extract signals once
        const extractedSignals = await fetchFoundItemAndSignals();
        setSignals(extractedSignals);
        // console.log("\nextracted signals = ", extractedSignals)

        //  Generate AI questions
        const aiQuestions = await generateQuestions(extractedSignals);
        setQuestions(aiQuestions);
      } catch (err: any) {
        console.error("Failed to load questions", err);
        if (
          err?.message?.toLowerCase().includes("limit") ||
          err?.message?.toLowerCase().includes("quota")
        ) {
          setError("AI usage limit exceeded. Please try again later.")
        } else {
          setError("Something went wrong while generating questions.")
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [params.id]);


  // useEffect(() => { console.log("\nquestions = ", questions, "\ndecision = ", decision, "\n signals = ", signals) }, [questions, decision, signals])


  /* ---------------- HANDLERS ---------------- */
  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    })
  }

  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    try {
      if (!signals) {
        throw new Error("Signals not loaded");
      }

      let matched = 0;
      let total = 0;

      for (const q of questions) {
        const expected = signals[q.id];
        const userAnswer = answers[q.id];

        // console.log("\nOg ans = ", expected, "\nuser answer = ", userAnswer)

        if (!expected || !userAnswer) continue;

        total++;

        if (
          normalize(userAnswer).includes(normalize(expected)) ||
          normalize(expected).includes(normalize(userAnswer))
        ) {
          matched++;
        }
      }

      let finalDecision: string;

      if (matched === total && total >= 2) {
        finalDecision = "approved";
      } else if (matched >= 1) {
        finalDecision = "under_review";
      } else {
        finalDecision = "rejected";
      }

      setDecision(finalDecision);
      setIsComplete(true);
      // { ownerId && router.push(`/verification-result/${params.id}?owner=${ownerId}`) }
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  useEffect(() => {
    console.log("owner id = ", ownerId)
  }, [ownerId])

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  /* ---------------- STATES ---------------- */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-xl font-bold mb-3 text-red-500">
            Limit Exceeded
          </h2>
          <p className="text-muted-foreground mb-6">
            {error}
          </p>

          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    )
  }


  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Generating verification questions...
        </p>
      </div>
    )
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-linear-to-br from-background to-muted">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          {decision === "approved" && <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />}
          {(decision === "under_review" || decision === "rejected") && <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />}
          <h1 className="text-3xl font-bold mb-4">
            Verification Submitted
          </h1>

          <p className="text-muted-foreground mb-8 text-xl">
            {decision === "approved" &&
              "Ownership verified successfully. The item is now claimed."}
            {decision === "under_review" &&
              "Your claim is under manual review due to item sensitivity."}
            {decision === "rejected" &&
              "Verification failed."}
          </p>

          {decision == "approved" && <Button
            disabled={!ownerId}
            onClick={() => {
              if (!ownerId) return;
              router.push(`/chat/${params.id}?owner=${ownerId}`);
            }}
            className="px-8 font-semibold cursor-pointer"
          >
            Go to chat box
          </Button>}
          {
            (decision === "under_review" || decision === "rejected") && <Button
              disabled={!ownerId}
              onClick={() => {
                if (!ownerId) return;
                router.push(`/dashboard`);
              }}
              className="px-8 font-semibold cursor-pointer"
            >
              Go to dashboard
            </Button>
          }
        </div>
      </main>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  /* ---------------- MAIN UI ---------------- */
  return (
    <main className="min-h-screen bg-linear-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Verify Ownership</h1>
          </div>

          <p className="text-muted-foreground mb-6">
            Answer a few questions that only the real owner would know.
          </p>

          {/* Progress */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <Card className="p-8 rounded-2xl shadow-lg">
          <Label className="text-lg font-semibold block mb-4">
            {question?.question}
          </Label>

          <Input
            placeholder="Type your answer"
            value={answers[question?.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            className="h-12 text-base"
          />

          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1 h-12"
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[question?.id]}
              className="flex-1 h-12 font-semibold"
            >
              {currentQuestion === questions.length - 1
                ? "Submit Verification"
                : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
