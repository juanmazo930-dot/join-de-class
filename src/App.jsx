import { useState } from 'react';
import { CartProvider } from './hooks/useCart';
import CustomCursor from './components/CustomCursor';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import MadridVibeBanner from './components/MadridVibeBanner';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import VideoShowcase from './components/VideoShowcase';
import AuthGate from './components/AuthGate';
import NewsletterSignup from './components/NewsletterSignup';
import { useLocale } from './hooks/useLocale';
import { CATEGORIES, PRODUCTS } from './data/products';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { t } = useLocale();

  const filteredProducts = PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <CartProvider>
      <CustomCursor />
      <AuthGate>
        <MadridVibeBanner />
        <Navbar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onGoHome={() => {
            setActiveCategory(CATEGORIES[0]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <VideoShowcase
          src={`${import.meta.env.BASE_URL}media/promo.mp4`}
          title={t('newCollection')}
        />

        <main className="flex-1">
          <ProductGrid products={filteredProducts} onQuickView={setQuickViewProduct} />
        </main>

        <NewsletterSignup />

        <CartDrawer />
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      </AuthGate>
    </CartProvider>
  );
}
