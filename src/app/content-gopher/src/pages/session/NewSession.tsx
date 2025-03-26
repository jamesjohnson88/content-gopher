"use client"

import { createSignal } from "solid-js"
import type { Component } from 'solid-js';

const [sessionName, setSessionName] = createSignal("")
const [category, setCategory] = createSignal("")
const [difficulty, setDifficulty] = createSignal("")
const [format, setFormat] = createSignal("")

// todo - options per content type, or one big map from api?

const handleContentFormatChange = (value:string) => {
    setCategory(value)
    // get options from api
}

const handleDifficultyChange = (value:string) => {
    setDifficulty(value)
    // get options from api
}

const handleCategoryChange = (value:string) => {
    setCategory(value)
    // get options from api
}

const handleCreateSession = () => {
    alert("todo - post to api")
}

const isFormValid = () => {
    return sessionName() && category() && difficulty() && format()
}

const NewSession: Component = () => {

    return (
        <main class="container mx-auto py-8 px-4 flex-grow">
            <div class="max-w-2xl mx-auto">
                <h1 class="text-3xl font-bold mb-6">Create New Session</h1>
                <div class="border rounded-lg shadow-sm">
                    <div class="p-6">
                        <h2 class="text-xl font-semibold">Session Settings</h2>
                        <p class="text-gray-500 mt-1 mb-4">Configure your quiz generation settings</p>
                        <div class="space-y-4">
                            <div class="space-y-2">
                                <label html-for="session-name" class="block text-sm font-medium text-gray-700">
                                    Session Name
                                </label>
                                <input
                                    id="session-name"
                                    type="text"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Science Quiz March 2024"
                                    value={sessionName()}
                                    onInput={(e) => setSessionName(e.target.value)}
                                />
                            </div>
                            <div class="space-y-2">
                                <label html-for="format" class="block text-sm font-medium text-gray-700">
                                    Content Format
                                </label>
                                <select
                                    id="format"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={format()}
                                    onChange={(e) => handleContentFormatChange(e.target.value)}
                                >
                                    <option value="select-format" disabled>
                                        Select format
                                    </option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="true-false">True/False</option>
                                    <option value="short-answer">Short Answer</option>
                                    <option value="mixed">Mixed</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label html-for="difficulty" class="block text-sm font-medium text-gray-700">
                                    Difficulty
                                </label>
                                <select
                                    id="difficulty"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={difficulty()}
                                    onChange={(e) => handleDifficultyChange(e.target.value)}
                                >
                                    <option value="select-difficulty" disabled>
                                        Select difficulty
                                    </option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                    <option value="mixed">Mixed</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label html-for="category" class="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={category()}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                >
                                    <option value="select-category" disabled>
                                        Select a category
                                    </option>
                                    <option value="general">General Knowledge</option>
                                    <option value="science">Science</option>
                                    <option value="history">History</option>
                                    <option value="geography">Geography</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="sports">Sports</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="px-6 py-4 pt-2 bg-gray-50 rounded-b-lg">
                        <button
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCreateSession}
                            disabled={!isFormValid()}
                        >
                            Start Session
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NewSession;