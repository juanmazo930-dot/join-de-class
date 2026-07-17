import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import aireFresco from '../assets/hero/aire-fresco.webp';
import logoMark from '../assets/brand/logo-black.png';

const TAGLINE_1 = 'No sigas tendencias.';
const TAGLINE_2 = 'Crea tu propia clase.';
const SWEEP_DELAY = 1.3;
const SWEEP_DURATION = 1.1;
const C_HIT_DELAY = 2100; // ms - moment the light sweep crosses the C
const C_POP_DURATION = 900; // ms
const EXIT_DELAY = 3600;
const EXIT_DURATION = 800;
const EASE = [0.16, 1, 0.3, 1];

export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [activated, setActivated] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('jtc-intro-seen')) return;
    sessionStorage.setItem('jtc-intro-seen', '1');
    setShow(true);
    document.body.style.overflow = 'hidden';

    const hitTimer = setTimeout(() => setActivated(true), C_HIT_DELAY);
    const revealTimer = setTimeout(() => setRevealed(true), C_HIT_DELAY + C_POP_DURATION);
    const exitTimer = setTimeout(() => setExiting(true), EXIT_DELAY);
    const removeTimer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
    }, EXIT_DELAY + EXIT_DURATION);

    return () => {
      clearTimeout(hitTimer);
      clearTimeout(revealTimer);
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

      {/* flash burst the instant the light sweep hits the C */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,247,214,0.9), rgba(250,204,21,0.3) 45%, transparent 70%)' }}
        initial={{ opacity: 0, width: 40, height: 40 }}
        animate={activated ? { opacity: [0, 1, 0], width: [40, 420, 480], height: [40, 420, 480] } : {}}
        transition={{ duration: C_POP_DURATION / 1000, ease: 'easeOut' }}
      />

      {/* the C monogram, reborn in 3D when the light sweep touches it */}
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[34%] max-w-[220px] aspect-[134/145]"
        style={{ perspective: 900 }}
      >
        <motion.div
          className="w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={
            !activated
              ? { opacity: 0, scale: 0.6, rotateY: -130, rotateX: 12 }
              : revealed
              ? { opacity: 1, scale: 1, rotateY: [8, -8, 8], rotateX: [-3, 3, -3] }
              : { opacity: 1, scale: [0.6, 1.22, 1], rotateY: [-130, 24, 8], rotateX: [12, -6, -3] }
          }
          transition={
            revealed
              ? { duration: 3.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
              : { duration: C_POP_DURATION / 1000, ease: [0.34, 1.56, 0.64, 1] }
          }
        >
          <div
            className="w-full h-full"
            style={{
              WebkitMaskImage: `url(${logoMark})`,
              maskImage: `url(${logoMark})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              background: 'linear-gradient(135deg, #fef3c7, #f59e0b 55%, #fde68a)',
              filter: 'drop-shadow(0 0 18px rgba(250,204,21,0.65))',
            }}
          />
        </motion.div>
      </div>

      {/* one-shot light sweep for a premium reveal, glints across the C on the way through */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ x: '-120%' }}
          animate={{ x: '160%' }}
          transition={{ duration: SWEEP_DURATION, delay: SWEEP_DELAY, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '35%',
            background: 'linear-gradient(75deg, transparent, rgba(255,255,255,0.28), transparent)',
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
