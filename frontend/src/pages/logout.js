import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem('token');
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push('/login');
    }, [router]);

    return <p className="text-center p-6 text-gray-500">Déconnexion...</p>;
}
