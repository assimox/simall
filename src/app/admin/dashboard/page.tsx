'use client';
import { useEffect, useState } from 'react';
import { getOrders, getProducts, Order, Product } from '@/lib/db';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import styles from '../admin.module.css';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // KPIs
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getOrders(), getProducts()]).then(([ordersData, productsData]) => {
      setOrders(ordersData);
      setProducts(productsData);
      setLoading(false);
      
      let revenue = 0;
      let pending = 0;
      let confirmed = 0;

      const revenueByDate: Record<string, number> = {};

      ordersData.forEach(order => {
        if (order.status === 'pending') pending++;
        if (order.status === 'confirmed') {
          confirmed++;
          
          const product = productsData.find(p => p.id === order.productId);
          // If the product exists, use its price, otherwise 0
          const price = product?.price || 0;
          const qty = order.quantity || 1;
          const orderRevenue = price * qty;
          revenue += orderRevenue;

          // Chart data grouping by date
          let dateStr = 'Unknown';
          if (order.createdAt?.seconds) {
            const d = new Date(order.createdAt.seconds * 1000);
            dateStr = d.toLocaleDateString('en-GB'); // Format like DD/MM/YYYY for easy reading
          }
          if (!revenueByDate[dateStr]) {
            revenueByDate[dateStr] = 0;
          }
          revenueByDate[dateStr] += orderRevenue;
        }
      });

      setTotalRevenue(revenue);
      setPendingCount(pending);
      setConfirmedCount(confirmed);

      // Map to array and reverse so it goes from oldest (left) to newest (right) horizontally
      const data = Object.keys(revenueByDate).map(date => ({
        date,
        revenue: revenueByDate[date]
      })).reverse();

      setChartData(data);
    });
  }, []);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading evolution data...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>The Evolution</h1>
        <p style={{ color: 'var(--muted-text)', fontFamily: 'var(--font-inter)' }}>Track your store performance and revenue growth.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--muted-text)', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>Total Revenue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', fontFamily: 'var(--font-inter)' }}>{totalRevenue.toLocaleString()} MAD</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--muted-text)', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>Confirmed Orders</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#155724', fontFamily: 'var(--font-inter)' }}>{confirmedCount}</p>
        </div>
        <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--muted-text)', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>Pending Orders</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#856404', fontFamily: 'var(--font-inter)' }}>{pendingCount}</p>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)', fontSize: '1.5rem' }}>Revenue Evolution</h3>
        <div style={{ width: '100%', height: 400 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={15} />
                <YAxis tick={{fontSize: 12}} tickFormatter={(val) => `${val} MAD`} width={80} />
                <Tooltip formatter={(val) => [`${val} MAD`, 'Revenue']} cursor={{ stroke: '#e5e5e5', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="revenue" stroke="#041e3a" strokeWidth={3} dot={{r: 4, fill: '#041e3a', strokeWidth: 2}} activeDot={{r: 6, fill: '#041e3a'}} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-text)', fontFamily: 'var(--font-inter)' }}>
              Not enough data for evolution chart. Confirm some orders to see the graph!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
