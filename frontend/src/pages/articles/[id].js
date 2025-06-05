import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {getCookie} from "@/utils/cookies";
import {formatDate} from "@/utils/dates";


export default function ReadArticle() {
    const router = useRouter();
    const { id } = router.query;

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        async function fetchArticle() {
            try {
                const token = getCookie('token');
                if (!token) throw new Error('Not authenticated');

                const res = await fetch(`http://localhost:8080/api/articles/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch article');

                const data = await res.json();
                setArticle(data);
            } catch (err) {
                if (err.message === 'Not authenticated') {
                    window.location.href = '/login';
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchArticle();
    }, [id]);

    if (loading) return <p className="text-center p-6 text-gray-500">Loading article...</p>;
    if (error) return <p className="text-center p-6 text-red-500">{error}</p>;
    if (!article) return null;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{article.title}</h1>
            <p className="text-gray-500 mb-4">
                Par {article.author.name}, le {formatDate(article.createdAt)}
            </p>
            <div className="prose max-w-none text-gray-800 whitespace-pre-line">
                {article.content}
            </div>
        </div>
    );
}
