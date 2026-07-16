import { motion } from 'framer-motion';
import { useLocale } from '../hooks/useLocale';
import { MADRID_BANNER } from '../i18n/translations';

function getTimeSlot() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'night';
}

export default function MadridVibeBanner() {
  const { locale } = useLocale();
  const slot = getTimeSlot();
  const message = MADRID_BANNER[locale][slot];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-neutral-900 text-white text-sm text-center py-2 px-4"
    >
      {message}
    </motion.div>
  );
}
