import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

/**
 * Wrap any page component with this HOC to require authentication.
 * Redirects to /login if no valid token is found.
 *
 * Usage:
 *   export default withAuth(MyPage);
 */
export default function withAuth(Component) {
  return function ProtectedPage(props) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      }
    }, [loading, isAuthenticated, router]);

    if (loading || !isAuthenticated) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{
            width: '40px', height: '40px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #2874f0',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#878787', fontSize: '14px' }}>Checking authentication…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
