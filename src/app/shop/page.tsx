'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { getProducts, Product } from '@/lib/db';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  // Sync URL when category changes
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      router.push(`/shop?category=${category}`, { scroll: false });
    } else {
      router.push('/shop', { scroll: false });
    }
  };

  // Sync state when URL changes (e.g. browser back/forward)
  useEffect(() => {
    const cat = searchParams.get('category');
    setSelectedCategory(cat);
  }, [searchParams]);

  // Translated collection names
  const collections = [
    { id: 'oldmoney', title: t.home.oldMoney, image: '/images/old-money.jpg.png' },
    { id: 'streetwear', title: t.home.streetWear, image: '/images/streetwear.jpg.png' },
    { id: 'accessories', title: t.home.accessories, image: '/images/accessories.jpg.png' },
    { id: 'shoes', title: t.home.shoes, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=2069&auto=format&fit=crop' },
    { id: 'fragrances', title: t.home.fragrances, image: '/images/fragrances.jpg.png' }
  ];

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);

      // Background preload all product images
      data.forEach(product => {
        const img = new window.Image();
        img.src = product.imageUrl || '';
        // Also preload color variant images
        if (product.colorVariants) {
          product.colorVariants.forEach(cv => {
            const cvImg = new window.Image();
            cvImg.src = cv.imageUrl;
          });
        }
      });
    }
    load();
  }, []);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory) 
    : products;

  const currentCollection = collections.find(c => c.id === selectedCategory);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  return (
    <main className={styles.main}>
      <header className={styles.shopHeader}>
         <h1 className="fade-in-up">{selectedCategory ? currentCollection?.title : t.shop.theCollections}</h1>
         <p className="fade-in-up" style={{ animationDelay: '0.2s' }}>
           {selectedCategory ? t.shop.exploreCurated : t.shop.discoverCollections}
         </p>
         {selectedCategory && (
           <button 
             onClick={() => handleCategoryChange(null)} 
             className="btn-secondary" 
             style={{ marginTop: '2rem', padding: '0.5rem 1.5rem' }}
           >
             {t.shop.backToCollections}
           </button>
         )}
      </header>

      <div className={`container ${styles.shopContainer}`}>
        {loading ? (
           /* Skeleton loading grid */
           <div className={styles.productGrid}>
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className={styles.productCard} style={{ pointerEvents: 'none' }}>
                 <div className={styles.skeleton}></div>
                 <div className={styles.productInfo}>
                   <div className={styles.skeletonText}></div>
                   <div className={styles.skeletonTextShort}></div>
                 </div>
               </div>
             ))}
           </div>
        ) : !selectedCategory ? (
           <div className={styles.categoryGrid}>
              {collections.map((col) => (
                 <div key={col.id} className={styles.categoryCard} onClick={() => handleCategoryChange(col.id)}>
                    <div className={styles.categoryImageWrap}>
                      {!loadedImages.has(`cat-${col.id}`) && <div className={styles.skeleton}></div>}
                      <Image 
                        src={col.image}
                        alt={col.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className={styles.categoryImage}
                        onLoad={() => handleImageLoad(`cat-${col.id}`)}
                        priority
                      />
                    </div>
                    <h3 className={styles.categoryTitle}>{col.title}</h3>
                 </div>
              ))}
           </div>
        ) : filteredProducts.length === 0 ? (
           <div className={`fade-in-up ${styles.emptyState}`}>
             <h2>{t.shop.noProducts}</h2>
             <p>{t.shop.comingSoon}</p>
           </div>
        ) : (
           <div className={styles.productGrid}>
              {filteredProducts.map((product, index) => (
                 <Link href={`/product/${product.id}`} key={product.id!} className={styles.productCard}>
                    <div className={styles.imageBox}>
                      {!loadedImages.has(product.id!) && <div className={styles.skeleton}></div>}
                      <Image
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80'}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={styles.productImage}
                        onLoad={() => handleImageLoad(product.id!)}
                        priority={index < 4}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <h3>{product.title}</h3>
                      <p className={styles.price}>{typeof product.price === 'number' ? product.price.toFixed(2) : product.price} MAD</p>
                    </div>
                 </Link>
              ))}
           </div>
        )}
      </div>
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
