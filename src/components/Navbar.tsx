'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/dictionaries';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

   return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContent}`}>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.homeIcon} aria-label="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.75z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </Link>
          <div className={styles.dropdownContainer}>
            <span className={styles.dropdownTrigger}>{t.nav.collections}</span>
            <div className={styles.dropdownMenu}>
              <Link href="/shop?category=oldmoney">{t.nav.oldMoney}</Link>
              <Link href="/shop?category=streetwear">{t.nav.streetWear}</Link>
              <Link href="/shop?category=accessories">{t.nav.accessories}</Link>
              <Link href="/shop?category=shoes">{t.nav.shoes}</Link>
            </div>
          </div>
          <a href="#contact" className={styles.contactLink}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'5px'}}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {t.nav.contactUs}
          </a>
        </div>
        
        <Link href="/" className={styles.logo}>
          <h1 style={{ fontFamily: 'var(--font-playfair)' }}>SIMALL</h1>
        </Link>
        
        <div className={styles.navActions}>
           <div className={styles.langSelector}>
              <button className={styles.langCurrent} style={{ textTransform: 'uppercase' }}>{language}</button>
              <div className={styles.langOptions}>
                 <button onClick={() => setLanguage('en')} className={styles.langBtn}>EN</button>
                 <button onClick={() => setLanguage('fr')} className={styles.langBtn}>FR</button>
                 <button onClick={() => setLanguage('ar')} className={styles.langBtn}>AR</button>
              </div>
           </div>
           {/* Admin link hidden — access via /admin-assim */}
           <Link href="/shop" className={styles.cartBtn}>{t.nav.cart}</Link>
        </div>
      </div>
    </nav>
  );
}
