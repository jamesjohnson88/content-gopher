import {createSignal, createEffect, Show, For, Component} from "solid-js"
import {useSearchParams} from "@solidjs/router"
import {QuestionGenerator} from "../../components/QuestionGenerator"
import {QuestionCard} from "../../components/QuestionCard"
import {generateMockQuestions} from "../../lib/mock-data"
import {Question} from "../../types/question";

const MultipleChoiceQuestions: Component = () => {

    // todo - need to fetch these from session response
    const [searchParams] = useSearchParams()
    const sessionName = () => searchParams.name || "Untitled Session"
    const category = () => searchParams.category || "Mixed"
    const difficulty = () => searchParams.difficulty || "Mixed"
    const format = () => searchParams.format || "Multiple Choice Question"

    const [generatedQuestions, setGeneratedQuestions] = createSignal<Question[]>([])
    const [approvedQuestions, setApprovedQuestions] = createSignal<Question[]>([])
    const [isGenerating, setIsGenerating] = createSignal(false)
    const [exportSuccess, setExportSuccess] = createSignal(false)
    const [activeTab, setActiveTab] = createSignal("generate")

    // Generate initial questions
    createEffect(() => {
        handleGenerateQuestions()
    })

    const handleGenerateQuestions = () => {
        setIsGenerating(true)

        // Simulate API call to generate questions
        setTimeout(() => {
            const mockQuestions = generateMockQuestions("general", "easy", 3)
            setGeneratedQuestions(mockQuestions)
            setIsGenerating(false)
        }, 2500)
    }

    const handleApproveQuestion = (question: Question) => {
        setApprovedQuestions([...approvedQuestions(), question])
        setGeneratedQuestions(generatedQuestions().filter((q) => q.id !== question.id))
    }

    const handleEditQuestion = (id: string, updatedQuestion: Partial<Question>) => {
        setGeneratedQuestions(generatedQuestions().map((q) => (q.id === id ? {...q, ...updatedQuestion} : q)))
    }

    const handleRemoveApproved = (id: string) => {
        setApprovedQuestions(approvedQuestions().filter((q) => q.id !== id))
    }

    const handleExport = () => {
        // In a real app, this would call the backend API to save the JSON
        // For now, we'll just show a success message
        setExportSuccess(true)
        setTimeout(() => setExportSuccess(false), 3000)
    }

    return (
        <main class="container mx-auto py-6 px-4 flex-grow">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 class="text-3xl font-bold">{sessionName()}</h1>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <Show when={category()}>
                          <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Category: {category()}
                          </span>
                        </Show>
                        <Show when={difficulty()}>
                          <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Difficulty: {difficulty()}
                          </span>
                        </Show>
                        <Show when={format()}>
                          <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {format()}
                          </span>
                        </Show>
                    </div>
                </div>
                <button
                    class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
                    onClick={handleExport}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                    </svg>
                    Export Session
                </button>
            </div>

            <Show when={exportSuccess()}>
                <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-6">
                    <div class="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span class="font-medium">Success!</span>
                    </div>
                    <span class="block sm:inline ml-7">Your session has been exported successfully.</span>
                </div>
            </Show>

            <div class="mb-6">
                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8">
                        <button
                            class={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab() === "generate"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("generate")}
                        >
                            Generate Questions
                        </button>
                        <button
                            class={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                activeTab() === "approved"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("approved")}
                        >
                            Approved Questions
                            <Show when={approvedQuestions().length > 0}>
                <span class="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {approvedQuestions().length}
                </span>
                            </Show>
                        </button>
                    </nav>
                </div>
            </div>

            <Show when={activeTab() === "generate"}>
                <div class="space-y-6">
                    <QuestionGenerator onGenerate={handleGenerateQuestions} isGenerating={isGenerating()}/>

                    <Show
                        when={generatedQuestions().length > 0}
                        fallback={
                            <Show when={!isGenerating()}>
                                <div class="border rounded-lg p-8 text-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="mx-auto h-12 w-12 text-gray-400 mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p class="text-gray-500">No questions generated yet. Click the button above to
                                        generate questions.</p>
                                </div>
                            </Show>
                        }
                    >
                        <div class="space-y-4">
                            <For each={generatedQuestions()}>
                                {(question) => (
                                    <QuestionCard
                                        question={question}
                                        onApprove={handleApproveQuestion}
                                        onEdit={handleEditQuestion}/>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </Show>

            <Show when={activeTab() === "approved"}>
                <Show
                    when={approvedQuestions().length > 0}
                    fallback={
                        <div class="border rounded-lg p-8 text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="mx-auto h-12 w-12 text-gray-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p class="text-gray-500">No approved questions yet. Generate and approve questions to
                                see them here.</p>
                        </div>
                    }
                >
                    <div class="space-y-4">
                        <For each={approvedQuestions()}>
                            {(question) => (
                                <div class="border rounded-lg shadow-sm">
                                    <div class="p-6">
                                        <h3 class="text-lg font-medium">{question.text}</h3>
                                        <div class="mt-4">
                                            <Show when={question.type === "multiple-choice"}>
                                                <div class="space-y-2">
                                                    <For each={question.options}>
                                                        {(option, index) => (
                                                            <div class="flex items-center gap-2">
                                                                <div
                                                                    class={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                                        option === question.correctAnswer
                                                                            ? "bg-green-100 text-green-700 border border-green-200"
                                                                            : "bg-gray-100 text-gray-700 border border-gray-200"
                                                                    }`}
                                                                >
                                                                    {String.fromCharCode(65 + index())}
                                                                </div>
                                                                <span>{option}</span>
                                                                <Show when={option === question.correctAnswer}>
                                  <span
                                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    Correct
                                  </span>
                                                                </Show>
                                                            </div>
                                                        )}
                                                    </For>
                                                </div>
                                            </Show>

                                            <Show when={question.type === "true-false"}>
                                                <div class="space-y-2">
                                                    <div
                                                        class={`flex items-center gap-2 ${
                                                            question.correctAnswer === "True" ? "text-green-700" : "text-gray-700"
                                                        }`}
                                                    >
                                                        <div
                                                            class={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                                question.correctAnswer === "True"
                                                                    ? "bg-green-100 border border-green-200"
                                                                    : "bg-gray-100 border border-gray-200"
                                                            }`}
                                                        >
                                                            T
                                                        </div>
                                                        <span>True</span>
                                                        <Show when={question.correctAnswer === "True"}>
                              <span
                                  class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                Correct
                              </span>
                                                        </Show>
                                                    </div>
                                                    <div
                                                        class={`flex items-center gap-2 ${
                                                            question.correctAnswer === "False" ? "text-green-700" : "text-gray-700"
                                                        }`}
                                                    >
                                                        <div
                                                            class={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                                question.correctAnswer === "False"
                                                                    ? "bg-green-100 border border-green-200"
                                                                    : "bg-gray-100 border border-gray-200"
                                                            }`}
                                                        >
                                                            F
                                                        </div>
                                                        <span>False</span>
                                                        <Show when={question.correctAnswer === "False"}>
                              <span
                                  class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                Correct
                              </span>
                                                        </Show>
                                                    </div>
                                                </div>
                                            </Show>

                                            <Show when={question.type === "higher-lower"}>
                                                <div class="mt-2">
                          <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Answer: {question.correctAnswer}
                          </span>
                                                </div>
                                            </Show>
                                        </div>
                                    </div>
                                    <div class="px-6 py-3 bg-gray-50 rounded-b-lg">
                                        <button
                                            class="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                            onClick={() => handleRemoveApproved(question.id)}
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
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </Show>
        </main>
    );
};

export default MultipleChoiceQuestions;