import { motion } from 'framer-motion';

export default function VideoShowcase({ src, title = 'Nueva colección' }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center bg-neutral-950"
    >
      <div className="relative w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto aspect-[4/5] overflow-hidden">
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
      </div>
    </motion.section>
  );
}
