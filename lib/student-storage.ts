export interface StudentProgress {
  studentId: string
  studentName: string
  totalPoints: number
  currentStreak: number
  lastAttemptDate: string | null
  todayCompleted: boolean
  quizHistory: QuizResult[]
}

export interface QuizResult {
  date: string
  score: number
  totalQuestions: number
  timeSpent: number
  questions: QuizQuestionResult[]
}

export interface QuizQuestionResult {
  questionId: string
  question: string
  selectedAnswer: number
  correctAnswer: number
  isCorrect: boolean
  timeSpent: number
}

const STUDENT_DATA_KEY = "studentData"
const ALL_STUDENTS_KEY = "allStudents"

export function getCurrentStudentId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("currentStudentId")
}

export function setCurrentStudent(studentId: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("currentStudentId", studentId)
}

export function getStudentData(): StudentProgress {
  if (typeof window === "undefined") {
    return {
      studentId: "default",
      studentName: "Student",
      totalPoints: 0,
      currentStreak: 0,
      lastAttemptDate: null,
      todayCompleted: false,
      quizHistory: [],
    }
  }

  const currentStudentId = getCurrentStudentId()

  if (currentStudentId) {
    const allStudents = getAllStudents()
    const currentStudent = allStudents.find((s) => s.studentId === currentStudentId)
    if (currentStudent) {
      return currentStudent
    }
  }

  const stored = localStorage.getItem(STUDENT_DATA_KEY)
  if (stored) {
    const legacyData = JSON.parse(stored)
    setCurrentStudent(legacyData.studentId)
    return legacyData
  }

  // Create default student data
  const defaultData: StudentProgress = {
    studentId: crypto.randomUUID(),
    studentName: "Student",
    totalPoints: 0,
    currentStreak: 0,
    lastAttemptDate: null,
    todayCompleted: false,
    quizHistory: [],
  }

  saveStudentData(defaultData)
  setCurrentStudent(defaultData.studentId)
  return defaultData
}

export function saveStudentData(data: StudentProgress): void {
  if (typeof window === "undefined") return

  localStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(data))

  // Update all students list
  const allStudents = getAllStudents()
  const existingIndex = allStudents.findIndex((s) => s.studentId === data.studentId)

  if (existingIndex >= 0) {
    allStudents[existingIndex] = data
  } else {
    allStudents.push(data)
  }

  localStorage.setItem(ALL_STUDENTS_KEY, JSON.stringify(allStudents))
}

export function getAllStudents(): StudentProgress[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(ALL_STUDENTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function canTakeQuizToday(): boolean {
  const studentData = getStudentData()
  const today = new Date().toDateString()
  return !studentData.todayCompleted || studentData.lastAttemptDate !== today
}

export function completeQuiz(result: QuizResult): StudentProgress {
  const studentData = getStudentData()
  const today = new Date().toDateString()

  // Calculate points (1 point per correct answer)
  const pointsEarned = result.score

  // Update streak
  let newStreak = studentData.currentStreak
  if (studentData.lastAttemptDate) {
    const lastDate = new Date(studentData.lastAttemptDate)
    const todayDate = new Date()
    const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      // Consecutive day
      newStreak += 1
    } else if (daysDiff > 1) {
      // Streak broken
      newStreak = 1
    }
    // If daysDiff === 0, it's the same day (shouldn't happen with our logic)
  } else {
    // First quiz ever
    newStreak = 1
  }

  const updatedData: StudentProgress = {
    ...studentData,
    totalPoints: studentData.totalPoints + pointsEarned,
    currentStreak: newStreak,
    lastAttemptDate: today,
    todayCompleted: true,
    quizHistory: [...studentData.quizHistory, result],
  }

  saveStudentData(updatedData)
  return updatedData
}

export function createNewStudent(name: string): StudentProgress {
  const newStudent: StudentProgress = {
    studentId: crypto.randomUUID(),
    studentName: name,
    totalPoints: 0,
    currentStreak: 0,
    lastAttemptDate: null,
    todayCompleted: false,
    quizHistory: [],
  }

  saveStudentData(newStudent)
  setCurrentStudent(newStudent.studentId)
  return newStudent
}

export function deleteStudent(studentId: string): void {
  if (typeof window === "undefined") return

  const allStudents = getAllStudents()
  const updatedStudents = allStudents.filter((s) => s.studentId !== studentId)
  localStorage.setItem(ALL_STUDENTS_KEY, JSON.stringify(updatedStudents))

  // If deleting current student, clear current student
  if (getCurrentStudentId() === studentId) {
    localStorage.removeItem("currentStudentId")
  }
}
