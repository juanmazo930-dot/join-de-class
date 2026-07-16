import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useLocale } from '../hooks/useLocale';
import AuthBackground3D from './AuthBackground3D';
import logo from '../assets/brand/logo-black.png';

const COPY = {
  es: {
    signIn: 'Iniciar sesión',
    signUp: 'Crear cuenta',
    nickname: 'Apodo / usuario',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
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
    passwordMismatch: 'Las contraseñas no coinciden.',
    passwordWeak: 'Usa al menos 6 caracteres, con una mayúscula y un número.',
    strengthWeak: 'Débil',
    strengthOk: 'Aceptable',
    strengthStrong: 'Fuerte',
  },
  en: {
    signIn: 'Sign in',
    signUp: 'Create account',
    nickname: 'Nickname / username',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
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
    passwordMismatch: "Passwords don't match.",
    passwordWeak: 'Use at least 6 characters, one uppercase letter and one number.',
    strengthWeak: 'Weak',
    strengthOk: 'Okay',
    strengthStrong: 'Strong',
  },
};

function passwordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3);
}

export function VerifyEmailScreen() {
  const { resendVerification, signOut, user } = useAuth();
  const { locale } = useLocale();
  const c = COPY[locale];
  const [sent, setSent] = useState(false);

  return (
    <div className="relative min-h-svh flex items-center justify-center p-6 overflow-hidden bg-neutral-950">
      <AuthBackground3D />
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
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const strengthLabel = [c.strengthWeak, c.strengthWeak, c.strengthOk, c.strengthStrong][strength];
  const strengthColor = ['#dc2626', '#dc2626', '#d97706', '#16a34a'][strength];

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (mode === 'signUp' && password !== confirmPassword) {
      setError(c.passwordMismatch);
      return;
    }
    if (mode === 'signUp' && strength < 2) {
      setError(c.passwordWeak);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signIn') await signIn(email, password);
      else await signUp(email, password, nickname);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-svh flex items-center justify-center p-6 overflow-hidden bg-neutral-950">
      <AuthBackground3D />
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

          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === 'signIn' ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            {mode === 'signUp' && (
              <input
                type="text"
                required
                placeholder={c.nickname}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            )}
            <input
              type="email"
              required
              placeholder={c.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder={c.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-900"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {mode === 'signUp' && password && (
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 h-1 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${(strength / 3) * 100}%`, backgroundColor: strengthColor }}
                  />
                </div>
                <span style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
            {mode === 'signUp' && (
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder={c.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-neutral-900 text-white py-2.5 rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50"
            >
              {mode === 'signIn' ? c.submitSignIn : c.submitSignUp}
            </button>
          </motion.form>

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
