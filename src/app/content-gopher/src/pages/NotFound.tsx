import type { Component } from 'solid-js';

// import styles from './App.module.css';

const NotFound: Component = () => {
    return (
        <div class="container mx-auto py-8 px-4 text-center">
            <h1 class="text-3xl font-bold mb-4">404 - Page Not Found</h1>
            <p class="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
    );
};

export default NotFound;