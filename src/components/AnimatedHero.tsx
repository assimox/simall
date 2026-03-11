'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 'oldmoney',
    title: 'Old Money Aesthetics',
    subtitle: 'Classic tailoring and timeless elegance.',
    // A high-end aesthetic of luxury classic wear
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: 'streetwear',
    title: 'Premium Streetwear',
    subtitle: 'Urban edge meets luxury materials.',
    // High-end streetwear/urban aesthetic
    image: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: 'shoes',
    title: 'Exclusive Shoes',
    subtitle: 'Step into greatness with curated kicks.',
    // Sneaker/premium shoe aesthetic
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: 'accessories',
    title: 'Curated Accessories',
    subtitle: 'The finishing touch of pure excellence.',
    // Luxury watch / accessories vibe
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2580&auto=format&fit=crop'
  },
  {
    id: 'fragrances',
    title: 'Luxury Fragrances',
    subtitle: 'Leave a trail of undeniable prestige.',
    // High-end glass/perfume mood lighting
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2574&auto=format&fit=crop'
  }
];

export default function AnimatedHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide for a cinematic feel
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentIndex];

  return (
    <div style={{ position: 'relative', width: '100%', height: '85vh', overflow: 'hidden', backgroundColor: '#000' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${slide.id}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          {/* Ken Burns effect background */}
          <motion.div
            animate={{ scale: 1.05 }}
            transition={{ duration: 6, ease: "linear" }}
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Elegant Dark Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
          }} />
        </motion.div>
      </AnimatePresence>

      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        zIndex: 10
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${slide.id}`}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Reveal Title from bottom */}
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ 
                fontFamily: 'var(--font-playfair)', 
                fontSize: '4.5rem', 
                color: '#ffffff', 
                fontWeight: 500,
                letterSpacing: '2px',
                margin: '0 20px 0.5rem 20px',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            >
              {slide.title}
            </motion.h2>

            {/* Glowing Accent Line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80px", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ 
                height: '2px', 
                backgroundColor: '#ffffff', 
                margin: '1rem auto'
              }} 
            />

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              style={{ 
                fontFamily: 'var(--font-inter)', 
                fontSize: '1.2rem', 
                color: '#e0e0e0',
                letterSpacing: '1px',
                marginBottom: '3rem',
                fontWeight: 300,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
              }}
            >
              {slide.subtitle}
            </motion.p>

            {/* Elegant Button */}
            <motion.a
              href="#collections"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ 
                display: 'inline-block',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #ffffff',
                padding: '0.8rem 3rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              Discover
            </motion.a>
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Progress Indicators */}
        <div style={{ position: 'absolute', bottom: '3rem', display: 'flex', gap: '1rem' }}>
          {slides.map((_, idx) => (
            <div key={idx} style={{ position: 'relative', width: '40px', height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
              {currentIndex === idx && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: "linear" }}
                  style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#ffffff' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
