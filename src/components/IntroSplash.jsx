import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import aireFresco from '../assets/hero/aire-fresco.webp';

const TAGLINE = 'No sigas tendencias. Crea tu propia clase.';
const EXIT_DELAY = 2000;
const EXIT_DURATION = 700;

export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('jtc-intro-seen')) return;
    sessionStorage.setItem('jtc-intro-seen', '1');
    setShow(true);
    document.body.style.overflow = 'hidden';

    const exitTimer = setTimeout(() => setExiting(true), EXIT_DELAY);
    const removeTimer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
    }, EXIT_DELAY + EXIT_DURATION);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!show) return null;

  return (
    <motion.div
      onClick={() => setExiting(true)}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION / 1000, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] overflow-hidden bg-neutral-950 cursor-pointer"
    >
      <motion.img
        src={aireFresco}
        alt=""
        initial={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-white text-xl md:text-3xl font-semibold tracking-wide max-w-lg drop-shadow-lg"
        >
          {TAGLINE}
        </motion.p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          className="mt-6 text-white/70 text-xs tracking-[0.35em] uppercase"
        >
          Join The Class
        </motion.span>
      </div>
    </motion.div>
  );
}
