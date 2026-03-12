'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProductById, updateProduct, ColorVariant } from '@/lib/db';
import styles from '../../../admin.module.css';

const CATEGORIES_WITH_OPTIONS = ['oldmoney', 'streetwear', 'shoes'];

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

  // Sizes state
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');

  // Color variants state
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorImage, setNewColorImage] = useState('');

  const showOptions = CATEGORIES_WITH_OPTIONS.includes(formData.category);

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
      if (product.sizes) setSizes(product.sizes);
      if (product.colorVariants) setColorVariants(product.colorVariants);
      setLoading(false);
    });
  }, [id, router]);

  const addSize = () => {
    const s = newSize.trim().toUpperCase();
    if (s && !sizes.includes(s)) {
      setSizes([...sizes, s]);
      setNewSize('');
    }
  };

  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

  const addColor = () => {
    if (newColorName.trim() && newColorImage.trim()) {
      setColorVariants([...colorVariants, { name: newColorName.trim(), imageUrl: newColorImage.trim() }]);
      setNewColorName('');
      setNewColorImage('');
    }
  };

  const removeColor = (index: number) => setColorVariants(colorVariants.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const productData: any = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
      };
      if (showOptions) {
        productData.sizes = sizes.length > 0 ? sizes : [];
        productData.colorVariants = colorVariants.length > 0 ? colorVariants : [];
      }

      await updateProduct(id, productData);
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

          {/* ========== SIZES ========== */}
          {showOptions && (
            <div className={styles.formGroup}>
              <label>📏 Sizes</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className={styles.input}
                  value={newSize}
                  onChange={e => setNewSize(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSize(); } }}
                  placeholder="e.g. S, M, L, XL, 40, 41..."
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={addSize} className="btn-primary" style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                  + Add
                </button>
              </div>
              {sizes.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {sizes.map((s, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      background: '#f0f0f0', padding: '0.4rem 0.8rem', borderRadius: '20px',
                      fontSize: '0.85rem', fontWeight: 500
                    }}>
                      {s}
                      <button type="button" onClick={() => removeSize(i)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c',
                        fontWeight: 700, fontSize: '1rem', padding: 0, lineHeight: 1
                      }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== COLOR VARIANTS ========== */}
          {showOptions && (
            <div className={styles.formGroup}>
              <label>🎨 Color Variants</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className={styles.input}
                  value={newColorName}
                  onChange={e => setNewColorName(e.target.value)}
                  placeholder="Color name (e.g. Black)"
                  style={{ flex: '1 1 120px' }}
                />
                <input
                  type="url"
                  className={styles.input}
                  value={newColorImage}
                  onChange={e => setNewColorImage(e.target.value)}
                  placeholder="Image URL for this color"
                  style={{ flex: '2 1 200px' }}
                />
                <button type="button" onClick={addColor} className="btn-primary" style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                  + Add
                </button>
              </div>
              {colorVariants.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {colorVariants.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      background: '#f9f9f9', padding: '0.5rem 0.75rem', borderRadius: '10px',
                      border: '1px solid #eee'
                    }}>
                      <img src={c.imageUrl} alt={c.name} style={{
                        width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px'
                      }} />
                      <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{c.name}</span>
                      <button type="button" onClick={() => removeColor(i)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c',
                        fontWeight: 700, fontSize: '1.1rem', padding: 0
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
