import { motion } from 'framer-motion';

export default function VideoShowcase({ src, title = 'Nueva colección' }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full aspect-[4/5] max-h-[70vh] overflow-hidden bg-neutral-950"
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
    </motion.section>
  );
}
