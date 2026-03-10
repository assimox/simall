'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProductById, updateProduct } from '@/lib/db';
import styles from '../../../admin.module.css';

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    if (!id) return;
    getProductById(id).then(product => {
      if (!product) { router.push('/admin'); return; }
      setFormData({
        title: product.title,
        description: product.description,
        price: String(product.price),
        imageUrl: product.imageUrl,
        category: product.category || '',
        stock: String(product.stock || 0),
      });
      setLoading(false);
    });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProduct(id, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
      });
      router.push('/admin');
    } catch {
      alert('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem' }}>Loading product...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Edit Product</h1>
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
              onChange={e => setFormData({ ...formData, title: e.target.value })}
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
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Stock Quantity</label>
            <input
              type="number"
              className={styles.input}
              required
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image URL</label>
            <input
              type="url"
              className={styles.input}
              required
              value={formData.imageUrl}
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Collection / Category</label>
            <select
              className={styles.input}
              required
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              style={{ borderRadius: '9999px', padding: '1rem' }}
            >
              <option value="" disabled>-- Select a collection --</option>
              <option value="oldmoney">Old Money</option>
              <option value="streetwear">Street Wear</option>
              <option value="accessories">Accessories</option>
              <option value="shoes">Shoes</option>
              <option value="fragrances">Fragrances</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
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
