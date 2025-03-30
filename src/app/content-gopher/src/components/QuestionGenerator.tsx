"use client"

import { createSignal } from "solid-js"

interface QuestionGeneratorProps {
    onGenerate: () => void
    isGenerating: boolean
}

export function QuestionGenerator({ onGenerate, isGenerating }: QuestionGeneratorProps) {
    const [prompt, setPrompt] = createSignal("")

    return (
        <div class="border rounded-lg shadow-sm">
            <div class="p-6">
                <h2 class="text-xl font-semibold">Generate Questions</h2>
                <div class="mt-4 space-y-4">
                    <div class="space-y-2">
                        <label for="prompt" class="block text-sm font-medium text-gray-700">
                            Custom Prompt (Optional)
                        </label>
                        <textarea
                            id="prompt"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add specific instructions for the AI, e.g., 'Generate questions about the solar system' or 'Focus on European history from 1900-1950'"
                            value={prompt()}
                            onInput={(e) => setPrompt(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>
            </div>
            <div class="px-6 py-4 pt-0 bg-gray-50 rounded-b-lg">
                <button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <svg
                                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        <>
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Generate Questions
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

