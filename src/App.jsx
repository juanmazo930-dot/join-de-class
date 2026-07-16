import { useState } from 'react';
import { CartProvider } from './hooks/useCart';
import CustomCursor from './components/CustomCursor';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import MadridVibeBanner from './components/MadridVibeBanner';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import VideoShowcase from './components/VideoShowcase';
import { CATEGORIES, PRODUCTS } from './data/products';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const filteredProducts = PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <CartProvider>
      <CustomCursor />
      <MadridVibeBanner />
      <Navbar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <VideoShowcase
        src={`${import.meta.env.BASE_URL}media/promo.mp4`}
        title="Nueva colección — Join the Class"
      />

      <main className="flex-1">
        <ProductGrid
          products={filteredProducts}
          category={activeCategory}
          onQuickView={setQuickViewProduct}
        />
      </main>

      <CartDrawer />
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </CartProvider>
  );
}
