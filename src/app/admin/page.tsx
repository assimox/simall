'use client';
import { useEffect, useState } from 'react';
import { getProducts, deleteProduct, Product } from '@/lib/db';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(`Delete failed: ${err?.message || err}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Products</h1>
        <Link href="/admin/products/new" className="btn-primary">Add New Product</Link>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div className={styles.emptyTable}>
          <p>No products found. Start by adding one to your store.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <>
                  <tr key={p.id}>
                    <td>
                      <img src={p.imageUrl || 'https://via.placeholder.com/50'} alt={p.title} className={styles.tableImage} />
                    </td>
                    <td><strong>{p.title}</strong></td>
                    <td><span className={styles.statusBadge}>{p.category || '—'}</span></td>
                    <td>{typeof p.price === 'number' ? p.price.toFixed(2) : p.price} MAD</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link href={`/admin/products/edit/${p.id}`} className={styles.actionLink}>Edit</Link>
                        <span style={{ color: 'var(--border)' }}>|</span>
                        <Link href={`/product/${p.id}`} className={styles.actionLink}>View</Link>
                        <span style={{ color: 'var(--border)' }}>|</span>
                        <button onClick={() => setConfirmDeleteId(p.id!)} className={styles.deleteBtn}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {confirmDeleteId === p.id && (
                    <tr key={`confirm-${p.id}`} style={{ background: '#fff5f5' }}>
                      <td colSpan={5} style={{ padding: '0.75rem 1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-inter)', fontSize: '0.9rem' }}>
                          <span style={{ color: '#dc3545' }}>⚠️ Delete <strong>{p.title}</strong>? This cannot be undone.</span>
                          <button
                            onClick={() => handleDelete(p.id!)}
                            disabled={deleting}
                            style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '9999px', cursor: 'pointer', fontWeight: 600 }}
                          >
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            style={{ background: 'none', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '9999px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
