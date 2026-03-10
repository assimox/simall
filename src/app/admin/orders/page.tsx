'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders, updateOrderStatus, Order } from '@/lib/db';
import styles from '../admin.module.css';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#856404', bg: '#fff3cd' },
  confirmed: { label: 'Confirmed', color: '#155724', bg: '#d4edda' },
  retour:    { label: 'Retour',    color: '#495057', bg: '#e2e3e5' },
  canceled:  { label: 'Canceled',  color: '#721c24', bg: '#f8d7da' },
} as const;

type OrderStatus = keyof typeof STATUS_CONFIG;

export default function OrdersDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    getOrders().then(data => { setOrders(data); setLoading(false); });
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId + newStatus);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert('Error updating status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading orders...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Orders</h1>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: 'var(--muted-text)' }}>
          {orders.length} total orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className={styles.emptyTable}>
          <p>No orders yet. When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Product</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const currentStatus = (order.status || 'pending') as OrderStatus;
                const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
                return (
                  <tr key={order.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--muted-text)' }}>
                      {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ fontWeight: 500 }}>{order.customerName}</td>
                    <td style={{ fontSize: '0.9rem' }}>{order.phone}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div>{order.address}</div>
                      <div style={{ color: 'var(--muted-text)' }}>{order.city} {order.postalCode}</div>
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>{order.productName}</td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {(['pending', 'confirmed', 'retour', 'canceled'] as OrderStatus[])
                          .filter(s => s !== currentStatus)
                          .map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(order.id!, s)}
                              disabled={updating === order.id + s}
                              className={styles.statusActionBtn}
                              style={{
                                background: STATUS_CONFIG[s].bg,
                                color: STATUS_CONFIG[s].color,
                                border: `1px solid ${STATUS_CONFIG[s].color}33`,
                              }}
                            >
                              {updating === order.id + s ? '...' : STATUS_CONFIG[s].label}
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
