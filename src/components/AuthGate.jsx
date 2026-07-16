import { useAuth } from '../hooks/useAuth';
import AuthScreen, { VerifyEmailScreen } from './AuthScreen';

export default function AuthGate({ children }) {
  const { isConfigured, loading, user, isVerified } = useAuth();

  // Sin Firebase configurado todavia: el sitio funciona normal, sin
  // login obligatorio (evita romper la tienda antes de que exista el
  // proyecto Firebase real). Ver .env.example.
  if (!isConfigured) return children;

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-neutral-950">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <AuthScreen />;
  if (!isVerified) return <VerifyEmailScreen />;

  return children;
}
