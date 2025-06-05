'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {getCookie} from "@/utils/cookies";
import API_BASE_URL from "@/config/api";

const ARTICLES_ENDPOINT = `${API_BASE_URL}/articles`;

function Input({ id, label, type, name, value, onChange, required }) {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
        </div>
    );
}

export default function NewArticle() {
    const router = useRouter();
    const [form, setForm] = useState({ title: '', content: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const token = getCookie('token');
            if (!token) throw new Error('Not authenticated');

            const res = await fetch(ARTICLES_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to save article');
            }

            router.push('/articles');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Créer un nouvel article</h1>

            {error && (
                <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-700 border border-red-300">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl bg-white p-6 shadow-md border border-gray-100"
            >
                <Input
                    id="title"
                    label="Titre"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <div className="space-y-1">
                    <label htmlFor="content" className="text-sm font-medium text-gray-700">
                        Contenu
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Publier'}
                    </button>
                </div>
            </form>
        </div>
    );
}
