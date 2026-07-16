import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import logo from '../assets/brand/logo-black.png';

export default function Navbar({ categories, activeCategory, onSelectCategory }) {
  const { items, openCart } = useCart();
  const itemCount = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white/90 backdrop-blur z-30">
      <span className="flex items-center gap-2 font-bold text-lg tracking-tight">
        <img src={logo} alt="Join the Class" className="h-7 w-auto" />
        Join the Class
      </span>

      <ul className="flex items-center gap-6">
        {categories.map((category) => (
          <li key={category} className="relative">
            <button
              onClick={() => onSelectCategory(category)}
              className={`pb-1 text-sm font-medium transition-colors ${
                activeCategory === category ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {category}
            </button>
            {activeCategory === category && (
              <motion.div
                layoutId="active"
                className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-neutral-900"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={openCart}
        aria-label="Abrir carrito"
        className="relative text-sm font-medium hover:text-neutral-600"
      >
        Vestidor
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-neutral-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </nav>
  );
}
