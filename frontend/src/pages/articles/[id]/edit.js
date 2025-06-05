import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {getCookie} from "@/utils/cookies";
import API_BASE_URL from "@/config/api";

const ARTICLES_ENDPOINT =  `${API_BASE_URL}/articles`;

function Input({ id, label, type, name, value, onChange, required }) {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            />
        </div>
    );
}

export default function EditArticle() {
    const router = useRouter();
    const { id } = router.query;

    const [form, setForm] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        async function fetchArticle() {
            setLoading(true);
            setError('');
            try {
                const token = getCookie('token');
                if (!token) throw new Error('Not authenticated');

                const res = await fetch(`${ARTICLES_ENDPOINT}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch article');

                const data = await res.json();
                setForm({ title: data.title, content: data.content });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchArticle();
    }, [id]);

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const token = getCookie('token');
            if (!token) throw new Error('Not authenticated');

            const res = await fetch(`${ARTICLES_ENDPOINT}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to update article');
            }

            router.push('/articles');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p className="p-6 text-center text-gray-500 animate-pulse">Loading article...</p>;
    if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Modifier l&apos;article</h1>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
                        <textarea
                            id="content"
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Modifier'}
                    </button>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                </form>
            </div>
        </div>
    );
}
