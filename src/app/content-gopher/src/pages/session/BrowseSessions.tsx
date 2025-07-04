﻿import type { Component } from 'solid-js';
import { createResource, Show, For, createMemo } from 'solid-js';
import { A } from '@solidjs/router';
import { categoryMap, difficultyMap, formatMap } from '../../types/mappings';
import { findMatchingSessionKey, parseSessionKey } from '../../utils/sessionKeys';
import { getApiUrl } from '../../config';

// import styles from './App.module.css';

interface SessionInfo {
    filename: string;
    name: string;
    type: string;
    categories: string[];
    difficulties: string[];
    questionCount: number;
}

interface DirectoryInfo {
    path: string;
    sessions: SessionInfo[];
}

const BrowseSessions: Component = () => {
    const [directoryInfo] = createResource<DirectoryInfo>(async () => {
        const response = await fetch(getApiUrl('sessions/directory'));
        if (!response.ok) throw new Error('Failed to fetch directory info');
        return response.json();
    });

    const getQuestionPoolStats = (session: SessionInfo) => {
        const matchingKey = findMatchingSessionKey(session.name, session.type);

        let poolCount = 0;
        let approvedCount = 0;
        let categories: string[] = [];
        let difficulties: string[] = [];

        if (matchingKey) {
            try {
                const data = JSON.parse(localStorage.getItem(matchingKey)!) as { generated: any[], approved: any[] };
                poolCount = data.generated.length;
                approvedCount = data.approved.length;

                const keyParts = parseSessionKey(matchingKey);
                if (keyParts) {
                    categories = keyParts.category === 'mixed' ? ['mixed'] : [keyParts.category];
                    difficulties = keyParts.difficulty === 'mixed' ? ['mixed'] : [keyParts.difficulty];
                }
            } catch (e) {
                console.error('Error parsing saved questions:', e);
            }
        }

        return {
            poolCount,
            approvedCount,
            categories: categories.length > 0 ? categories : session.categories,
            difficulties: difficulties.length > 0 ? difficulties : session.difficulties,
            matchingKey
        };
    };

    // Memoize the stats for each session to avoid recalculating
    const sessionStats = createMemo(() => {
        if (!directoryInfo()) return new Map();
        return new Map(directoryInfo()!.sessions.map(session => [session.filename, getQuestionPoolStats(session)]));
    });

    return (
        <main class="container mx-auto py-8 px-4 flex-grow">
            <div class="max-w-4xl mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold">Browse Sessions</h1>
                    <A href="/sessions/new">
                        <button class="bg-black hover:bg-gray-700 text-white py-2 px-6 rounded-lg inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Session
                        </button>
                    </A>
                </div>

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

                <Show when={!directoryInfo.loading && !directoryInfo.error && (!directoryInfo() || !directoryInfo()?.sessions || directoryInfo()?.sessions.length === 0)}>
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
                    </div>
                </Show>

                <Show when={!directoryInfo.loading && !directoryInfo.error && (directoryInfo()?.sessions?.length ?? 0) > 0}>
                    <div class="grid gap-6">
                        {directoryInfo() && (
                            <For each={directoryInfo()!.sessions}>
                                {(session) => {
                                    const stats = sessionStats().get(session.filename);
                                    return (
                                        <div class="bg-white border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:bg-gray-50">
                                            <A href={`/sessions/edit/${session.filename}${stats?.poolCount > 0 ? `?key=${encodeURIComponent(stats?.matchingKey || '')}` : ''}`} class="block h-full">
                                                <div class="px-6 py-4 flex justify-between items-center">
                                                    <div class="flex-grow">
                                                        <h2 class="text-xl font-semibold mb-2">{session.name}</h2>
                                                        <div class="flex flex-wrap gap-2">
                                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                {formatMap[session.type] || session.type}
                                                            </span>
                                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {stats?.categories.length > 1 ? categoryMap["mixed"] : categoryMap[stats?.categories[0]] || stats?.categories[0]}
                                                            </span>
                                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {stats?.difficulties.length > 1 ? difficultyMap["mixed"] : difficultyMap[stats?.difficulties[0]] || stats?.difficulties[0]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center gap-4 text-sm text-gray-600">
                                                        <div class="flex items-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            <span>{stats?.poolCount} in pool</span>
                                                        </div>
                                                        <div class="flex items-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{stats?.approvedCount} approved</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </A>
                                        </div>
                                    );
                                }}
                            </For>
                        )}
                    </div>
                </Show>
            </div>
        </main>
    );
};

export default BrowseSessions;