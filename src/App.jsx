import { useState } from 'react';
import { CartProvider } from './hooks/useCart';
import IntroSplash from './components/IntroSplash';
import CustomCursor from './components/CustomCursor';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import MadridVibeBanner from './components/MadridVibeBanner';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import VideoShowcase from './components/VideoShowcase';
import AuthGate from './components/AuthGate';
import NewsletterSignup from './components/NewsletterSignup';
import Community from './components/Community';
import AmbientBackground from './components/AmbientBackground';
import { useLocale } from './hooks/useLocale';
import { CATEGORIES, PRODUCTS } from './data/products';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { t } = useLocale();

  const filteredProducts = PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <CartProvider>
      <IntroSplash />
      <CustomCursor />
      <AuthGate>
        <AmbientBackground />
        <MadridVibeBanner />
        <Navbar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={(category) => {
            setActiveCategory(category);
            setHasNavigated(true);
          }}
          onGoHome={() => {
            setActiveCategory(CATEGORIES[0]);
            setHasNavigated(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <div className={hasNavigated ? 'lg:flex lg:items-start' : ''}>
          <VideoShowcase
            src={`${import.meta.env.BASE_URL}media/promo.mp4`}
            title={t('newCollection')}
            compact={hasNavigated}
          />

          <main className="flex-1">
            <ProductGrid products={filteredProducts} onQuickView={setQuickViewProduct} />
          </main>
        </div>

        <Community />
        <NewsletterSignup />

        <CartDrawer />
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      </AuthGate>
    </CartProvider>
  );
}
