import type { Component } from 'solid-js';
import {A} from "@solidjs/router"

const Header: Component = () => {
    return (
        <header class="bg-gradient-to-r from-black to-gray-900 shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center">
                    <A href="/">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-6 w-6 text-gray-800"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div class="text-white">
                                <h1 class="text-2xl font-bold">Content Gopher</h1>
                                <p class="text-gray-300 text-sm">Create and manage quiz content</p>
                            </div>
                        </div>
                    </A>
                </div>
            </div>
        </header>
    )
}

export default Header;