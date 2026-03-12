'use client';

import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './CartDrawer.module.css';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, isDrawerOpen, setDrawerOpen, clearCart } = useCart();
  const { t } = useLanguage();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Build items summary
      const itemsSummary = items.map(i => `${i.title} x${i.quantity}`).join(', ');

      await addDoc(collection(db, 'orders'), {
        items: items.map(i => ({ productId: i.id, productName: i.title, quantity: i.quantity, price: i.price })),
        totalPrice,
        customerName: name,
        phone,
        address,
        city,
        postalCode,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Send Telegram notification
      try {
        const botToken = '8717201973:AAHSbGw1LvkrL7FAaTpmMpWSYy10norSR-g';
        const chatId = '7769220796';
        const itemsList = items.map(i => `  • ${i.title} × ${i.quantity} = ${(i.price * i.quantity).toFixed(2)} MAD`).join('\n');
        const message = `🛒 *طلب جديد من السلة!*\n\n📦 *المنتجات:*\n${itemsList}\n\n💰 *المجموع: ${totalPrice.toFixed(2)} MAD*\n\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📍 العنوان: ${address}, ${city} ${postalCode}`;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
        });
      } catch { /* Telegram error should not block order */ }

      setSubmitting(false);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error submitting order: ", error);
      setSubmitting(false);
      alert("An error occurred while submitting your order.");
    }
  };

  const handleClose = () => {
    setDrawerOpen(false);
    // Reset checkout state when closing
    setTimeout(() => {
      setShowCheckout(false);
      setOrderSuccess(false);
      setName('');
      setPhone('');
      setAddress('');
      setCity('');
      setPostalCode('');
    }, 350);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`${styles.backdrop} ${isDrawerOpen ? styles.open : ''}`}
        onClick={handleClose}
      />

      {/* Drawer panel */}
      <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <h3>
            {orderSuccess ? '✅' : showCheckout ? t.orderForm.title : `${t.nav.cart} (${totalItems})`}
          </h3>
          <button onClick={handleClose} className={styles.closeBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Order Success */}
        {orderSuccess ? (
          <div className={styles.items}>
            <div className={styles.empty}>
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p style={{ color: '#27ae60', fontWeight: 600, fontSize: '1.05rem' }}>{t.orderForm.success}</p>
            </div>
          </div>
        ) : showCheckout ? (
          /* Checkout Form */
          <div className={styles.items} style={{ padding: '1.25rem 1.5rem' }}>
            {/* Order summary */}
            <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-inter)' }}>
                  <span style={{ color: '#333' }}>{item.title} × {item.quantity}</span>
                  <span style={{ color: '#666', fontWeight: 600 }}>{(item.price * item.quantity).toFixed(2)} MAD</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid #eee', fontFamily: 'var(--font-inter)', color: '#041e3a' }}>
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} MAD</span>
              </div>
            </div>

            {/* Customer form */}
            <form onSubmit={handleSubmitOrder}>
              <div className={styles.formGroup}>
                <label>{t.orderForm.name}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder={t.orderForm.name} />
              </div>
              <div className={styles.formGroup}>
                <label>{t.orderForm.phone}</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+212 6XX XXX XXX" />
              </div>
              <div className={styles.formGroup}>
                <label>{t.orderForm.address}</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required placeholder={t.orderForm.address} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>{t.orderForm.city}</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} required />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>{t.orderForm.postalCode}</label>
                  <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCheckout(false)} className={styles.clearBtn} style={{ flex: 1 }}>
                  ← {t.nav.cart}
                </button>
                <button type="submit" disabled={submitting} className={styles.buyNowBtn} style={{ flex: 2 }}>
                  {submitting ? '...' : t.orderForm.submit}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Cart items list */
          <>
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

            {/* Footer */}
            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.totalPrice}>{totalPrice.toFixed(2)} MAD</span>
                </div>
                <button className={styles.buyNowBtn} onClick={() => setShowCheckout(true)}>
                  {t.product.buyNow}
                </button>
                <button className={styles.clearBtn} onClick={clearCart} style={{ marginTop: '0.5rem' }}>
                  🗑 Clear All
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
