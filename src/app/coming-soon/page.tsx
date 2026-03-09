'use client';
import Link from 'next/link';
import styles from './coming-soon.module.css';

export default function ComingSoon() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <Link href="/" className={styles.logo}>SIMALL</Link>
        </div>

        <div className={styles.decorLine}></div>

        <h1 className={styles.title}>Coming Soon</h1>
        <p className={styles.subtitle}>
          Our social presence is being crafted with care.<br/>
          Follow our journey — something exceptional is on its way.
        </p>

        <div className={styles.decorLine}></div>

        <Link href="/" className={styles.backBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Store
        </Link>
      </div>
    </div>
  );
}
