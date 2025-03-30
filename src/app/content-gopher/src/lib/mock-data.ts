import type { Question } from "../types/question"

// Helper function to generate a random ID
function generateId(): string {
    return Math.random().toString(36).substring(2, 15)
}

// Mock data generator for questions
export function generateMockQuestions(
    category: string,
    difficulty: string,
    count: number,
): Question[] {
    const questions: Question[] = []

    const questionTypes = {
        "multiple-choice": [
            {
                text: "What is the largest planet in our solar system?",
                options: ["Earth", "Jupiter", "Saturn", "Mars"],
                correctAnswer: "Jupiter",
            },
            {
                text: "Which element has the chemical symbol 'O'?",
                options: ["Oxygen", "Gold", "Iron", "Osmium"],
                correctAnswer: "Oxygen",
            },
            {
                text: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                correctAnswer: "William Shakespeare",
            },
            {
                text: "What is the capital of Japan?",
                options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
                correctAnswer: "Tokyo",
            },
            {
                text: "Which of these is not a programming language?",
                options: ["Java", "Python", "Cobra", "Dolphin"],
                correctAnswer: "Dolphin",
            },
        ],
    }

    const questionPool = questionTypes["multiple-choice"]

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * 5)
        const baseQuestion = questionPool[randomIndex]

        const question: Question = {
            id: generateId(),
            text: baseQuestion.text,
            type: "multiple-choice",
            correctAnswer: baseQuestion.correctAnswer,
            category: category,
            difficulty: difficulty,
            options: (baseQuestion as any).options,
        }

        questions.push(question)
    }

    return questions
}