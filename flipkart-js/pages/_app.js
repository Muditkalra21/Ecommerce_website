import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

// Pages that should NOT show Navbar/Footer (full-screen layouts)
const BARE_PAGES = ['/login'];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isBare = BARE_PAGES.includes(router.pathname);

  return (
    <AuthProvider>
      {!isBare && <Navbar />}
      <main style={isBare ? {} : { minHeight: 'calc(100vh - 56px)', paddingTop: '56px' }}>
        <Component {...pageProps} />
      </main>
      {!isBare && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '4px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
          },
          success: { iconTheme: { primary: '#26a541', secondary: 'white' } },
          error: { iconTheme: { primary: '#ff4040', secondary: 'white' } },
        }}
      />
    </AuthProvider>
  );
}

