"use client"

import { createSignal } from "solid-js"
import { Show } from "solid-js"

interface QuestionGeneratorProps {
    onGenerate: (prompt: string) => void
    isGenerating: () => boolean
    generatedCount: () => number
}

export function QuestionGenerator({ onGenerate, isGenerating, generatedCount }: QuestionGeneratorProps) {
    const [prompt, setPrompt] = createSignal("")
    const MAX_QUESTIONS = 30

    return (
        <div class="border rounded-lg shadow-sm relative overflow-hidden">
            <Show when={isGenerating()}>
                <div class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80">
                    <div class="text-center">
                        <svg
                            class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
                        <p class="text-gray-700 font-medium text-lg">Generating questions...</p>
                        <p class="text-gray-600 text-sm mt-2">This may take a few moments</p>
                    </div>
                </div>
            </Show>

            <Show
                when={generatedCount() < MAX_QUESTIONS}
                fallback={
                    <div class="p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p class="text-gray-700 font-medium text-lg">Question pool is full ({generatedCount()}/{MAX_QUESTIONS}).</p>
                        <p class="text-gray-600 text-sm mt-2">Please approve or discard some questions before generating more.</p>
                    </div>
                }
            >
                <div class="p-6">
                    <h2 class="text-xl font-semibold">Generate Questions</h2>
                    <div class="mt-4 space-y-4">
                        <div class="space-y-2">
                            <label for="prompt" class="block text-sm font-medium text-gray-700">
                                Custom Prompt (Optional)
                            </label>
                            <textarea
                                id="prompt"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                placeholder="Add specific instructions for the AI, e.g., 'Generate questions about the solar system' or 'Focus on European history from 1900-1950'"
                                value={prompt()}
                                onInput={(e) => setPrompt(e.target.value)}
                                rows={3}
                                disabled={isGenerating()}
                            />
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-6">
                    <button
                        onClick={() => onGenerate(prompt())}
                        disabled={isGenerating()}
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all duration-200 relative overflow-hidden"
                    >
                        {isGenerating() ? (
                            <>
                                <span class="relative z-10">Generating Questions...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
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
            </Show>
        </div>
    )
}

