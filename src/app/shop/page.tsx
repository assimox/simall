'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getProducts, Product } from '@/lib/db';
import Link from 'next/link';

const collections = [
  { id: 'oldmoney', title: 'Old Money', image: '/images/old-money.jpg.png' },
  { id: 'streetwear', title: 'Street Wear', image: '/images/streetwear.jpg.png' },
  { id: 'accessories', title: 'Accessories', image: '/images/accessories.jpg.png' },
  { id: 'shoes', title: 'Shoes', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=2069&auto=format&fit=crop' }
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setTimeout(async () => {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
      }, 500);
    }
    load();
  }, []);

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory) 
    : products;

  const currentCollection = collections.find(c => c.id === selectedCategory);

  return (
    <main className={styles.main}>
      <header className={styles.shopHeader}>
         <h1 className="fade-in-up">{selectedCategory ? currentCollection?.title : 'The Collections'}</h1>
         <p className="fade-in-up" style={{ animationDelay: '0.2s' }}>
           {selectedCategory ? 'Explore curated pieces from this collection.' : 'Discover our distinct collections.'}
         </p>
         {selectedCategory && (
           <button 
             onClick={() => setSelectedCategory(null)} 
             className="btn-secondary" 
             style={{ marginTop: '2rem', padding: '0.5rem 1.5rem' }}
           >
             ← Back to Collections
           </button>
         )}
      </header>

      <div className={`container ${styles.shopContainer}`}>
        {loading ? (
           <div className={styles.emptyState}>
             <div className={styles.spinner}></div>
           </div>
        ) : !selectedCategory ? (
           <div className={styles.categoryGrid}>
              {collections.map((col) => (
                 <div key={col.id} className={styles.categoryCard} onClick={() => setSelectedCategory(col.id)}>
                    <div 
                      className={styles.categoryImage} 
                      style={{ backgroundImage: `url(${col.image})` }}
                    />
                    <h3 className={styles.categoryTitle}>{col.title}</h3>
                 </div>
              ))}
           </div>
        ) : filteredProducts.length === 0 ? (
           <div className={`fade-in-up ${styles.emptyState}`}>
             <h2>No products actually.</h2>
             <p>Coming soon...</p>
           </div>
        ) : (
           <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                 <Link href={`/product/${product.id}`} key={product.id!} className={styles.productCard}>
                    <div 
                      className={styles.imageBox} 
                      style={{ backgroundImage: `url(${product.imageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80'})` }}
                    />
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
