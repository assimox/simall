'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (email === 'assim' && password === 'Assim200890@') {
      setTimeout(() => {
        localStorage.setItem('admin_auth', 'true');
        router.push('/admin/orders');
      }, 800);
    } else {
      setLoading(false);
      alert('Invalid credentials');
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.overlay}></div>
      <div className={`fade-in-up ${styles.loginCard}`}>
         <div className={styles.cardHeader}>
           <h1>SIMALL ADMIN</h1>
           <p>Sign in to manage your storefront</p>
         </div>

         <form onSubmit={handleLogin} className={styles.form}>
             <div className={styles.formGroup}>
               <label>Username</label>
               <input 
                 type="text" 
               required 
               value={email}
               onChange={e => setEmail(e.target.value)}
             />
           </div>
           
           <div className={styles.formGroup}>
             <label>Password</label>
             <input 
               type="password" 
               required 
               value={password}
               onChange={e => setPassword(e.target.value)}
             />
           </div>

           <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
             {loading ? 'Signing In...' : 'Sign In'}
           </button>
         </form>
         
         <div className={styles.footerInfo}>
            <p>Don't have an account? Please contact your developer.</p>
         </div>
      </div>
    </main>
  );
}
