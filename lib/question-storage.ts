import type { Question } from "./types"

const QUESTION_BANK_KEY = "questionBank"
const QUIZ_METADATA_KEY = "quizMetadata"

export function getQuestionBank(): Question[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(QUESTION_BANK_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveQuestionBank(questions: Question[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(questions))

  // Update metadata
  const metadata = getQuizMetadata()
  metadata.updatedAt = new Date().toISOString()
  localStorage.setItem(QUIZ_METADATA_KEY, JSON.stringify(metadata))
}

export function getQuizMetadata() {
  if (typeof window === "undefined")
    return { title: "CS Daily MCQ Quiz", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  const stored = localStorage.getItem(QUIZ_METADATA_KEY)
  return stored
    ? JSON.parse(stored)
    : { title: "CS Daily MCQ Quiz", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
}

export function addQuestion(question: Omit<Question, "id" | "createdAt" | "updatedAt">): Question {
  const questions = getQuestionBank()
  const newQuestion: Question = {
    ...question,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  questions.push(newQuestion)
  saveQuestionBank(questions)
  return newQuestion
}

export function updateQuestion(id: string, updates: Partial<Omit<Question, "id" | "createdAt">>): Question | null {
  const questions = getQuestionBank()
  const index = questions.findIndex((q) => q.id === id)

  if (index === -1) return null

  questions[index] = {
    ...questions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  saveQuestionBank(questions)
  return questions[index]
}

export function deleteQuestion(id: string): boolean {
  const questions = getQuestionBank()
  const filteredQuestions = questions.filter((q) => q.id !== id)

  if (filteredQuestions.length === questions.length) return false

  saveQuestionBank(filteredQuestions)
  return true
}

export function getRandomQuestions(count: number): Question[] {
  const questions = getQuestionBank()
  if (questions.length <= count) return questions

  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
