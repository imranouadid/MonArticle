'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleActions from '@/components/ArticleActions';
import {getCookie} from "@/utils/cookies";
import {formatDate} from "@/utils/dates";


export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    async function fetchArticles() {
        try {
            setLoading(true);

            const token = getCookie('token');
            if (!token) throw new Error('Not authenticated');

            const res = await fetch('http://localhost:8080/api/articles', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setArticles(data.member);
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

    function removeArticleFromList(id) {
        setArticles(prev => prev.filter(a => a.id !== id));
    }

    // async function handleDeleteConfirmed() {
    //     if (!selectedArticle) return;
    //     try {
    //         const token = getCookie('token');
    //         const res = await fetch(`http://localhost:8080/api/articles/${selectedArticle.id}`, {
    //             method: 'DELETE',
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //
    //         if (!res.ok) throw new Error('Failed to delete article');
    //
    //         setArticles((prev) => prev.filter((a) => a.id !== selectedArticle.id));
    //         setShowModal(false);
    //         setSelectedArticle(null);
    //     } catch (err) {
    //         alert('Error deleting article: ' + err.message);
    //     }
    // }

    if (loading) return <p className="text-center p-6 text-gray-500">Loading articles...</p>;
    if (error) return <p className="text-center p-6 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-end mb-6">
                <Link
                    href="/articles/new"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
                >
                    + Ajouter un article
                </Link>
            </div>

            {articles.length === 0 ? (
                <p className="text-gray-500">Aucun article trouvé.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-lg transition"
                        >
                            <div>
                                <Link href={`/articles/${article.id}`}>
                                    <h2 className="text-xl font-semibold text-black-600 hover:underline mb-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        {article.content.slice(0, 100)}...
                                    </p>
                                </Link>
                                <p className="text-gray-500 text-sm mb-2">
                                    Par {article.author.name}, le {formatDate(article.createdAt)}
                                </p>
                            </div>
                            <ArticleActions article={article} onDelete={removeArticleFromList} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
