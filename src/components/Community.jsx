import { motion } from 'framer-motion';
import { useLocale } from '../hooks/useLocale';
import c1 from '../assets/community/community-1.webp';
import c2 from '../assets/community/community-2.webp';
import c3 from '../assets/community/community-3.webp';
import c4 from '../assets/community/community-4.webp';
import c5 from '../assets/community/community-5.webp';
import c6 from '../assets/community/community-6.webp';
import c7 from '../assets/community/community-7.webp';
import c8 from '../assets/community/community-8.webp';
import c9 from '../assets/community/community-9.webp';
import c10 from '../assets/community/community-10.webp';
import c11 from '../assets/community/community-11.webp';

const PHOTOS = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11];

export default function Community() {
  const { t } = useLocale();

  return (
    <section className="border-t border-neutral-200 py-10 px-4">
      <h3 className="font-bold text-lg text-center mb-6">{t('community')}</h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-w-5xl mx-auto">
        {PHOTOS.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.35, delay: (i % 5) * 0.05 }}
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
