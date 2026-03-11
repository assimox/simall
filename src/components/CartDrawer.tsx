'use client';

import { useCart } from '@/lib/CartContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, isDrawerOpen, setDrawerOpen, clearCart } = useCart();
  const { t } = useLanguage();

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`${styles.backdrop} ${isDrawerOpen ? styles.open : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <h3>{t.nav.cart} ({totalItems})</h3>
          <button onClick={() => setDrawerOpen(false)} className={styles.closeBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p>{t.nav.cart}</p>
              <span style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                {t.shop?.noProducts || 'Your cart is empty'}
              </span>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.imageUrl} alt={item.title} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <h4>{item.title}</h4>
                  <p className={styles.itemPrice}>{item.price.toFixed(2)} MAD</p>
                  <div className={styles.quantityRow}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with total and checkout */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalPrice}>{totalPrice.toFixed(2)} MAD</span>
            </div>
            <button className={styles.clearBtn} onClick={clearCart}>
              🗑 Clear All
            </button>
          </div>
        )}
      </div>
    </>
  );
}
