import type { Component } from 'solid-js';
import {A} from "@solidjs/router"

const Home: Component = () => {
    return (
        <main class="container mx-auto py-8 px-4 flex-grow">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-xl font-bold mb-2">Welcome to Content Gopher</h1>
                <p class="text-gray-600 mb-6">Please select from the following options:</p>

                <div class="grid md:grid-cols-2 gap-6">
                    <div class="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="p-6">
                            <h2 class="text-xl font-semibold flex items-center gap-2">
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
                                        d="M12 4v16m8-8H4" />
                                </svg>
                                Start New Session
                            </h2>
                            <p class="text-gray-500 mt-1 mb-4">Generate new quiz questions with AI, amend them as you see fit,
                                and write them to your json file.</p>
                            <A href="/sessions/new">
                            <button class="w-full bg-black hover:bg-gray-700 text-white py-2 px-4 rounded">Create Session</button>
                            </A>
                        </div>
                    </div>

                    <div class="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="p-6">
                            <h2 class="text-xl font-semibold flex items-center gap-2">
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
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                Browse Existing Content
                            </h2>
                            <p class="text-gray-500 mt-1 mb-4">View, manage and build upon your existing content from previous sessions.</p>
                            <A href="/sessions/browse">
                                <button class="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 py-2 px-4 rounded">
                                    Browse Content
                                </button>
                            </A>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default Home;