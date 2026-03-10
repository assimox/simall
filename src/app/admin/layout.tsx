'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Helper to read cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    if (getCookie('admin_auth') === 'true') {
      setAuthenticated(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Force a hard reload to clear any cached states and re-run middleware
    window.location.href = '/login';
  };

  if (!authenticated) {
    return <div style={{ height: '100vh', width: '100vw', background: '#fff' }} />;
  }

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
               <button 
                 onClick={handleLogout} 
                 style={{ 
                   backgroundColor: '#0056b3', 
                   color: '#fff', 
                   border: 'none', 
                   padding: '0.5rem 1.2rem', 
                   borderRadius: '9999px',
                   cursor: 'pointer',
                   fontWeight: 600,
                   fontSize: '0.85rem',
                   letterSpacing: '0.5px'
                 }}
               >
                 Exit Admin Panel
               </button>
            </div>
         </header>
         <div className={styles.contentPad}>
            {children}
         </div>
      </main>
    </div>
  );
}
