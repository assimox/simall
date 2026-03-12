'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById, Product } from '@/lib/db';
import styles from './page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/CartContext';
import OrderForm from '@/components/OrderForm';

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [displayImage, setDisplayImage] = useState('');

  useEffect(() => {
    async function load() {
      if (typeof id === 'string') {
        const data = await getProductById(id);
        setProduct(data);
        if (data) {
          setDisplayImage(data.imageUrl || '');
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleColorSelect = (index: number) => {
    if (!product?.colorVariants) return;
    setSelectedColor(index);
    setDisplayImage(product.colorVariants[index].imageUrl);
  };

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

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colorVariants && product.colorVariants.length > 0;

  return (
    <main className={styles.main}>
      <div className={`container ${styles.productGrid}`}>
         <div className={`fade-in-up ${styles.imageCol}`}>
            <img 
              src={displayImage || product.imageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80'} 
              alt={product.title} 
              className={styles.productImage}
            />

            {/* Color variant thumbnails below main image */}
            {hasColors && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {/* Default image thumbnail */}
                <button
                  onClick={() => { setSelectedColor(null); setDisplayImage(product.imageUrl); }}
                  style={{
                    width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden',
                    border: selectedColor === null ? '2px solid #041e3a' : '2px solid #eee',
                    cursor: 'pointer', padding: 0, background: 'none',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <img src={product.imageUrl} alt="Default" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
                {product.colorVariants!.map((cv, i) => (
                  <button
                    key={i}
                    onClick={() => handleColorSelect(i)}
                    title={cv.name}
                    style={{
                      width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden',
                      border: selectedColor === i ? '2px solid #041e3a' : '2px solid #eee',
                      cursor: 'pointer', padding: 0, background: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <img src={cv.imageUrl} alt={cv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
         </div>
         <div className={`fade-in-up ${styles.infoCol}`} style={{ animationDelay: '0.2s' }}>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.price}>{typeof product.price === 'number' ? product.price.toFixed(2) : product.price} MAD</p>
             <div className={styles.description}>
               <p>{product.description}</p>
             </div>

             {/* ========== SIZE SELECTOR ========== */}
             {hasSizes && (
               <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                 <span style={{ fontWeight: 600, fontFamily: 'var(--font-inter)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.6rem' }}>
                   SIZE {selectedSize && <span style={{ fontWeight: 400, color: '#666' }}>— {selectedSize}</span>}
                 </span>
                 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                   {product.sizes!.map((size) => (
                     <button
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       style={{
                         padding: '0.5rem 1.2rem',
                         borderRadius: '6px',
                         border: selectedSize === size ? '2px solid #041e3a' : '1px solid #ddd',
                         background: selectedSize === size ? '#041e3a' : '#fff',
                         color: selectedSize === size ? '#fff' : '#333',
                         cursor: 'pointer',
                         fontFamily: 'var(--font-inter)',
                         fontSize: '0.85rem',
                         fontWeight: 500,
                         transition: 'all 0.15s'
                       }}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {/* ========== COLOR NAME DISPLAY ========== */}
             {hasColors && selectedColor !== null && (
               <div style={{ marginBottom: '0.5rem' }}>
                 <span style={{ fontWeight: 600, fontFamily: 'var(--font-inter)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                   COLOR — <span style={{ fontWeight: 400, color: '#666' }}>{product.colorVariants![selectedColor].name}</span>
                 </span>
               </div>
             )}
             
             <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
               <span style={{ fontWeight: 500, fontFamily: 'var(--font-inter)', fontSize: '0.9rem' }}>QUANTITY</span>
               <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                 <button 
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                 >-</button>
                 <span style={{ padding: '0 1rem', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>{quantity}</span>
                 <button 
                   onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                   style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                 >+</button>
               </div>
               <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', textTransform: 'uppercase' }}>
                 {(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
               </span>
             </div>
             
             {!showOrderForm && !orderSuccess && (
                (product.stock || 0) > 0 ? (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                      className={`btn-primary ${styles.addToCartBtn}`} 
                      onClick={() => {
                        if (hasSizes && !selectedSize) { alert('Please select a size'); return; }
                        addToCart({
                          id: product.id as string,
                          title: product.title,
                          price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
                          imageUrl: displayImage || product.imageUrl || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80',
                          quantity: quantity,
                          selectedSize: selectedSize || undefined,
                          selectedColor: selectedColor !== null ? product.colorVariants![selectedColor].name : undefined,
                        });
                      }}
                      style={{ flex: 1 }}
                    >
                      {t.product.addToBag}
                    </button>
                    <button 
                      className={`btn-primary ${styles.addToCartBtn}`} 
                      onClick={() => {
                        if (hasSizes && !selectedSize) { alert('Please select a size'); return; }
                        setShowOrderForm(true);
                      }}
                      style={{ flex: 1, background: 'transparent', color: '#041e3a', border: '1px solid #041e3a' }}
                    >
                      {t.product.buyNow}
                    </button>
                  </div>
                ) : (
                  <button 
                    className={`btn-primary ${styles.addToCartBtn}`} 
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    SOLD OUT
                  </button>
                )
             )}

             {showOrderForm && !orderSuccess && (
                <OrderForm 
                  productId={product.id as string} 
                  productName={product.title} 
                  quantity={quantity}
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
