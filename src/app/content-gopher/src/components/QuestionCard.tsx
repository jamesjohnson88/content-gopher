"use client"

import { createSignal, Show, For } from "solid-js"
import type { Question } from "../types/question"
import { categoryMap, difficultyMap, formatMap } from "../types/mappings"

interface QuestionCardProps {
    question: Question
    onApprove: (question: Question) => void
    onEdit: (id: string, updatedQuestion: Partial<Question>) => void
    onDiscard: (id: string) => void
    sessionCategory: string
    sessionDifficulty: string
    sessionFormat: string
}

export function QuestionCard({ question, onApprove, onEdit, onDiscard, sessionCategory, sessionDifficulty, sessionFormat }: QuestionCardProps) {
    const [isEditing, setIsEditing] = createSignal(false)
    const [editedText, setEditedText] = createSignal(question.text)
    const [editedOptions, setEditedOptions] = createSignal<string[]>(question.possibleAnswers || [])
    const [editedAnswer, setEditedAnswer] = createSignal(question.correctAnswer)
    const [editedCategory, setEditedCategory] = createSignal(question.category)
    const [editedDifficulty, setEditedDifficulty] = createSignal(question.difficulty)

    const formatDisplay = () => formatMap[sessionFormat || ''] || sessionFormat

    const handleSaveEdit = () => {
        onEdit(question.id, {
            text: editedText(),
            possibleAnswers: editedOptions(),
            correctAnswer: editedAnswer(),
            category: editedCategory(),
            difficulty: editedDifficulty(),
        })
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        setEditedText(question.text)
        setEditedOptions(question.possibleAnswers || [])
        setEditedAnswer(question.correctAnswer)
        setEditedCategory(question.category)
        setEditedDifficulty(question.difficulty)
        setIsEditing(false)
    }

    const updateOption = (index: number, value: string) => {
        const currentOptions = editedOptions()
        const newOptions = [...currentOptions]
        newOptions[index] = value
        setEditedOptions(newOptions)
    }

    const isMixedCategory = () => sessionCategory === "mixed"
    const isMixedDifficulty = () => sessionDifficulty === "mixed"

    return (
        <div class="border rounded-lg shadow-sm">
            <div class="p-6">
                <div class="flex flex-wrap gap-2 mb-4">
                    <Show when={!isEditing()} fallback={
                        <>
                            <Show when={isMixedCategory()}>
                                <select
                                    value={editedCategory()}
                                    onInput={(e) => setEditedCategory(e.target.value)}
                                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {Object.entries(categoryMap).map(([value, label]) => (
                                        <option value={value}>{label}</option>
                                    ))}
                                </select>
                            </Show>
                            <Show when={isMixedDifficulty()}>
                                <select
                                    value={editedDifficulty()}
                                    onInput={(e) => setEditedDifficulty(e.target.value)}
                                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {Object.entries(difficultyMap).map(([value, label]) => (
                                        <option value={value}>{label}</option>
                                    ))}
                                </select>
                            </Show>
                        </>
                    }>
                        <Show when={sessionFormat}>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {formatDisplay()}
                            </span>
                        </Show>
                        <Show when={question.category}>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {categoryMap[question.category] || question.category}
                            </span>
                        </Show>
                        <Show when={question.difficulty}>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {difficultyMap[question.difficulty] || question.difficulty}
                            </span>
                        </Show>
                    </Show>
                </div>
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
                            <For each={question.possibleAnswers}>
                                {(option, index) => (
                                    <div class="flex items-center gap-2">
                                        <div
                                            class={`w-6 h-6 rounded-full flex items-center justify-center ${index() + 1 === Number(question.correctAnswer)
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : "bg-gray-100 text-gray-700 border border-gray-200"
                                                }`}
                                        >
                                            {String.fromCharCode(65 + index())}
                                        </div>
                                        <span>{option}</span>
                                        <Show when={index() + 1 === Number(question.correctAnswer)}>
                                            <span class="text-green-600 text-sm ml-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block align-text-bottom" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                </svg>
                                            </span>
                                        </Show>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>

                    <Show when={isEditing()}>
                        <div class="space-y-2">
                            <For each={editedOptions()}>
                                {(option, index) => (
                                    <div class="flex items-center gap-2">
                                        <div
                                            class={`w-6 h-6 rounded-full flex items-center justify-center ${index() + 1 === Number(editedAnswer())
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : "bg-gray-100 text-gray-700 border border-gray-200"
                                                }`}
                                        >
                                            {String.fromCharCode(65 + index())}
                                        </div>
                                        <div class="relative flex-grow flex items-center">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(index(), e.target.value)}
                                                disabled={index() + 1 === Number(editedAnswer())}
                                                class={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${index() + 1 === Number(editedAnswer()) ? "bg-gray-50 cursor-not-allowed pr-8" : ""
                                                    }`}
                                            />
                                            <Show when={index() + 1 === Number(editedAnswer())}>
                                                <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-green-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                            </Show>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </div>
            <div class="px-6 py-3 bg-gray-50 rounded-b-lg flex items-center justify-between">
                <div class="flex items-center gap-2">
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
                            </>
                        }
                    >
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
                    </Show>
                </div>
                <div class="flex items-center gap-2">
                    <Show when={!isEditing()}>
                        <button
                            class="text-red-600 hover:text-red-800 border border-red-300 bg-white hover:bg-red-50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
                            onClick={() => onDiscard(question.id)}
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Discard
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
                    </Show>
                </div>
            </div>
        </div>
    )
}