'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById, Product } from '@/lib/db';
import styles from './page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import OrderForm from '@/components/OrderForm';

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      if (typeof id === 'string') {
        const data = await getProductById(id);
        setProduct(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main className={styles.main}>
         <div className={styles.spinner}></div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={styles.main}>
         <div className="container" style={{ textAlign: "center" }}>
            <h1>Product not found.</h1>
            <p>The item you are looking for does not exist or has been removed.</p>
         </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={`container ${styles.productGrid}`}>
         <div className={`fade-in-up ${styles.imageCol}`}>
            <img 
              src={product.imageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80'} 
              alt={product.title} 
              className={styles.productImage}
            />
         </div>
         <div className={`fade-in-up ${styles.infoCol}`} style={{ animationDelay: '0.2s' }}>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.price}>{typeof product.price === 'number' ? product.price.toFixed(2) : product.price} MAD</p>
             <div className={styles.description}>
               <p>{product.description}</p>
             </div>
             
             {!showOrderForm && !orderSuccess && (
                <button 
                  className={`btn-primary ${styles.addToCartBtn}`} 
                  onClick={() => setShowOrderForm(true)}
                >
                  {t.product.buyNow}
                </button>
             )}

             {showOrderForm && !orderSuccess && (
                <OrderForm 
                  productId={product.id as string} 
                  productName={product.title} 
                  onSuccess={() => setOrderSuccess(true)} 
                  onCancel={() => setShowOrderForm(false)} 
                />
             )}

             {orderSuccess && (
                <div className={styles.successMessage} style={{ padding: '1rem', backgroundColor: 'var(--foreground)', color: 'var(--background)', marginTop: '1rem', fontWeight: 500, textAlign: 'center' }}>
                   {t.orderForm.success}
                </div>
             )}
            
            <div className={styles.details} style={{ marginTop: '2rem' }}>
               <div className={styles.detailItem}>
                  <h4>{t.product.freeShippingTitle}</h4>
                  <p>{t.product.freeShippingDesc}</p>
               </div>
               <div className={styles.detailItem}>
                  <h4>{t.product.returnsTitle}</h4>
                  <p>{t.product.returnsDesc}</p>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
}
