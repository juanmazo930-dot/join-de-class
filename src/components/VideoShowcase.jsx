import { motion } from 'framer-motion';

export default function VideoShowcase({ src, title = 'Nueva colección', compact = false }) {
  return (
    <motion.section
      layout
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      className={compact ? 'w-full lg:w-72 shrink-0 bg-neutral-950' : 'w-full flex justify-center bg-neutral-950'}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        className={
          compact
            ? 'relative w-full lg:sticky lg:top-20 aspect-[4/5] overflow-hidden rounded-lg lg:mt-4 lg:ml-4'
            : 'relative w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto aspect-[4/5] overflow-hidden'
        }
      >
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 text-white text-sm font-semibold tracking-wide uppercase drop-shadow">
          {title}
        </div>
      </motion.div>
    </motion.section>
  );
}
