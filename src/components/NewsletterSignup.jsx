import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocale } from '../hooks/useLocale';

const COPY = {
  es: {
    title: 'Únete a la lista exclusiva',
    body: 'Drops, descuentos y acceso anticipado.',
    placeholder: 'tu@correo.com',
    submit: 'Suscribirme',
    success: '¡Listo! Ya estás dentro.',
    unavailable: 'Newsletter no disponible todavía.',
  },
  en: {
    title: 'Join the exclusive list',
    body: 'Drops, discounts, and early access.',
    placeholder: 'you@email.com',
    submit: 'Subscribe',
    success: "You're in!",
    unavailable: 'Newsletter not available yet.',
  },
};

export default function NewsletterSignup() {
  const { subscribeNewsletter, isConfigured } = useAuth();
  const { locale } = useLocale();
  const c = COPY[locale];
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isConfigured) {
      setStatus('unavailable');
      return;
    }
    setStatus('loading');
    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('idle');
    }
  }

  return (
    <section className="border-t border-neutral-200 py-10 px-6 text-center">
      <h3 className="font-bold text-lg">{c.title}</h3>
      <p className="text-sm text-neutral-500 mt-1">{c.body}</p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto mt-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={c.placeholder}
          className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {c.submit}
        </button>
      </form>
      {status === 'success' && <p className="text-xs text-green-600 mt-2">{c.success}</p>}
      {status === 'unavailable' && <p className="text-xs text-neutral-400 mt-2">{c.unavailable}</p>}
    </section>
  );
}
