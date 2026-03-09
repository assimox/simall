'use client';
import styles from './page.module.css';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageOverlay} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop')" }}></div>
        <div className={styles.heroContent}>
          <h2 className={`fade-in-up ${styles.heroTitle}`}>{t.home.heroTitle}</h2>
          <div className="decorative-line fade-in-up" style={{ animationDelay: '0.1s' }}></div>
          <p className={`fade-in-up ${styles.heroSubtitle}`} style={{ animationDelay: '0.2s' }}>
            {t.home.heroSubtitle}
          </p>
          <div className="fade-in-up" style={{ animationDelay: '0.4s', marginTop: '2rem' }}>
            <Link href="/shop" className="btn-primary" style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>{t.home.shopCollection}</Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className={`container ${styles.categories}`}>
         <div className={styles.sectionHeader}>
           <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-playfair)', fontWeight: 400 }}>{t.home.curatedCollections}</h3>
           <Link href="/shop" className={styles.viewAll}>{t.home.viewAll}</Link>
         </div>
         <div className={styles.grid}>
           {/* Old Money Aesthetic */}
           <div className={styles.card}>
             <div className={styles.cardImageHolder} style={{ backgroundImage: "url('/images/old-money.jpg.png')" }}></div>
             <h4 className={styles.cardTitle}>{t.home.oldMoney}</h4>
           </div>
           
           {/* Streetwear Aesthetic */}
           <div className={styles.card}>
             <div className={styles.cardImageHolder} style={{ backgroundImage: "url('/images/streetwear.jpg.png')" }}></div>
             <h4 className={styles.cardTitle}>{t.home.streetWear}</h4>
           </div>
           
           {/* Vintage / Accesories */}
           <div className={styles.card}>
             <div className={styles.cardImageHolder} style={{ backgroundImage: "url('/images/accessories.jpg.png')" }}></div>
             <h4 className={styles.cardTitle}>{t.home.accessories}</h4>
           </div>
           
           {/* Shoes */}
           <div className={styles.card}>
             <div className={styles.cardImageHolder} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=2069&auto=format&fit=crop')" }}></div>
             <h4 className={styles.cardTitle}>{t.home.shoes}</h4>
           </div>
         </div>
      </section>
      
      {/* Brand Value Section */}
      <section className={styles.brandHero} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className={styles.brandContent}>
          <div className="decorative-line fade-in-up" style={{ margin: '0 auto 2rem auto', backgroundColor: 'var(--background)' }}></div>
          <h3 className="fade-in-up" style={{ color: 'var(--background)' }}>{t.home.heritageTitle}</h3>
          <p className="fade-in-up" style={{ animationDelay: '0.2s', fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--background)' }}>{t.home.heritageDesc}</p>
          <div className="decorative-line fade-in-up" style={{ margin: '2rem auto 0 auto', animationDelay: '0.4s', backgroundColor: 'var(--background)' }}></div>
        </div>
      </section>

      {/* Contact & Social Footer */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div className="decorative-line" style={{ margin: '0 auto 2.5rem auto' }}></div>
          <h3 className={styles.contactTitle}>Get In Touch</h3>
          <p className={styles.contactSub}>We'd love to hear from you. Reach out through any channel below.</p>

          <div className={styles.contactActions}>
            {/* Phone - click to copy */}
            <button
              className={styles.contactBtn}
              onClick={() => { navigator.clipboard.writeText('+212637164988'); alert('Phone number copied! +212637164988'); }}
              title="Click to copy phone number"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>+212 637 164 988</span>
            </button>

            {/* Email - opens mailto */}
            <a
              className={styles.contactBtn}
              href="mailto:mohammedassimboutrigui@gmail.com"
              title="Send us an email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Send an Email</span>
            </a>
          </div>

          <div className="decorative-line" style={{ margin: '3rem auto' }}></div>

          <p className={styles.followText}>Follow Us</p>
          <div className={styles.socialRow}>
            {/* TikTok */}
            <a href="/coming-soon" className={styles.socialIcon} title="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="/coming-soon" className={styles.socialIcon} title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="/coming-soon" className={styles.socialIcon} title="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>

          <p className={styles.copyright}>© 2025 SIMALL. All Rights Reserved.</p>
        </div>
      </section>
    </main>
  );
}
