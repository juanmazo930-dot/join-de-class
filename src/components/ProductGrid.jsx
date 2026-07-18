import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlipImage from './FlipImage';
import { useLocale } from '../hooks/useLocale';
import { useCart } from '../hooks/useCart';
import { formatPrice, getPrice } from '../utils/pricing';

function defaultSize(sizes) {
  return sizes.includes('M') ? 'M' : sizes[Math.floor(sizes.length / 2)];
}

function ProductCard({ product, onQuickView }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const { t, currency } = useLocale();
  const { addItem, openCart } = useCart();
  const variant = product.variants[variantIndex];

  function handleBuyNow(e) {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: getPrice(product.type, currency),
      currency,
      color: variant.color,
      img: variant.img,
      size: defaultSize(product.sizes),
    });
    openCart();
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg overflow-hidden border border-neutral-200 group"
    >
      <div className="relative">
        <FlipImage
          front={variant.img}
          back={variant.back}
          alt={`${product.name} ${variant.color}`}
          className="w-full aspect-[4/5] bg-neutral-100"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 bg-white/90 text-neutral-900 text-xs font-medium py-2 rounded-md hover:bg-white"
          >
            {t('quickView')}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-neutral-900 text-white text-xs font-medium py-2 rounded-md hover:bg-neutral-800"
          >
            {t('buyNow')}
          </button>
        </div>
      </div>
      <div className="p-3 text-left">
        <h4 className="font-semibold text-sm">{product.name}</h4>
        <p className="text-sm text-neutral-600 mt-1">{formatPrice(product.type, currency)}</p>
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.variants.map((v, i) => (
              <button
                key={v.color}
                onClick={() => setVariantIndex(i)}
                aria-label={`Color ${v.color}`}
                title={v.color}
                className={`w-4 h-4 rounded-full border ${
                  i === variantIndex ? 'ring-2 ring-offset-1 ring-neutral-900' : 'border-neutral-300'
                }`}
                style={{ backgroundColor: v.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ProductGrid({ products, onQuickView }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 md:max-w-[80%] md:mx-auto">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </AnimatePresence>
    </div>
  );
}
