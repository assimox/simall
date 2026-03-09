'use client';
import { useState } from 'react';
import styles from './OrderForm.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { addProduct } from '@/lib/db'; // We will add an addOrder function next. Import temporarily to check syntax.
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type OrderFormProps = {
  productId: string;
  productName: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function OrderForm({ productId, productName, onSuccess, onCancel }: OrderFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, 'orders'), {
        productId,
        productName,
        customerName: name,
        phone,
        address,
        city,
        postalCode,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitting(false);
      onSuccess();
    } catch (error) {
       console.error("Error submitting order: ", error);
       setSubmitting(false);
       alert("An error occurred while submitting your order.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>{t.orderForm.title}</h3>
      <p className={styles.subtitle}>{productName}</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">{t.orderForm.name}</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder={t.orderForm.name}
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="phone">{t.orderForm.phone}</label>
          <input 
            type="tel" 
            id="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
            placeholder="+1 234 567 8900"
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="address">{t.orderForm.address}</label>
          <input 
            type="text" 
            id="address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div className={styles.inputGroup} style={{ flex: 1 }}>
             <label htmlFor="city">{t.orderForm.city}</label>
             <input 
               type="text" 
               id="city" 
               value={city} 
               onChange={(e) => setCity(e.target.value)} 
               required 
               className={styles.input}
             />
           </div>
           <div className={styles.inputGroup} style={{ flex: 1 }}>
             <label htmlFor="postalCode">{t.orderForm.postalCode}</label>
             <input 
               type="text" 
               id="postalCode" 
               value={postalCode} 
               onChange={(e) => setPostalCode(e.target.value)} 
               required 
               className={styles.input}
             />
           </div>
        </div>
        
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className="btn-secondary" style={{ padding: '0.75rem 1.5rem', flex: 1 }}>
             {/* Simple cancel text */}
             {t.nav.shop === 'Boutique' ? 'Annuler' : t.nav.shop === 'المتجر' ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" disabled={submitting} className={`btn-primary ${styles.submitBtn}`} style={{ padding: '0.75rem 1.5rem', flex: 2 }}>
            {submitting ? '...' : t.orderForm.submit}
          </button>
        </div>
      </form>
    </div>
  );
}
