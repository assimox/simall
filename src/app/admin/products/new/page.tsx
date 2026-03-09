'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct } from '@/lib/db';
import styles from '../../admin.module.css';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        category: formData.category
      });
      router.push('/admin');
    } catch (error) {
      console.error(error);
      alert('Error adding product. Please make sure Firebase is configured properly in .env.local');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Add New Product</h1>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Product Title</label>
            <input 
              type="text" 
              className={styles.input} 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Classic Oxford Shirt"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Price (MAD)</label>
            <input 
              type="number" 
              step="0.01"
              className={styles.input} 
              required
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              placeholder="e.g. 129.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image URL</label>
            <input 
              type="url" 
              className={styles.input} 
              required
              value={formData.imageUrl}
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              placeholder="e.g. https://images.unsplash.com/..."
            />
            <span className={styles.helpText}>For this setup, please provide a direct URL to an image.</span>
          </div>

          <div className={styles.formGroup}>
            <label>Collection / Category</label>
            <select
              className={styles.input}
              required
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              style={{ borderRadius: '9999px', padding: '1rem' }}
            >
              <option value="" disabled>-- Select a collection --</option>
              <option value="oldmoney">Old Money</option>
              <option value="streetwear">Street Wear</option>
              <option value="accessories">Accessories</option>
              <option value="shoes">Shoes</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea 
              className={`${styles.input} ${styles.textarea}`} 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed product description..."
            />
          </div>

          <div className={styles.formActions}>
             <button type="submit" className="btn-primary" disabled={loading}>
               {loading ? 'Saving...' : 'Save Product'}
             </button>
             <button type="button" className="btn-secondary" onClick={() => router.push('/admin')}>
               Cancel
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
