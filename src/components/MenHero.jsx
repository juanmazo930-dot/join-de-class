import { motion } from 'framer-motion';
import aireFresco from '../assets/hero/aire-fresco.webp';

export default function MenHero({ active }) {
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: active ? 'auto' : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden bg-neutral-950"
    >
      <motion.img
        src={aireFresco}
        alt="Join The Class - Aire Fresco"
        initial={{ opacity: 0, scale: 1.15, filter: 'blur(14px)' }}
        animate={
          active
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, scale: 0.9, filter: 'blur(10px)' }
        }
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[38vh] md:h-[46vh] object-cover"
      />
    </motion.div>
  );
}
