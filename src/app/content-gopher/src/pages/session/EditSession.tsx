import type { Component } from 'solid-js';
import { createResource, Show, createEffect } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';

interface SessionData {
    questions: Array<{
        text: string;
        possibleAnswers: string[];
        correctAnswer: string;
        category: string;
        difficulty: string;
    }>;
}

const EditSession: Component = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [sessionData] = createResource<SessionData>(async () => {
        const response = await fetch(`http://localhost:7272/api/sessions/${params.filename}`);
        if (!response.ok) throw new Error('Failed to fetch session data');
        return response.json();
    });

    // When session data is loaded, redirect to the content generation page
    createEffect(() => {
        const data = sessionData();
        if (data && data.questions.length > 0) {
            const type = params.filename.split('/')[0]; // Get the question type from the filename
            const name = params.filename.split('/')[1].replace('.json', '');

            // Convert the type to the format expected by the URL
            const format = type.replace(/_/g, '-');

            // Analyze all questions to determine if we have mixed categories/difficulties
            const uniqueCategories = new Set(data.questions.map(q => q.category));
            const uniqueDifficulties = new Set(data.questions.map(q => q.difficulty));

            const category = uniqueCategories.size > 1 ? 'mixed' : data.questions[0].category;
            const difficulty = uniqueDifficulties.size > 1 ? 'mixed' : data.questions[0].difficulty;

            // Redirect to the content generation page with the session data
            navigate(`/content/${format}?name=${name}&category=${encodeURIComponent(category)}&difficulty=${encodeURIComponent(difficulty)}&format=${encodeURIComponent(type)}&edit=true&filename=${encodeURIComponent(params.filename)}`, { replace: true });
        }
    });

    return (
        <main class="container mx-auto py-8 px-4 flex-grow">
            <div class="max-w-2xl mx-auto">
                <Show when={sessionData.loading}>
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p class="mt-4 text-gray-600">Loading session data...</p>
                    </div>
                </Show>

                <Show when={sessionData.error}>
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="font-medium">Error</span>
                        </div>
                        <span class="block sm:inline ml-7">Failed to load session: {sessionData.error.message}</span>
                    </div>
                </Show>
            </div>
        </main>
    );
};

export default EditSession; 