'use client';
import { useState } from 'react';
import Link from 'next/link';
import {getCookie} from "@/utils/cookies";
import { useUser } from '@/context/UserContext';
import API_BASE_URL from "@/config/api";


export default function ArticleActions({ article, onDelete }) {
    const [showModal, setShowModal] = useState(false);
    const { userId } = useUser();

    const handleDelete = async () => {
        setShowModal(false);
        const token = getCookie('token');
        const res = await fetch(`${API_BASE_URL}/articles/${article.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            alert('Failed to delete article');
            return;
        }
        onDelete(article.id);
    };

    if (article.author.id !== userId) {
        return null;
    }

    return (
        <div className="flex space-x-4 text-sm">
            <Link
                href={`/articles/${article.id}/edit`}
                className="text-blue-600 hover:text-blue-800 transition"
            >
                Modifier
            </Link>

            <button
                onClick={() => setShowModal(true)}
                className="text-red-600 hover:text-red-800 transition"
            >
                Supprimer
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 animate-fade-in-up">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Supprimer l&apos;article
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer{' '}
                            <strong className="text-gray-900">{article.title}</strong>?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded transition"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
