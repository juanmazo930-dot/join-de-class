import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useLocale } from '../hooks/useLocale';
import { useCart } from '../hooks/useCart';
import { formatAmount } from '../utils/pricing';
import { isValidSpanishId, isValidPostalCode } from '../utils/spanishId';

const COPY = {
  es: {
    title: 'Datos de envío y facturación',
    fullName: 'Nombre y apellidos',
    email: 'Correo electrónico',
    phone: 'Teléfono móvil',
    street: 'Calle',
    number: 'Número',
    floorDoor: 'Piso / Puerta',
    postalCode: 'Código postal',
    city: 'Localidad / Provincia',
    dni: 'DNI / NIE (opcional, solo si quieres factura)',
    gdpr: 'Acepto la Política de Privacidad y el tratamiento de mis datos conforme al RGPD.',
    submit: 'Confirmar pedido',
    close: 'Cerrar',
    invalidPostal: 'El código postal debe tener 5 dígitos.',
    invalidDni: 'DNI/NIE no válido (déjalo vacío si no necesitas factura).',
    gdprRequired: 'Debes aceptar la Política de Privacidad para continuar.',
    demoNotice:
      'Esto no procesa ningún pago real todavía — no hay pasarela de pago conectada. Solo guarda el pedido para revisión.',
    success: '¡Pedido recibido! Te contactaremos para confirmar el pago.',
    successDemo: 'Formulario validado correctamente (modo demo: no se guardó nada, falta conectar Firebase).',
  },
  en: {
    title: 'Shipping and billing details',
    fullName: 'Full name',
    email: 'Email',
    phone: 'Mobile phone',
    street: 'Street',
    number: 'Number',
    floorDoor: 'Floor / Door',
    postalCode: 'Postal code',
    city: 'City / Province',
    dni: 'DNI / NIE (optional, only if you need an invoice)',
    gdpr: 'I accept the Privacy Policy and GDPR data processing.',
    submit: 'Confirm order',
    close: 'Close',
    invalidPostal: 'Postal code must be 5 digits.',
    invalidDni: 'Invalid DNI/NIE (leave it empty if you don\'t need an invoice).',
    gdprRequired: 'You must accept the Privacy Policy to continue.',
    demoNotice: 'This does not process any real payment yet — no payment gateway is connected. It only saves the order for review.',
    success: 'Order received! We will contact you to confirm payment.',
    successDemo: 'Form validated correctly (demo mode: nothing was saved, Firebase is not connected yet).',
  },
};

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  number: '',
  floorDoor: '',
  postalCode: '',
  city: '',
  dni: '',
  gdpr: false,
};

export default function CheckoutForm({ open, onClose }) {
  const { locale, currency } = useLocale();
  const { isConfigured, submitOrder } = useAuth();
  const { items, total } = useCart();
  const c = COPY[locale];
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | done

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!isValidPostalCode(form.postalCode)) {
      setError(c.invalidPostal);
      return;
    }
    if (form.dni.trim() && !isValidSpanishId(form.dni)) {
      setError(c.invalidDni);
      return;
    }
    if (!form.gdpr) {
      setError(c.gdprRequired);
      return;
    }

    setStatus('submitting');
    try {
      if (isConfigured) {
        await submitOrder({ ...form, items, total, currency });
      }
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold text-neutral-900">{c.title}</h2>
                <button onClick={onClose} aria-label={c.close} className="text-neutral-500 hover:text-black">
                  ✕
                </button>
              </div>
              <p className="text-xs text-neutral-500 mb-4">{c.demoNotice}</p>

              {status === 'done' ? (
                <p className="text-sm text-green-700 py-8 text-center">
                  {isConfigured ? c.success : c.successDemo}
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <input
                    required
                    placeholder={c.fullName}
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      required
                      type="email"
                      placeholder={c.email}
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      required
                      type="tel"
                      placeholder={c.phone}
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      required
                      placeholder={c.street}
                      value={form.street}
                      onChange={(e) => update('street', e.target.value)}
                      className="col-span-2 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      required
                      placeholder={c.number}
                      value={form.number}
                      onChange={(e) => update('number', e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      placeholder={c.floorDoor}
                      value={form.floorDoor}
                      onChange={(e) => update('floorDoor', e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      required
                      inputMode="numeric"
                      maxLength={5}
                      placeholder={c.postalCode}
                      value={form.postalCode}
                      onChange={(e) => update('postalCode', e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      required
                      placeholder={c.city}
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <input
                    placeholder={c.dni}
                    value={form.dni}
                    onChange={(e) => update('dni', e.target.value.toUpperCase())}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                  />

                  <label className="flex items-start gap-2 text-xs text-neutral-600 pt-1">
                    <input
                      type="checkbox"
                      checked={form.gdpr}
                      onChange={(e) => update('gdpr', e.target.checked)}
                      className="mt-0.5"
                    />
                    {c.gdpr}
                  </label>

                  {error && <p className="text-xs text-red-600">{error}</p>}

                  <div className="flex justify-between font-bold text-sm pt-2">
                    <span>{formatAmount(total, currency)}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-neutral-900 text-white py-2.5 rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {c.submit}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
