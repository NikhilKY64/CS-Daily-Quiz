"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, Trophy, Play, Clock, Flame } from "lucide-react"
import { DailyQuiz } from "@/components/daily-quiz"
import { ProgressTracking } from "@/components/progress-tracking"
import { Leaderboard } from "@/components/leaderboard"
import { getStudentData, canTakeQuizToday, type QuizResult } from "@/lib/student-storage"

interface StudentDashboardProps {
  quizTitle: string
}

export function StudentDashboard({ quizTitle }: StudentDashboardProps) {
  const [studentData, setStudentData] = useState({
    totalPoints: 0,
    currentStreak: 0,
    lastAttemptDate: null as string | null,
    todayCompleted: false,
  })
  const [showQuiz, setShowQuiz] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const loadStudentData = () => {
    const data = getStudentData()
    setStudentData({
      totalPoints: data.totalPoints,
      currentStreak: data.currentStreak,
      lastAttemptDate: data.lastAttemptDate,
      todayCompleted: data.todayCompleted,
    })
  }

  useEffect(() => {
    loadStudentData()
  }, [])

  const handleStartQuiz = () => {
    setShowQuiz(true)
  }

  const handleQuizComplete = (result: QuizResult) => {
    setShowQuiz(false)
    loadStudentData() // Refresh student data
  }

  const handleQuizExit = () => {
    setShowQuiz(false)
  }

  const handleShowProgress = () => {
    setShowProgress(true)
  }

  const handleBackFromProgress = () => {
    setShowProgress(false)
  }

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true)
  }

  const handleBackFromLeaderboard = () => {
    setShowLeaderboard(false)
  }

  const canTakeQuiz = canTakeQuizToday()

  if (showLeaderboard) {
    return <Leaderboard onBack={handleBackFromLeaderboard} userRole="student" />
  }

  if (showProgress) {
    return <ProgressTracking onBack={handleBackFromProgress} />
  }

  if (showQuiz) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Daily Quiz</h2>
          <p className="text-muted-foreground">Answer all questions to complete today's challenge</p>
        </div>
        <DailyQuiz onComplete={handleQuizComplete} onExit={handleQuizExit} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Welcome Back!</h2>
        <p className="text-muted-foreground">Ready for today's challenge?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{studentData.totalPoints}</div>
            <p className="text-xs text-muted-foreground">Keep learning!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{studentData.currentStreak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Attempt</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentData.lastAttemptDate ? new Date(studentData.lastAttemptDate).toLocaleDateString() : "Never"}
            </div>
            <p className="text-xs text-muted-foreground">
              {studentData.todayCompleted ? "Completed today!" : "Ready to start"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Quiz Section */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Today's Quiz
          </CardTitle>
          <CardDescription>Answer 5 random questions to earn points and maintain your streak</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Daily Challenge</p>
              <p className="text-xs text-muted-foreground">5 multiple choice questions</p>
            </div>
            <Badge variant={canTakeQuiz ? "default" : "secondary"}>{canTakeQuiz ? "Available" : "Completed"}</Badge>
          </div>

          <Button className="w-full" disabled={!canTakeQuiz} size="lg" onClick={handleStartQuiz}>
            <Play className="h-4 w-4 mr-2" />
            {canTakeQuiz ? "Start Daily Quiz" : "Quiz Completed Today"}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">See how you rank against other students</p>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleShowLeaderboard}>
              View Rankings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Track your learning journey</p>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleShowProgress}>
              View History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
