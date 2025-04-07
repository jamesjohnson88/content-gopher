// todo - change to MCQ
export interface Question {
    id: string
    text: string
    possibleAnswers: string[]
    correctAnswer: string
    category: string
    difficulty: string
}