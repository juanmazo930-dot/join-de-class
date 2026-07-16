import { motion } from 'framer-motion';

const MADRID_MESSAGES = [
  { time: 'morning', text: 'Buenos días, Madrid ☀️ — recogida gratis hoy en Malasaña' },
  { time: 'afternoon', text: 'Sobremesa en el Retiro 🌳 — envío en el día para pedidos de Madrid capital' },
  { time: 'evening', text: 'Tardeo en Chueca 🍷 — nueva colección disponible' },
  { time: 'night', text: 'Madrid nunca duerme 🌙 — compra ahora, recibe mañana' },
];

function getTimeSlot() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'night';
}

export default function MadridVibeBanner() {
  const slot = getTimeSlot();
  const message = MADRID_MESSAGES.find((m) => m.time === slot) ?? MADRID_MESSAGES[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-neutral-900 text-white text-sm text-center py-2 px-4"
    >
      {message.text}
    </motion.div>
  );
}
