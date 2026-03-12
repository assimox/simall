'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct, ColorVariant } from '@/lib/db';
import styles from '../../admin.module.css';

const CATEGORIES_WITH_OPTIONS = ['oldmoney', 'streetwear', 'shoes'];

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleFr: '',
    titleAr: '',
    description: '',
    descriptionFr: '',
    descriptionAr: '',
    price: '',
    imageUrl: '',
    category: '',
    stock: ''
  });

  // Sizes state
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');

  // Color variants state
  const [colorVariants, setColorVariants] = useState<any[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorNameFr, setNewColorNameFr] = useState('');
  const [newColorNameAr, setNewColorNameAr] = useState('');
  const [newColorImage, setNewColorImage] = useState('');

  // Variant stock state
  const [stockByVariant, setStockByVariant] = useState<Record<string, number>>({});

  const showOptions = CATEGORIES_WITH_OPTIONS.includes(formData.category);

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
      setColorVariants([...colorVariants, { 
        name: newColorName.trim(), 
        nameFr: newColorNameFr.trim(),
        nameAr: newColorNameAr.trim(),
        imageUrl: newColorImage.trim() 
      }]);
      setNewColorName('');
      setNewColorNameFr('');
      setNewColorNameAr('');
      setNewColorImage('');
    }
  };

  const removeColor = (index: number) => setColorVariants(colorVariants.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData: any = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        imageUrl: showOptions && colorVariants.length > 0 ? colorVariants[0].imageUrl : formData.imageUrl,
        category: formData.category,
        stock: parseInt(formData.stock) || 0
      };
      if (formData.titleFr) productData.titleFr = formData.titleFr;
      if (formData.titleAr) productData.titleAr = formData.titleAr;
      if (formData.descriptionFr) productData.descriptionFr = formData.descriptionFr;
      if (formData.descriptionAr) productData.descriptionAr = formData.descriptionAr;
      if (showOptions && sizes.length > 0) productData.sizes = sizes;
      if (showOptions && colorVariants.length > 0) productData.colorVariants = colorVariants;
      if (showOptions && Object.keys(stockByVariant).length > 0) productData.stockByVariant = stockByVariant;

      await addProduct(productData);
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
            <label>Product Title (English) *</label>
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
            <label>Product Title (French) <span style={{fontSize:'0.8rem', color:'#888'}}>- Optional</span></label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.titleFr}
              onChange={e => setFormData({...formData, titleFr: e.target.value})}
              placeholder="e.g. Chemise Oxford Classique"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Product Title (Arabic) <span style={{fontSize:'0.8rem', color:'#888'}}>- Optional</span></label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.titleAr}
              onChange={e => setFormData({...formData, titleAr: e.target.value})}
              placeholder="e.g. قميص أكسفورد كلاسيكي"
              dir="rtl"
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
            <label>Stock Quantity</label>
            <input 
              type="number" 
              className={styles.input} 
              required
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: e.target.value})}
              placeholder="e.g. 50"
            />
          </div>

          {/* Only show Image URL for categories without color variants */}
          {!showOptions && (
          <div className={styles.formGroup}>
            <label>Image URL</label>
            <input 
              type="url" 
              className={styles.input} 
              required={!showOptions}
              value={formData.imageUrl}
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              placeholder="e.g. https://images.unsplash.com/..."
            />
            <span className={styles.helpText}>For this setup, please provide a direct URL to an image.</span>
          </div>
          )}

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
              <option value="fragrances">Fragrances</option>
            </select>
          </div>

          {/* ========== SIZES (only for clothing/shoes) ========== */}
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

          {/* ========== COLOR VARIANTS (only for clothing/shoes) ========== */}
          {showOptions && (
            <div className={styles.formGroup}>
              <label>🎨 Color Variants</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', background: '#f8f9fa', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className={styles.input}
                    value={newColorName}
                    onChange={e => setNewColorName(e.target.value)}
                    placeholder="Color Name (EN) *"
                    style={{ flex: '1 1 120px' }}
                  />
                  <input
                    type="text"
                    className={styles.input}
                    value={newColorNameFr}
                    onChange={e => setNewColorNameFr(e.target.value)}
                    placeholder="Color Name (FR) - Optional"
                    style={{ flex: '1 1 120px' }}
                  />
                  <input
                    type="text"
                    className={styles.input}
                    value={newColorNameAr}
                    onChange={e => setNewColorNameAr(e.target.value)}
                    placeholder="Color Name (AR) - Optional"
                    style={{ flex: '1 1 120px' }}
                    dir="rtl"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    className={styles.input}
                    value={newColorImage}
                    onChange={e => setNewColorImage(e.target.value)}
                    placeholder="Image URL for this color *"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={addColor} className="btn-primary" style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap' }}>
                    + Add Color
                  </button>
                </div>
              </div>

              {colorVariants.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {colorVariants.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      background: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px',
                      border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      <img src={c.imageUrl} alt={c.name} style={{
                        width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px'
                      }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>FR: {c.nameFr || '-'} | AR: {c.nameAr || '-'}</span>
                      </div>
                      <button type="button" onClick={() => removeColor(i)} style={{
                        background: '#ffebee', border: '1px solid #ffcdd2', cursor: 'pointer', color: '#e74c3c',
                        fontWeight: 700, fontSize: '1.2rem', width: '30px', height: '30px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }} title="Remove color">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== VARIANT STOCK ========== */}
          {showOptions && (sizes.length > 0 || colorVariants.length > 0) && (
            <div className={styles.formGroup}>
              <label>📦 Stock per Variant</label>
              <div style={{ background: '#f8f9fa', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #ddd' }}>Color / Size</th>
                      <th style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #ddd', width: '110px' }}>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const keys: string[] = [];
                      if (sizes.length > 0 && colorVariants.length === 0) {
                        sizes.forEach(s => keys.push(s));
                      } else if (sizes.length === 0 && colorVariants.length > 0) {
                        colorVariants.forEach(c => keys.push(c.name));
                      } else {
                        colorVariants.forEach(c => {
                          sizes.forEach(s => keys.push(`${c.name}_${s}`));
                        });
                      }

                      return keys.map(key => (
                        <tr key={key}>
                          <td style={{ paddingTop: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: '#333' }}>
                            {key.replace('_', ' — ')}
                          </td>
                          <td style={{ paddingTop: '0.5rem' }}>
                            <input
                              type="number"
                              min="0"
                              className={styles.input}
                              style={{ padding: '0.5rem', margin: 0, width: '100%' }}
                              value={stockByVariant[key] !== undefined ? stockByVariant[key] : ''}
                              onChange={(e) => {
                                const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                                setStockByVariant(prev => {
                                  const next = { ...prev };
                                  if (val === undefined) delete next[key];
                                  else next[key] = val;
                                  return next;
                                });
                              }}
                              placeholder="0"
                            />
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Description (English) *</label>
            <textarea 
              className={`${styles.input} ${styles.textarea}`} 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed product description..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description (French) <span style={{fontSize:'0.8rem', color:'#888'}}>- Optional</span></label>
            <textarea 
              className={`${styles.input} ${styles.textarea}`} 
              value={formData.descriptionFr}
              onChange={e => setFormData({...formData, descriptionFr: e.target.value})}
              placeholder="Description détaillée du produit..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description (Arabic) <span style={{fontSize:'0.8rem', color:'#888'}}>- Optional</span></label>
            <textarea 
              className={`${styles.input} ${styles.textarea}`} 
              value={formData.descriptionAr}
              onChange={e => setFormData({...formData, descriptionAr: e.target.value})}
              placeholder="وصف مفصل للمنتج..."
              dir="rtl"
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
