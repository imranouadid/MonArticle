import Layout from '@/components/Layout';
import { UserProvider } from '@/context/UserContext';
import '@/styles/globals.css';

const noLayoutRoutes = ['/login', '/register'];

export default function App({ Component, pageProps, router }) {
    const isNoLayout = noLayoutRoutes.includes(router.pathname);

    return (
        <UserProvider>
            {isNoLayout ? (
                <Component {...pageProps} />
            ) : (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            )}
        </UserProvider>
    );
}