"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export default function VerifyOwnershipPage() {
  const router = useRouter()
  const params = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  // Mock verification questions
  const questions = [
    {
      id: 1,
      type: "text",
      question: "What is your full name as it appears on your ID?",
      placeholder: "Enter your full name",
    },
    {
      id: 2,
      type: "text",
      question: "What was the main color of the wallet?",
      placeholder: "e.g., Black, Brown, etc.",
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "How much cash do you think was inside?",
      options: [
        { label: "Less than $20", value: "less20" },
        { label: "$20 - $50", value: "20to50" },
        { label: "$50 - $100", value: "50to100" },
        { label: "More than $100", value: "more100" },
        { label: "No cash / I don't remember", value: "nocash" },
      ],
    },
    {
      id: 4,
      type: "text",
      question: "Do you have any distinctive marks or items inside? (Optional)",
      placeholder: "e.g., Business cards, photos, etc.",
      optional: true,
    },
  ]

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (isComplete) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <header className="bg-white dark:bg-card border-b border-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Verification Submitted</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're reviewing your answers. You'll be notified when the owner confirms.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Card className="p-6 rounded-2xl border-0 shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-lg font-semibold text-foreground">Pending Review</p>
            </Card>
            <Card className="p-6 rounded-2xl border-0 shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Match ID</p>
              <p className="text-lg font-semibold text-foreground font-mono">#ML{params.id}</p>
            </Card>
          </div>

          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold px-8"
          >
            Return to Dashboard
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Verify Ownership</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Answer a few questions only the real owner would know. Your answers are secure and private.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <Card className="p-8 rounded-2xl border-0 shadow-lg">
          <div className="mb-8">
            <Label className="text-lg font-semibold text-foreground block mb-4">{question.question}</Label>

            {question.type === "text" && (
              <Input
                type="text"
                placeholder={question.placeholder}
                value={answers[currentQuestion] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="rounded-lg h-12 text-base"
              />
            )}

            {question.type === "multiple-choice" && (
              <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswer}>
                <div className="space-y-3">
                  {question.options?.map((option) => (
                    <div key={option.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="cursor-pointer text-foreground font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex-1 rounded-lg h-12 font-semibold bg-transparent"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion] && !question.optional}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 font-semibold"
            >
              {currentQuestion === questions.length - 1 ? "Submit Verification" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
