import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import aireFresco from '../assets/hero/aire-fresco.webp';

const TAGLINE_1 = 'No sigas tendencias.';
const TAGLINE_2 = 'Crea tu propia clase.';
const EXIT_DELAY = 2300;
const EXIT_DURATION = 750;
const EASE = [0.16, 1, 0.3, 1];

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
      transition={{ duration: EXIT_DURATION / 1000, ease: EASE }}
      className="fixed inset-0 z-[100] overflow-hidden bg-neutral-950 cursor-pointer"
    >
      <motion.img
        src={aireFresco}
        alt=""
        initial={{ opacity: 0, scale: 1.22, filter: 'blur(22px)' }}
        animate={{ opacity: 1, scale: 1.06, filter: 'blur(0px)' }}
        transition={{
          opacity: { duration: 1.02, ease: EASE },
          filter: { duration: 1.17, ease: EASE },
          scale: { duration: (EXIT_DELAY + EXIT_DURATION) / 1000, ease: 'easeOut' },
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* soft gold glow breathing behind the C monogram */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 42%, rgba(250,204,21,0.4), transparent 45%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0.45] }}
        transition={{ duration: 1.9, times: [0, 0.5, 1], ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.3, delay: 0.4 }}
      />

      <div className="absolute inset-0 bg-black/35" />

      {/* one-shot light sweep for a premium reveal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ x: '-120%' }}
          animate={{ x: '160%' }}
          transition={{ duration: 1.1, delay: 1.15, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '35%',
            background: 'linear-gradient(75deg, transparent, rgba(255,255,255,0.22), transparent)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
          className="text-white text-xl md:text-3xl font-semibold tracking-wide drop-shadow-lg"
        >
          {TAGLINE_1}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
          className="text-white text-xl md:text-3xl font-semibold tracking-wide drop-shadow-lg"
        >
          {TAGLINE_2}
        </motion.p>
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.05, ease: EASE }}
          className="mt-6 text-white/70 text-xs tracking-[0.35em] uppercase"
        >
          Join The Class
        </motion.span>
      </div>
    </motion.div>
  );
}
