import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STRINGS, CATEGORY_LABELS } from '../i18n/translations';

const LocaleContext = createContext(null);

// Espana + Latinoamerica -> espanol. Resto del mundo -> ingles.
const SPANISH_SPEAKING_COUNTRIES = new Set([
  'ES', 'CO', 'MX', 'AR', 'CL', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY',
  'GT', 'HN', 'SV', 'NI', 'CR', 'PA', 'DO', 'PR', 'GQ',
]);

function localeFromBrowser() {
  const lang = (navigator.language || 'en').toLowerCase();
  return lang.startsWith('es') ? 'es' : 'en';
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(localeFromBrowser);
  const [currency, setCurrency] = useState('EUR');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    // Geolocalizacion por IP gratuita, sin API key. Si falla o tarda,
    // nos quedamos con el idioma del navegador (ya seteado arriba).
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const country = data?.country_code;
        if (!country) return;
        setLocale(SPANISH_SPEAKING_COUNTRIES.has(country) ? 'es' : 'en');
        setCurrency(country === 'CO' ? 'COP' : 'EUR');
      })
      .catch(() => {
        // Sin conexion a la API de geolocalizacion: nos quedamos con
        // el idioma del navegador y EUR como moneda por defecto.
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const value = useMemo(() => {
    const t = (key) => STRINGS[locale][key] ?? STRINGS.es[key] ?? key;
    const categoryLabel = (category) => CATEGORY_LABELS[locale][category] ?? category;
    return { locale, currency, t, categoryLabel, setLocale, setCurrency };
  }, [locale, currency]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
