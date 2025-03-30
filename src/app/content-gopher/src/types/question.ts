export type QuestionType = "multiple-choice" | "true-false" | "higher-lower"

export interface Question {
    id: string
    text: string
    type: QuestionType
    options?: string[]
    correctAnswer: string
    category: string
    difficulty: string
    session?: string
}