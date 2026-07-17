import { motion } from 'framer-motion';
import aireFresco from '../assets/hero/aire-fresco.webp';

export default function MenHero() {
  return (
    <div className="relative w-full overflow-hidden bg-neutral-950">
      <motion.img
        src={aireFresco}
        alt="Join The Class - Aire Fresco"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[38vh] md:h-[46vh] object-cover"
      />
    </div>
  );
}
