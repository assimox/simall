'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getProducts, Product } from '@/lib/db';
import Link from 'next/link';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className={styles.main}>
      <header className={styles.shopHeader}>
         <h1 className="fade-in-up">The Collection</h1>
         <p className="fade-in-up" style={{ animationDelay: '0.2s' }}>Explore our latest arrivals, curated for you.</p>
      </header>

      <div className={`container ${styles.shopContainer}`}>
        {loading ? (
           <div className={styles.emptyState}>
             <div className={styles.spinner}></div>
           </div>
        ) : products.length === 0 ? (
           <div className={`fade-in-up ${styles.emptyState}`}>
             <h2>No products available yet.</h2>
             <p>This collection is currently being curated. Please check back later.</p>
             <Link href="/admin/products/new" className="btn-secondary" style={{ marginTop: '2rem' }}>Go to Admin</Link>
           </div>
        ) : (
           <div className={styles.productGrid}>
              {products.map((product) => (
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
