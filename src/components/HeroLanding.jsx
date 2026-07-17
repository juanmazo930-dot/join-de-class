import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import aireFresco from '../assets/hero/aire-fresco.webp';
import logoMark from '../assets/brand/logo-black.png';

const ARC_WORDS = ['AIRE', 'FRESCO'];
const CATEGORIES = ['Hombre', 'Mujer', 'Conjuntos'];

// Arc placement for each letter: center letters sit higher, edges tilt outward.
function arcStyle(index, total) {
  const t = total === 1 ? 0 : (index / (total - 1)) * 2 - 1; // -1 .. 1
  const rotate = t * 26;
  const lift = (1 - t * t) * 14;
  return {
    display: 'inline-block',
    transform: `rotate(${rotate}deg) translateY(${-lift}px)`,
  };
}

export default function HeroLanding({ onEnter }) {
  const [show] = useState(() => !sessionStorage.getItem('jtc-hero-seen'));
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const scrimRef = useRef(null);
  const lettersRef = useRef([]);
  const cRef = useRef(null);
  const sweepRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem('jtc-hero-seen', '1');
    document.body.style.overflow = 'hidden';

    const letters = lettersRef.current.filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.set(letters, { opacity: 0, y: 18 });
      gsap.set(cRef.current, { opacity: 0, scale: 0.85 });
      gsap.set(sweepRef.current, { xPercent: -160 });
      gsap.set(buttonsRef.current.children, { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.to(bgRef.current, { opacity: 1, duration: 0.9 })
        .to(letters, { opacity: 1, y: 0, duration: 0.5, stagger: 0.045, ease: 'back.out(1.6)' }, '-=0.4')
        .to(cRef.current, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.15')
        // one clean diagonal sweep across the C and the text - no loop, no hold
        .to(sweepRef.current, { xPercent: 220, duration: 0.9, ease: 'power2.inOut' }, '-=0.1')
        .to(buttonsRef.current.children, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.5');
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [show]);

  function handleEnter(category) {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        containerRef.current.style.display = 'none';
        document.body.style.overflow = '';
        onEnter(category);
      },
    });
  }

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-neutral-950 flex flex-col"
    >
      <img
        ref={bgRef}
        src={aireFresco}
        alt="Join The Class - Aire Fresco"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        style={{ filter: 'brightness(1.25) contrast(1.1)' }}
      />

      {/* local scrim over the baked logo area so our own text/C read crisp on top */}
      <div
        ref={scrimRef}
        className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full"
        style={{ background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.55), transparent 65%)' }}
      />

      <div className="pointer-events-none absolute inset-0 bg-black/15" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex items-end gap-4 mb-2" style={{ perspective: 600 }}>
          {ARC_WORDS.map((word, wi) => (
            <span key={word} className="flex">
              {word.split('').map((ch, ci) => {
                const globalIndex = wi === 0 ? ci : ARC_WORDS[0].length + ci;
                const total = ARC_WORDS.join('').length;
                return (
                  <span
                    key={`${word}-${ci}`}
                    ref={(el) => (lettersRef.current[globalIndex] = el)}
                    style={{
                      ...arcStyle(globalIndex, total),
                      color: '#f5c518',
                      textShadow: '0 2px 10px rgba(245,197,24,0.45)',
                    }}
                    className="text-3xl md:text-5xl font-black tracking-wide uppercase"
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          ))}
        </div>

        <div
          ref={cRef}
          className="w-[30vw] max-w-[220px] aspect-[134/145]"
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
            filter: 'drop-shadow(0 0 16px rgba(250,204,21,0.55))',
          }}
        />
      </div>

      {/* single diagonal light sweep - crosses once, no loop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={sweepRef}
          className="absolute top-0 left-0 h-full w-[30%]"
          style={{
            background: 'linear-gradient(75deg, transparent, rgba(255,255,255,0.3), transparent)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <div ref={buttonsRef} className="relative z-10 flex justify-center gap-4 pb-12 px-6 flex-wrap">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleEnter(category)}
            className="px-8 py-3 rounded-full border border-amber-300/70 text-amber-200 text-sm font-semibold tracking-[0.15em] uppercase backdrop-blur-sm bg-black/30 hover:bg-amber-300 hover:text-neutral-900 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
