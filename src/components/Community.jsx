import { motion } from 'framer-motion';
import { useLocale } from '../hooks/useLocale';
import c1 from '../assets/community/community-1.webp';
import c2 from '../assets/community/community-2.webp';
import c3 from '../assets/community/community-3.webp';
import c4 from '../assets/community/community-4.webp';
import c5 from '../assets/community/community-5.webp';

const PHOTOS = [c1, c2, c3, c4, c5];

export default function Community() {
  const { t } = useLocale();

  return (
    <section className="border-t border-neutral-200 py-10 px-4">
      <h3 className="font-bold text-lg text-center mb-6">{t('community')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
        {PHOTOS.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="relative overflow-hidden rounded-lg bg-neutral-100 aspect-[4/5]"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
