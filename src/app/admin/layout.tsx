'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/login');
  };
  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
         <div className={styles.sidebarHeader}>
            <h2>ADMIN</h2>
         </div>
         <nav className={styles.sidebarNav}>
            <Link href="/admin/orders">Orders Dashboard</Link>
            <Link href="/admin/products/new">Add Product</Link>
            {/* Note: In a larger app, you'd list products here too */}
            <Link href="/" className={styles.storefrontLink}>View Storefront</Link>
         </nav>
      </aside>
      <main className={styles.mainContent}>
         <header className={styles.topbar}>
            <div className={styles.topbarRight}>
               <span>Assim</span>
               <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Logout</button>
            </div>
         </header>
         <div className={styles.contentPad}>
            {children}
         </div>
      </main>
    </div>
  );
}
