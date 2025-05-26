import type { Component } from 'solid-js';
import { createResource, Show } from 'solid-js';
import { A } from '@solidjs/router';

// import styles from './App.module.css';

interface DirectoryInfo {
    path: string;
    files: string[];
}

const BrowseSessions: Component = () => {
    const [directoryInfo] = createResource<DirectoryInfo>(async () => {
        const response = await fetch('http://localhost:7272/api/sessions/directory');
        if (!response.ok) throw new Error('Failed to fetch directory info');
        const data = await response.json();
        console.log('Directory info response:', data);
        return data;
    });

    return (
        <main class="container mx-auto py-8 px-4 flex-grow">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-3xl font-bold mb-6">Browse Sessions</h1>

                <Show when={directoryInfo.loading}>
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p class="mt-4 text-gray-600">Loading sessions...</p>
                    </div>
                </Show>

                <Show when={directoryInfo.error}>
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="font-medium">Error</span>
                        </div>
                        <span class="block sm:inline ml-7">Failed to load sessions: {directoryInfo.error.message}</span>
                    </div>
                </Show>

                <Show when={!directoryInfo.loading && directoryInfo()}>
                    <div class="bg-white border rounded-lg shadow-sm p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 class="text-xl font-semibold mb-2">No Content Gopher Files Found</h2>
                        <p class="text-gray-600 mb-6">
                            No Content Gopher files were found in the directory:
                            <br />
                            <code class="bg-gray-100 px-2 py-1 rounded text-sm mt-2 inline-block">{directoryInfo()?.path}</code>
                        </p>
                        <A href="/sessions/new">
                            <button class="bg-black hover:bg-gray-700 text-white py-2 px-6 rounded-lg inline-flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Create New Session
                            </button>
                        </A>
                    </div>
                </Show>
            </div>
        </main>
    );
};

export default BrowseSessions;