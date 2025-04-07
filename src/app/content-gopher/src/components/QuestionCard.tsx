"use client"

import { createSignal, Show, For } from "solid-js"
import type { Question } from "../types/question"

interface QuestionCardProps {
    question: Question
    onApprove: (question: Question) => void
    onEdit: (id: string, updatedQuestion: Partial<Question>) => void
}

export function QuestionCard({ question, onApprove, onEdit }: QuestionCardProps) {
    const [isEditing, setIsEditing] = createSignal(false)
    const [editedText, setEditedText] = createSignal(question.text)
    const [editedOptions, setEditedOptions] = createSignal<string[]>(question.possibleAnswers || [])
    const [editedAnswer, setEditedAnswer] = createSignal(question.correctAnswer)

    const handleSaveEdit = () => {
        onEdit(question.id, {
            text: editedText(),
            possibleAnswers: editedOptions(),
            correctAnswer: editedAnswer(),
        })
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        setEditedText(question.text)
        setEditedOptions(question.possibleAnswers || [])
        setEditedAnswer(question.correctAnswer)
        setIsEditing(false)
    }

    const updateOption = (index: number, value: string) => {
        const newOptions = [...editedOptions()]
        newOptions[index] = value
        setEditedOptions(newOptions)
    }

    return (
        <div class="border rounded-lg shadow-sm">
            <div class="p-6">
                <h3 class="text-lg font-medium">
                    <Show when={isEditing()} fallback={question.text}>
            <textarea
                value={editedText()}
                onInput={(e) => setEditedText(e.target.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
                    </Show>
                </h3>
                <div class="mt-4">
                    <Show when={!isEditing()}>
                        <div class="space-y-2">
                            {/* Convert the object to an array of entries and sort by key */}
                            <For each={Object.entries(question.possibleAnswers || {}).sort((a, b) => Number(a[0]) - Number(b[0]))}>
                                {(entry, index) => {
                                    const [key, option] = entry;
                                    return (
                                        <div class="flex items-center gap-2">
                                            <div
                                                class={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    index() + 1 === Number(question.correctAnswer)
                                                        ? "bg-green-100 text-green-700 border border-green-200"
                                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                                }`}
                                            >
                                                {String.fromCharCode(65 + index())}
                                            </div>
                                            <span>{option}</span>
                                            <Show when={index() + 1 === Number(question.correctAnswer)}>
                                                <span class="text-green-600 text-sm ml-2">(Correct)</span>
                                            </Show>

                                        </div>
                                    );
                                }}
                            </For>
                        </div>
                    </Show>

                    <Show when={isEditing()}>
                        <div class="space-y-2">
                            <For each={question.possibleAnswers}>
                                {(option, index) => (
                                    <div class="flex items-center gap-2">
                                        <div
                                            class={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                index() + 1 === Number(question.correctAnswer)
                                                    ? "bg-green-100 text-green-700 border border-green-200"
                                                    : "bg-gray-100 text-gray-700 border border-gray-200"
                                            }`}
                                        >
                                            {String.fromCharCode(65 + index())}
                                        </div>
                                        <span>{option}</span>
                                        <Show when={index() + 1 === Number(question.correctAnswer)}>
                                            <span class="text-green-600 text-sm ml-2">(Correct)</span>
                                        </Show>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t rounded-b-lg flex justify-between">
                <Show
                    when={isEditing()}
                    fallback={
                        <>
                            <button
                                class="text-gray-700 hover:text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
                                onClick={() => setIsEditing(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                                Edit
                            </button>
                            <button
                                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
                                onClick={() => onApprove(question)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Approve
                            </button>
                        </>
                    }
                >
                    <>
                        <button
                            class="text-gray-700 hover:text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
                            onClick={handleCancelEdit}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                        <button
                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1"
                            onClick={handleSaveEdit}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                        </button>
                    </>
                </Show>
            </div>
        </div>
    )
}