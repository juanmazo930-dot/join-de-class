import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useLocale } from '../hooks/useLocale';
import logo from '../assets/brand/logo-black.png';

const COPY = {
  es: {
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    email: 'Correo electrónico',
    password: 'Contraseña',
    switchToSignUp: '¿No tienes cuenta? Regístrate',
    switchToSignIn: '¿Ya tienes cuenta? Inicia sesión',
    submitSignIn: 'Entrar',
    submitSignUp: 'Crear cuenta',
    tagline: 'Acceso exclusivo — Join the Class',
    checkEmail: 'Revisa tu correo para verificar tu cuenta antes de continuar.',
    resend: 'Reenviar correo de verificación',
    resent: 'Enviado de nuevo.',
    verifyTitle: 'Confirma tu correo',
    verifyBody: 'Te enviamos un enlace de verificación. Actualiza esta página después de confirmarlo.',
    refresh: 'Ya confirmé, continuar',
    signOut: 'Cerrar sesión',
  },
  en: {
    signIn: 'Sign in',
    signUp: 'Create account',
    email: 'Email',
    password: 'Password',
    switchToSignUp: "Don't have an account? Sign up",
    switchToSignIn: 'Already have an account? Sign in',
    submitSignIn: 'Enter',
    submitSignUp: 'Create account',
    tagline: 'Exclusive access — Join the Class',
    checkEmail: 'Check your email to verify your account before continuing.',
    resend: 'Resend verification email',
    resent: 'Sent again.',
    verifyTitle: 'Confirm your email',
    verifyBody: "We sent you a verification link. Refresh this page after confirming it.",
    refresh: 'I confirmed, continue',
    signOut: 'Sign out',
  },
};

function AnimatedBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-950">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30 blur-3xl"
          style={{
            width: 500,
            height: 500,
            background: ['#f5f5f4', '#93c5fd', '#b91c1c'][i],
            left: `${20 + i * 25}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 14 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function VerifyEmailScreen() {
  const { resendVerification, signOut, user } = useAuth();
  const { locale } = useLocale();
  const c = COPY[locale];
  const [sent, setSent] = useState(false);

  return (
    <div className="relative min-h-svh flex items-center justify-center p-6">
      <AnimatedBackdrop />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm bg-white/95 rounded-2xl shadow-2xl p-8 text-center"
      >
        <h2 className="text-xl font-bold text-neutral-900">{c.verifyTitle}</h2>
        <p className="text-sm text-neutral-600 mt-2">{c.verifyBody}</p>
        <p className="text-xs text-neutral-400 mt-2">{user?.email}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full mt-6 bg-neutral-900 text-white py-2.5 rounded-lg font-medium hover:bg-neutral-800"
        >
          {c.refresh}
        </button>
        <button
          onClick={async () => {
            await resendVerification();
            setSent(true);
          }}
          className="w-full mt-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          {sent ? c.resent : c.resend}
        </button>
        <button onClick={signOut} className="w-full mt-1 text-xs text-neutral-400 hover:text-neutral-600">
          {c.signOut}
        </button>
      </motion.div>
    </div>
  );
}

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { locale } = useLocale();
  const c = COPY[locale];
  const [mode, setMode] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signIn') await signIn(email, password);
      else await signUp(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-svh flex items-center justify-center p-6">
      <AnimatedBackdrop />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm bg-white/95 rounded-2xl shadow-2xl p-8"
      >
        <img src={logo} alt="Join the Class" className="h-10 mx-auto mb-2" />
        <p className="text-center text-xs uppercase tracking-widest text-neutral-500 mb-6">
          {c.tagline}
        </p>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === 'signIn' ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'signIn' ? 12 : -12 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input
              type="email"
              required
              placeholder={c.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder={c.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-neutral-900 text-white py-2.5 rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50"
            >
              {mode === 'signIn' ? c.submitSignIn : c.submitSignUp}
            </button>
          </motion.form>
        </AnimatePresence>

        <button
          onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
          className="w-full mt-4 text-sm text-neutral-600 hover:text-neutral-900 text-center"
        >
          {mode === 'signIn' ? c.switchToSignUp : c.switchToSignIn}
        </button>
      </motion.div>
    </div>
  );
}
