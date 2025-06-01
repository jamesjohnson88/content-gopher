import type { Component } from 'solid-js';
import { A } from "@solidjs/router"
import logo from '../assets/logo.jpg'; // Import the new logo image

const Header: Component = () => {
    return (
        <header class="bg-gradient-to-r from-black to-gray-900 shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center">
                    <A href="/">
                        <div class="flex items-center gap-3">
                            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <img src={logo} alt="Content Gopher Logo" class="h-full w-full object-cover object-position-top" />
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