'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [phraseInput, setPhraseInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check session storage on mount
    if (sessionStorage.getItem('simall_admin_session') === '@1971H20AS08') {
      setAuthenticated(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (phraseInput === '@1971H20AS08') {
      sessionStorage.setItem('simall_admin_session', phraseInput);
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPhraseInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('simall_admin_session');
    setAuthenticated(false);
    setPhraseInput('');
    router.push('/');
  };

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        fontFamily: 'var(--font-inter)'
      }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.9rem',
            color: '#333',
            marginBottom: '2rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            To manage SIMALL store enter the secret phrase:
          </p>
          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column' }}>
            <input 
              type="password" 
              required 
              value={phraseInput}
              onChange={e => setPhraseInput(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '1rem',
                background: 'transparent',
                border: 'none',
                borderBottom: error ? '1px solid #dc3545' : '1px solid #ccc',
                color: error ? '#dc3545' : '#000',
                fontFamily: 'var(--font-inter)',
                fontSize: '1.2rem',
                textAlign: 'center',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
            />
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
         <div className={styles.sidebarHeader}>
            <h2>ADMIN</h2>
         </div>
         <nav className={styles.sidebarNav}>
            <Link href="/admin/dashboard">View The evolution</Link>
            <Link href="/admin/orders">Orders Dashboard</Link>
            <Link href="/admin">Products Manager</Link>
            <Link href="/admin/products/new">Add Product</Link>
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
