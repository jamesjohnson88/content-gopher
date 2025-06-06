import { Component, createSignal, For, Show, createEffect } from "solid-js"
import { useSearchParams } from "@solidjs/router"
import { QuestionGenerator } from "../../components/QuestionGenerator"
import { QuestionCard } from "../../components/QuestionCard"
import { Question } from "../../types/question"
import { categoryMap, difficultyMap, formatMap } from "../../types/mappings"
import { generateSessionKey } from "../../utils/sessionKeys"
import { getApiUrl } from '../../config'

const MultipleChoiceQuestions: Component = () => {
    const [searchParams] = useSearchParams();
    const [sessionName, setSessionName] = createSignal(searchParams.name?.toString() || '');
    const [category, setCategory] = createSignal(searchParams.category?.toString() || '');
    const [difficulty, setDifficulty] = createSignal(searchParams.difficulty?.toString() || '');
    const [formatParam, setFormatParam] = createSignal(searchParams.format?.toString() || '');
    const [isEditMode, setIsEditMode] = createSignal(searchParams.edit?.toString() === 'true');
    const [editFilename, setEditFilename] = createSignal(searchParams.filename?.toString() || '');

    const categoryDisplay = () => categoryMap[category() || ''] || category()
    const difficultyDisplay = () => difficultyMap[difficulty() || ''] || difficulty()
    const formatDisplay = () => formatMap[formatParam() || ''] || formatParam()

    // State management
    const getSessionKey = () => {
        return generateSessionKey({
            sessionName: sessionName(),
            category: category(),
            difficulty: difficulty(),
            format: formatParam()
        });
    }

    const initialQuestions = (() => {
        const savedQuestions = localStorage.getItem(getSessionKey())
        if (savedQuestions) {
            try {
                return JSON.parse(savedQuestions) as { generated: Question[], approved: Question[] }
            } catch (e) {
                console.error('Error parsing saved questions:', e)
            }
        }
        return {
            generated: [],
            approved: []
        }
    })()

    const [questions, setQuestions] = createSignal<{
        generated: Question[],
        approved: Question[]
    }>(initialQuestions)
    const [isGenerating, setIsGenerating] = createSignal(false)
    const [exportSuccess, setExportSuccess] = createSignal(false)
    const [exportError, setExportError] = createSignal<string | null>(null)
    const [activeTab, setActiveTab] = createSignal("generate")
    const [showExportOptions, setShowExportOptions] = createSignal(false)

    // Save to localStorage whenever questions change
    const saveQuestions = (newQuestions: { generated: Question[], approved: Question[] }) => {
        localStorage.setItem(getSessionKey(), JSON.stringify(newQuestions))
    }

    async function handleGenerateQuestions(prompt: string): Promise<void> {
        if (isGenerating()) return

        // Check if we've reached the 30 question limit
        if (questions().generated.length >= 30) {
            return
        }

        setIsGenerating(true)
        try {
            const response = await fetch(getApiUrl('content/multiple-choice-question/fetch'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category: category(),
                    difficulty: difficulty(),
                    additionalInfo: prompt
                })
            })

            if (!response.ok) throw new Error("Could not fetch data")

            const rawData = await response.json()
            const newQuestions = rawData.map((q: Question): Question => ({
                ...q,
                possibleAnswers: Object.entries(q.possibleAnswers || {})
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([, value]) => value),
            }))

            const updatedQuestions = {
                ...questions(),
                generated: [...questions().generated, ...newQuestions]
            }
            setQuestions(updatedQuestions)
            saveQuestions(updatedQuestions)
        } catch (error) {
            console.error('Error generating questions:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    // Question management
    const handleApproveQuestion = (question: Question) => {
        const currentGenerated = questions().generated
        const currentApproved = questions().approved

        const questionIndex = currentGenerated.findIndex(q => q.id === question.id)

        if (questionIndex === -1) {
            console.error('Question not found:', question)
            return
        }

        const newGenerated = [...currentGenerated]
        const [approvedQuestion] = newGenerated.splice(questionIndex, 1)
        const newApproved = [...currentApproved, approvedQuestion]

        const newQuestions = {
            generated: newGenerated,
            approved: newApproved
        }
        setQuestions(newQuestions)
        saveQuestions(newQuestions)
    }

    const handleEditQuestion = (id: string, updatedQuestion: Partial<Question>) => {
        const currentGenerated = questions().generated
        const newGenerated = currentGenerated.map(q =>
            q.id === id ? { ...q, ...updatedQuestion } : q
        )

        const newQuestions = {
            ...questions(),
            generated: newGenerated
        }
        setQuestions(newQuestions)
        saveQuestions(newQuestions)
    }

    const handleRemoveApproved = (id: string) => {
        const currentApproved = questions().approved
        const newApproved = currentApproved.filter(q => q.id !== id)

        const newQuestions = {
            ...questions(),
            approved: newApproved
        }
        setQuestions(newQuestions)
        saveQuestions(newQuestions)
    }

    const handleDiscardQuestion = (id: string) => {
        const currentGenerated = questions().generated
        const newGenerated = currentGenerated.filter(q => q.id !== id)

        const newQuestions = {
            ...questions(),
            generated: newGenerated
        }
        setQuestions(newQuestions)
        saveQuestions(newQuestions)
    }

    // Function to send an approved question back to the generated pool
    const handleSendBackToPool = (question: Question) => {
        const currentApproved = questions().approved
        const currentGenerated = questions().generated

        const questionIndex = currentApproved.findIndex(q => q.id === question.id)

        if (questionIndex === -1) {
            console.error('Approved question not found:', question)
            return
        }

        const newApproved = [...currentApproved]
        const [sentBackQuestion] = newApproved.splice(questionIndex, 1)
        const newGenerated = [...currentGenerated, sentBackQuestion]

        const newQuestions = {
            generated: newGenerated,
            approved: newApproved
        }
        setQuestions(newQuestions)
        saveQuestions(newQuestions)
    }

    // Memoize the generated questions list to prevent unnecessary re-renders
    const generatedQuestions = () => questions().generated
    const approvedQuestions = () => questions().approved

    // Load existing questions if in edit mode
    createEffect(async () => {
        if (isEditMode() && editFilename()) {
            try {
                const response = await fetch(getApiUrl(`sessions/${editFilename()}`));
                if (!response.ok) throw new Error('Failed to fetch session data');
                const data = await response.json();

                // Add existing questions to the approved list
                setQuestions(prev => ({
                    ...prev,
                    approved: data.questions.map((q: any) => ({
                        id: crypto.randomUUID(),
                        text: q.text,
                        possibleAnswers: q.possibleAnswers,
                        correctAnswer: q.correctAnswer,
                        category: q.category,
                        difficulty: q.difficulty,
                    }))
                }));
            } catch (error) {
                console.error('Failed to load session data:', error);
            }
        }
    });

    const handleExport = async () => {
        try {
            setExportError(null);
            const response = await fetch(getApiUrl('sessions/export'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionName: sessionName(),
                    contentFormat: formatParam(),
                    content: {
                        questions: questions().approved
                    }
                })
            });

            if (!response.ok) {
                throw new Error("Failed to export session");
            }

            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
        } catch (error) {
            console.error("Export failed:", error);
            setExportError("Failed to export session. Please try again.");
            setTimeout(() => setExportError(null), 3000);
        }
    }

    const handleExportJSON = () => {
        // Format the questions to match the expected structure
        const formattedQuestions = questions().approved.map(q => ({
            category: q.category,
            correctAnswer: q.correctAnswer,
            difficulty: q.difficulty,
            id: q.id,
            possibleAnswers: q.possibleAnswers,
            text: q.text
        }));

        const blob = new Blob([JSON.stringify(formattedQuestions, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sessionName()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <main class="container mx-auto py-6 px-4 flex-grow">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 class="text-3xl font-bold">{sessionName()}</h1>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <Show when={formatParam()}>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {formatDisplay()}
                            </span>
                        </Show>
                        <Show when={category()}>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {categoryDisplay()}
                            </span>
                        </Show>
                        <Show when={difficulty()}>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {difficultyDisplay()}
                            </span>
                        </Show>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button
                        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
                        onClick={handleExport}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save Session
                    </button>
                    <button
                        class="text-gray-700 hover:text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 py-2 px-4 rounded flex items-center gap-2"
                        onClick={handleExportJSON}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export JSON
                    </button>
                </div>
            </div>

            <Show when={exportSuccess()}>
                <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-6">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="font-medium">Success!</span>
                    </div>
                    <span class="block sm:inline ml-7">Your session has been exported successfully.</span>
                </div>
            </Show>

            <Show when={exportError()}>
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="font-medium">Error</span>
                    </div>
                    <span class="block sm:inline ml-7">{exportError()}</span>
                </div>
            </Show>

            <div class="mb-6">
                <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8">
                        <button
                            class={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab() === "generate"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            onClick={() => setActiveTab("generate")}
                        >
                            Question Pool
                            <Show when={generatedQuestions().length > 0}>
                                <span class="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                    {generatedQuestions().length}
                                </span>
                            </Show>
                        </button>
                        <button
                            class={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab() === "approved"
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
                    <QuestionGenerator
                        onGenerate={handleGenerateQuestions}
                        isGenerating={isGenerating}
                        generatedCount={() => generatedQuestions().length}
                    />

                    <Show
                        when={generatedQuestions().length > 0}
                        fallback={
                            <Show when={!isGenerating()}>
                                <div class="border rounded-lg p-8 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-gray-500">No questions generated yet. Click the button above to generate questions.</p>
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
                                        onEdit={handleEditQuestion}
                                        onDiscard={handleDiscardQuestion}
                                        sessionCategory={category()}
                                        sessionDifficulty={difficulty()}
                                        sessionFormat={formatParam()}
                                    />
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
                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-gray-500">No approved questions yet. Generate and approve questions to see them here.</p>
                        </div>
                    }
                >
                    <div class="space-y-4">
                        <For each={approvedQuestions()}>
                            {(question) => (
                                <div class="border rounded-lg shadow-sm">
                                    <div class="p-6">
                                        <div class="flex flex-wrap gap-2 mb-4">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Category: {categoryMap[question.category] || question.category}
                                            </span>
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Difficulty: {difficultyMap[question.difficulty] || question.difficulty}
                                            </span>
                                        </div>
                                        <h3 class="text-lg font-medium">{question.text}</h3>
                                        <div class="mt-4">
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
                                                                <span class="ml-2 text-green-600 text-sm">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block align-text-bottom" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            </Show>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="px-6 py-3 bg-gray-50 rounded-b-lg flex items-center justify-end gap-4">
                                        <button
                                            class="text-gray-700 hover:text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
                                            onClick={() => handleSendBackToPool(question)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                                            </svg>
                                            Send Back
                                        </button>
                                        <button
                                            class="text-red-600 hover:text-red-800 border border-red-300 bg-white hover:bg-red-50 px-3 py-1.5 rounded text-sm flex items-center gap-1"
                                            onClick={() => handleRemoveApproved(question.id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
    )
}

export default MultipleChoiceQuestions