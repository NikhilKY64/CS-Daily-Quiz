"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { StudentDashboard } from "@/components/student-dashboard"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { StudentSelector } from "@/components/student-selector"
import type { StudentProgress } from "@/lib/student-storage"

type UserRole = "student" | "teacher"

export default function HomePage() {
  const [userRole, setUserRole] = useState<UserRole>("student")
  const [quizTitle, setQuizTitle] = useState("CS Daily MCQ Quiz")
  const [currentStudent, setCurrentStudent] = useState<StudentProgress | null>(null)
  const [studentSelected, setStudentSelected] = useState(false)

  const handleStudentSelected = (student: StudentProgress) => {
    setCurrentStudent(student)
    setStudentSelected(true)
  }

  const handleBackToSelection = () => {
    setStudentSelected(false)
    setCurrentStudent(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        userRole={userRole}
        onRoleChange={setUserRole}
        quizTitle={quizTitle}
        onTitleChange={setQuizTitle}
        currentStudent={currentStudent}
        onBackToSelection={userRole === "student" ? handleBackToSelection : undefined}
      />

      <main className="container mx-auto px-4 py-8">
        {userRole === "student" ? (
          !studentSelected ? (
            <StudentSelector onStudentSelected={handleStudentSelected} />
          ) : (
            <StudentDashboard quizTitle={quizTitle} currentStudent={currentStudent} />
          )
        ) : (
          <TeacherDashboard quizTitle={quizTitle} onTitleChange={setQuizTitle} />
        )}
      </main>
    </div>
  )
}
