import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white text-gray-900 py-5 px-8 shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/articles" className="text-3xl font-extrabold tracking-tight hover:text-green-600 transition">
                    MyApp
                </Link>
                <div className="flex space-x-10 text-lg font-semibold">
                    <Link
                        href="/articles"
                        className="px-4 py-2 rounded-md hover:bg-green-100 hover:text-green-700 transition"
                    >
                        Articles
                    </Link>
                    <Link
                        href="/account"
                        className="px-4 py-2 rounded-md hover:bg-green-100 hover:text-green-700 transition"
                    >
                        Mon compte
                    </Link>
                    <Link
                        href="/logout"
                        className="px-4 py-2 rounded-md hover:bg-green-100 hover:text-green-700 transition"
                    >
                        Déconnexion
                    </Link>
                </div>
            </div>
        </nav>
    );
}
