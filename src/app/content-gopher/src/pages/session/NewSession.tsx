﻿"use client"

import { createSignal, createResource, createMemo, createEffect } from "solid-js"
import { useNavigate } from "@solidjs/router";
import { getApiUrl } from '../../config';

import type { Component } from 'solid-js';

interface OptionItem {
    displayName: string;
    value: string;
}

interface OptionGroup {
    title: string;
    content_format: string;
    options: OptionItem[];
}

interface SessionType {
    title: string;
    content_format: string;
    options: OptionGroup[];
}

interface SessionOptions {
    session_types: SessionType[];
}

type NewSessionForm = {
    sessionName: string;
    contentFormat: string;
    metadata: Record<string, string>;
}

const NewSession: Component = () => {
    const [sessionName, setSessionName] = createSignal("")
    const [format, setFormat] = createSignal("")
    const [formData, setFormData] = createSignal<Record<string, string>>({})
    const [formErrs, setFormErrs] = createSignal<Record<string, string>>({})
    const [loading, setLoading] = createSignal<boolean>(false)

    const [sessionData] = createResource(fetchData);
    const navigate = useNavigate();

    async function fetchData(): Promise<SessionOptions> {
        const response = await fetch(getApiUrl('sessions/options'));
        if (!response.ok) throw new Error("Could not fetch data");
        return response.json();
    }

    function initializeFormFields(options: OptionGroup[]) {
        const initialData: Record<string, string> = {};
        options.forEach((opt) => {
            if (opt.options.length > 0) {
                initialData[opt.content_format] = opt.options[0].value;
            }
        });
        setFormData(initialData);
    }

    const handleContentFormatChange = (value: string) => {
        setFormat(value)
    }

    function handleInputChange(fieldName: string, value: string) {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        if (!value.trim()) {
            setFormErrs((prev) => ({ ...prev, [fieldName]: "This field is required" }));
        } else {
            setFormErrs((prev) => ({ ...prev, [fieldName]: "" }));
        }
    }

    createEffect(() => {
        const data = sessionData();
        if (data && data.session_types.length === 1) {
            const defaultFormat = data.session_types[0].content_format;
            setFormat(defaultFormat);
            initializeFormFields(data.session_types[0].options);
        }
    });

    const isFormValid = createMemo(() => {
        return sessionName() && format() && !loading()
            && Object.values(formErrs()).every((error) => error === "")
            && Object.entries(formData()).every(([key, value]) => value.trim() !== "");
    });

    async function handleCreateSession() {
        const form: NewSessionForm = {
            sessionName: sessionName(),
            contentFormat: format(),
            metadata: formData()
        }

        try {
            const response = await fetch(getApiUrl('sessions'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) throw new Error("Could not create session");

            const responseData = await response.json();
            navigate(`/content/multiple-choice-question?name=${encodeURIComponent(sessionName())}&category=${encodeURIComponent(formData().category)}&difficulty=${encodeURIComponent(formData().difficulty)}&format=${encodeURIComponent(format())}`, { replace: true });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main class="container mx-auto py-8 px-4 flex-grow">
            <div class="max-w-2xl mx-auto">
                {sessionData.loading && <p>Loading...</p>}
                {sessionData.error && <p>Error: {sessionData.error.message}</p>}
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
                                        Select Format
                                    </option>
                                    {sessionData()?.session_types.map((st) => {
                                        return (
                                            <option value={st.content_format}>{st.title}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            {sessionData()?.session_types.filter((s) => s.content_format == format()).map((st) => {
                                return (
                                    st.options.map((opt) => {
                                        return <div class="space-y-2">
                                            <label html-for={opt.content_format}
                                                class="block text-sm font-medium text-gray-700">
                                                {opt.title}
                                            </label>
                                            <select
                                                id={opt.content_format}
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                onChange={(e) => handleInputChange(opt.content_format, e.target.value)}
                                                value={formData()[opt.content_format] || ""}
                                            >
                                                <option value="select-value" disabled>
                                                    Select {opt.title}
                                                </option>
                                                {opt.options.map((o) => {
                                                    return (
                                                        <option value={o.value}>
                                                            {o.displayName}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    })
                                )
                            })}
                        </div>
                    </div>
                    <div class="px-6 py-4 pt-2 bg-gray-50 rounded-b-lg">
                        <button
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCreateSession}
                            disabled={!isFormValid()}
                        >
                            {loading() ? "Submitting..." : "Start Session"}
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
                                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NewSession;