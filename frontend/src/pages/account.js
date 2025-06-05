import { useEffect, useState } from 'react';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { getCookie } from '@/utils/cookies';


export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '' });
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = getCookie('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        fetch('http://localhost:8080/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch user data');
                return res.json();
            })
            .then(data => {
                setUser(data);
                setForm({ name: data.name, email: data.email });
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const token = getCookie('token');
            if (!token) throw new Error('Not authenticated');

            const res = await fetch('http://localhost:8080/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to update user info');

            const updatedUser = await res.json();
            setUser(updatedUser);
            setShowModal(true); // Show modal on success

            // Auto-hide modal after 3 seconds
            setTimeout(() => setShowModal(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md relative">
            <h1 className="text-3xl font-semibold mb-6">Mon compte</h1>
            <form onSubmit={handleSave} className="space-y-6">
                <Input
                    id="name"
                    label="Nom"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    id="email"
                    label="E-mail"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Enregistrer les modifications'}
                </button>
            </form>

            {showModal && (
                <Modal
                    title="Profil mis à jour"
                    onClose={() => setShowModal(false)}
                    actions={
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            OK
                        </button>
                    }
                >
                    Vos informations ont été mises à jour avec succès.
                </Modal>
            )}
        </div>
    );
}
