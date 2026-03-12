'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders, updateOrderStatus, markOrdersAsExported, Order } from '@/lib/db';
import * as xlsx from 'xlsx';
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
  const [exporting, setExporting] = useState(false);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const ordersToExport = orders.filter(o => o.status === 'confirmed' && !o.exportedToShipping);
      
      if (ordersToExport.length === 0) {
        alert('No new confirmed orders to export.');
        setExporting(false);
        return;
      }

      // Prepare data for Excel
      const excelData = ordersToExport.map(order => {
        let itemsDesc = '';
        let priceValue: any = order.totalPrice || '—';

        if (order.items && order.items.length > 0) {
          itemsDesc = order.items.map(i => {
             let base = `${i.quantity}x ${i.productName}`;
             if (i.variantKey) base += ` (${i.variantKey.replace('_', ' ')})`;
             return base;
          }).join(', ');
        } else {
           itemsDesc = `${order.quantity || 1}x ${order.productName}`;
           if (order.variantKey) itemsDesc += ` (${order.variantKey.replace('_', ' ')})`;
        }

        return {
          "NUMERO DE COMMANDE": order.id,
          "DESTINATAIRE": order.customerName,
          "TELEPHONE": order.phone,
          "ADRESSE": order.address,
          "PRIX": priceValue,
          "VILLE": order.city,
          "COMMENTAIRE": itemsDesc
        };
      });

      // Generate Excel file
      const ws = xlsx.utils.json_to_sheet(excelData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Commandes");
      
      const fileName = `Commandes_Livraison_${new Date().toISOString().split('T')[0]}.xlsx`;
      xlsx.writeFile(wb, fileName);

      // Mark as exported in DB
      const orderIds = ordersToExport.map(o => o.id as string);
      await markOrdersAsExported(orderIds);

      // Update local state
      setOrders(prev => prev.map(o => orderIds.includes(o.id!) ? { ...o, exportedToShipping: true } : o));
      
      alert(`Successfully exported ${ordersToExport.length} orders!`);

    } catch (error) {
      console.error("Export error", error);
      alert('Failed to export orders. Please ensure no files are open.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading orders...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Orders</h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: 'var(--muted-text)' }}>
            {orders.length} total orders
          </p>
        </div>
        <button 
           onClick={handleExport}
           disabled={exporting || orders.filter(o => o.status === 'confirmed' && !o.exportedToShipping).length === 0}
           className="btn-primary"
           style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#27ae60', borderColor: '#27ae60' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {exporting ? 'Exporting...' : `Export ${orders.filter(o => o.status === 'confirmed' && !o.exportedToShipping).length} New Orders`}
        </button>
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
                    <td style={{ fontSize: '0.85rem' }}>
                      {order.items && order.items.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--muted-text)' }}>
                          {order.items.map((i, idx) => (
                            <li key={idx}>
                              {i.quantity}x {i.productName} 
                              {i.variantKey && <span style={{fontSize: '0.75rem'}}> ({i.variantKey.replace('_', ' ')})</span>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div style={{color: 'var(--muted-text)'}}>
                          {order.quantity || 1}x {order.productName}
                          {order.variantKey && <span style={{fontSize: '0.75rem'}}> ({order.variantKey.replace('_', ' ')})</span>}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start' }}>
                        <span
                          className={styles.statusBadge}
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                        {order.exportedToShipping && (
                          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', color: '#666', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Exported
                          </span>
                        )}
                      </div>
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
