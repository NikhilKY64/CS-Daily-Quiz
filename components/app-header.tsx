"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { StudentProgress } from "@/lib/student-storage"

interface AppHeaderProps {
  userRole: "student" | "teacher"
  onRoleChange: (role: "student" | "teacher") => void
  quizTitle: string
  onTitleChange: (title: string) => void
  currentStudent?: StudentProgress | null
  onBackToSelection?: () => void
}

export function AppHeader({ userRole, onRoleChange, quizTitle, currentStudent, onBackToSelection }: AppHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userRole === "student" && currentStudent && onBackToSelection && (
              <Button variant="ghost" size="sm" onClick={onBackToSelection}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">{quizTitle}</h1>
                <p className="text-sm text-muted-foreground">
                  {userRole === "student" && currentStudent
                    ? `Welcome back, ${currentStudent.studentName}!`
                    : "Daily Learning Challenge"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={userRole === "student" ? "default" : "secondary"}>
              {userRole === "student" ? "Student Mode" : "Teacher Mode"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRoleChange("student")}>Switch to Student</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRoleChange("teacher")}>Switch to Teacher</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
