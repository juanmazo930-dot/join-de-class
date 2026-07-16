import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [variantIndex, setVariantIndex] = useState(0);
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (product) {
      setVariantIndex(0);
      setSize(null);
    }
  }, [product]);

  if (!product) return null;

  const variant = product.variants[variantIndex];

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  function handleAddToCart() {
    if (!size) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: variant.color,
      img: variant.img,
      size,
    });
    onClose();
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden max-h-[90vh]">
              <div
                className="relative h-80 md:h-full overflow-hidden bg-neutral-100 cursor-zoom-in"
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={variant.img}
                  alt={`${product.name} ${variant.color}`}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out"
                  style={{
                    transformOrigin: origin,
                    transform: zoomed ? 'scale(1.8)' : 'scale(1)',
                  }}
                />
              </div>

              <div className="p-6 flex flex-col overflow-y-auto">
                <button
                  onClick={onClose}
                  aria-label="Cerrar vista rápida"
                  className="self-end text-neutral-500 hover:text-black mb-4"
                >
                  ✕
                </button>
                <h3 className="text-2xl font-bold text-neutral-900">{product.name}</h3>
                <p className="text-neutral-500 mt-1">{product.category}</p>
                <p className="text-xl font-semibold mt-4">{product.price} €</p>

                <div className="mt-6">
                  <p className="text-sm font-medium text-neutral-700 mb-2">
                    Color: {variant.color}
                  </p>
                  <div className="flex items-center gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.color}
                        onClick={() => setVariantIndex(i)}
                        aria-label={`Color ${v.color}`}
                        title={v.color}
                        className={`w-7 h-7 rounded-full border ${
                          i === variantIndex ? 'ring-2 ring-offset-1 ring-neutral-900' : 'border-neutral-300'
                        }`}
                        style={{ backgroundColor: v.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-700 mb-2">Talla</p>
                  <div className="flex items-center gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`w-10 h-10 rounded-md border text-sm font-medium transition-colors ${
                          size === s
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'border-neutral-300 hover:border-neutral-900'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto space-y-2 pt-6">
                  {!size && (
                    <p className="text-xs text-neutral-500">Elige una talla para continuar.</p>
                  )}
                  <button
                    onClick={handleAddToCart}
                    disabled={!size}
                    className="w-full bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Añadir al vestidor
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
