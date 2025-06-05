import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import API_BASE_URL from '../config/api';


export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUserId } = useUser();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Invalid credentials');

            const data = await res.json();
            document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax;`;

            const fetchUserRes = await fetch(`${API_BASE_URL}/users/me`, {
                headers: { Authorization: `Bearer ${data.token}` },
            });
            if (!fetchUserRes.ok) throw new Error('Failed to get user info');
            const user = await fetchUserRes.json();
            setUserId(user.id);

            window.location.href = '/account';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
                {error && <p className="mb-4 p-3 bg-red-200 text-red-800 rounded">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="email"
                        label="E-mail"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                    />
                    <Input
                        id="password"
                        label="Mot de passe"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Votre mot de passe"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function Input({ id, label, type, name, value, onChange, placeholder, required }) {
    return (
        <div>
            <label htmlFor={id} className="block mb-1 font-medium">
                {label}
            </label>
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}
