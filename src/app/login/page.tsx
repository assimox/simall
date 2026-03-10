'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    if (phrase === '@1971H20AS08') {
      setTimeout(() => {
        sessionStorage.setItem('admin_auth', 'true');
        router.push('/admin/orders');
      }, 500);
    } else {
      setLoading(false);
      setError(true);
      setPhrase('');
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.loginCard}>
         <p className={styles.promptText}>To manage SIMALL store enter the secret phrase:</p>
         <form onSubmit={handleLogin} className={styles.form}>
           <input 
             type="password" 
             required 
             value={phrase}
             onChange={e => setPhrase(e.target.value)}
             className={`${styles.secretInput} ${error ? styles.errorInput : ''}`}
             autoFocus
           />
         </form>
      </div>
    </main>
  );
}
