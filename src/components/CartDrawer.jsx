import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useLocale } from '../hooks/useLocale';
import { formatAmount } from '../utils/pricing';
import CheckoutForm from './CheckoutForm';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, total, cartKey } = useCart();
  const { t, currency, shippingMessage } = useLocale();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col p-6"
          >
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold font-sans text-neutral-900">{t('yourWardrobe')}</h2>
              <button
                onClick={closeCart}
                aria-label={t('closeCart')}
                className="text-neutral-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <p className="text-neutral-500 text-center mt-20">{t('emptyCart')}</p>
              ) : (
                <motion.div layout className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={cartKey(item)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex items-center gap-4 p-2 border rounded-lg"
                      >
                        <img src={item.img} alt={item.name} className="w-16 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-xs text-neutral-500">
                            {item.color} · {t('size')} {item.size}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {formatAmount(item.price, item.currency ?? currency)}{' '}
                            {item.qty > 1 && `× ${item.qty}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(cartKey(item))}
                          aria-label={`${t('remove')} ${item.name}`}
                          className="text-neutral-400 hover:text-red-500 text-sm"
                        >
                          {t('remove')}
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between font-bold">
                <span>{t('total')}</span>
                <span>{formatAmount(total, currency)}</span>
              </div>
              <button
                disabled={items.length === 0}
                onClick={() => setCheckoutOpen(true)}
                className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('checkout')}
              </button>
              <p className="text-xs text-neutral-500 text-center">{shippingMessage}</p>
            </div>
          </motion.div>

          <CheckoutForm open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
        </>
      )}
    </AnimatePresence>
  );
}
