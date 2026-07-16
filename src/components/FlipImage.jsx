import { useState } from 'react';
import { motion } from 'framer-motion';
import { lazyImageProps } from '../utils/imageLoader';
import { useLocale } from '../hooks/useLocale';

export default function FlipImage({ front, back, alt, className = '', imgClassName = '', style }) {
  const [flipped, setFlipped] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { t } = useLocale();

  return (
    <div className={`relative ${className}`} style={{ perspective: '1200px', ...style }}>
      {!loaded && <div className="absolute inset-0 shimmer z-10" />}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      >
        <img
          src={front}
          alt={alt}
          {...lazyImageProps}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
          style={{ backfaceVisibility: 'hidden' }}
        />
        {back && (
          <img
            src={back}
            alt={`${alt} — ${t('viewBack').toLowerCase()}`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          />
        )}
      </motion.div>

      {back && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFlipped((f) => !f);
          }}
          aria-label={flipped ? t('viewFront') : t('viewBack')}
          className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white text-neutral-900 text-xs font-medium px-2.5 py-1 rounded-full shadow"
        >
          {flipped ? t('viewFront') : t('viewBack')}
        </button>
      )}
    </div>
  );
}
