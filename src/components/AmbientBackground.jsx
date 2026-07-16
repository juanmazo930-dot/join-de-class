import { motion } from 'framer-motion';
import c1 from '../assets/ambient/cutout-1.webp';
import c2 from '../assets/ambient/cutout-2.webp';
import c3 from '../assets/ambient/cutout-3.webp';

const LAYERS = [
  { src: c1, size: 520, top: '4%', left: '-4%', duration: 34 },
  { src: c2, size: 460, top: '40%', left: '82%', duration: 40 },
  { src: c3, size: 420, top: '70%', left: '2%', duration: 46 },
];

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {LAYERS.map((layer, i) => (
        <motion.img
          key={layer.src}
          src={layer.src}
          alt=""
          className="absolute"
          style={{
            width: layer.size,
            top: layer.top,
            left: layer.left,
            opacity: 0.1,
            filter: 'grayscale(1) contrast(1.05)',
          }}
          animate={{
            y: [0, -30, 20, 0],
            x: [0, 20, -15, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{ duration: layer.duration, repeat: Infinity, ease: 'easeInOut', delay: i * 3 }}
        />
      ))}
    </div>
  );
}
