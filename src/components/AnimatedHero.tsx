'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, Environment, OrbitControls, Float, ContactShadows, Html, PerspectiveCamera } from '@react-three/drei';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Image from 'next/image';

function Model({ url, scale = 1, position = [0, 0, 0] }: { url: string, scale?: number, position?: [number, number, number] }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={scale} position={position} />;
}

interface Slide {
  id: string;
  titleKey: string;       
  subtitleKey: string;    
  type: 'image' | '3d' | 'video';
  src?: string;
  model?: string;
  scale?: number;
}

const slides: Slide[] = [
  {
    id: 'oldmoney',
    titleKey: 'oldMoneyTitle',
    subtitleKey: 'oldMoneySub',
    type: 'video',
    src: '/videos/oldmoneybanner.mp4'
  },
  {
    id: 'streetwear',
    titleKey: 'streetWearTitle',
    subtitleKey: 'streetWearSub',
    type: 'video',
    src: '/videos/streetwear.mp4'
  },
  {
    id: 'shoes',
    titleKey: 'shoesTitle',
    subtitleKey: 'shoesSub',
    type: '3d',
    model: '/models/nike_jordan_4_retro_black_cat.glb',
    scale: 1
  },
  {
    id: 'accessories',
    titleKey: 'accessoriesTitle',
    subtitleKey: 'accessoriesSub',
    type: '3d',
    model: '/models/rolex-datejust/source/rolex_datejust.glb', 
    scale: 30
  },
  {
    id: 'fragrances',
    titleKey: 'fragrancesTitle',
    subtitleKey: 'fragrancesSub',
    type: '3d',
    model: '/models/jean_paul_gaultier_ultramale_75ml.glb',
    scale: 1
  }
];

export default function AnimatedHero() {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000); 
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentIndex];
  const isDark = slide.type === 'image' || slide.type === 'video';

  // Get translated title and subtitle from the hero dictionary
  const heroDict = t.hero as Record<string, string>;
  const slideTitle = heroDict[slide.titleKey] || slide.titleKey;
  const slideSubtitle = heroDict[slide.subtitleKey] || slide.subtitleKey;

  return (
    <div style={{ position: 'relative', width: '100%', height: '85vh', overflow: 'hidden', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          {slide.type === 'video' && (
            <video
              autoPlay
              loop
              muted
              playsInline
              key={slide.src}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.55)'
              }}
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          )}

          {slide.type === 'image' && (
             <motion.div 
               animate={{ scale: 1.06 }}
               transition={{ duration: 10, ease: "linear" }}
               style={{ 
                 position: 'absolute',
                 inset: 0,
                 width: '100%', 
                 height: '100%', 
               }} 
             >
               <Image 
                 src={slide.src || '/images/streetwear.jpg.png'}
                 alt="Hero Banner"
                 fill
                 sizes="100vw"
                 priority
                 style={{ objectFit: 'cover', filter: 'brightness(0.5)' }}
               />
             </motion.div>
          )}

          {slide.type === '3d' && slide.model && (
            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, cursor: 'grab' }}>
               <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                 <ambientLight intensity={0.7} />
                 <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} />
                 <spotLight position={[-10, 10, -10]} angle={0.2} penumbra={1} intensity={0.5} />
                 <Environment preset="city" />
                 
                 <Suspense fallback={<Html center><span style={{ color: '#041e3a', fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: '1.2rem', whiteSpace: 'nowrap' }}>Loading 3D Object...</span></Html>}>
                   <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                     <Center>
                       <Model url={slide.model} scale={slide.scale} />
                     </Center>
                   </Float>
                   <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#041e3a" />
                 </Suspense>
                 <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={3} />
               </Canvas>
            </div>
          )}
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
        pointerEvents: 'none', 
        zIndex: 10,
        padding: '0 20px'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${slide.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ pointerEvents: 'auto', width: '100%', maxWidth: '800px', marginTop: isMobile ? '-3rem' : '0' }}
          >
            <h2 style={{ 
              fontFamily: 'var(--font-playfair)', 
              fontSize: isMobile ? '2.2rem' : '4.5rem', 
              color: isDark ? '#ffffff' : '#041e3a', 
              fontWeight: 600,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: isDark ? '0 4px 12px rgba(0,0,0,0.6)' : 'none',
              padding: '0 20px'
            }}>
              {slideTitle}
            </h2>
            <div style={{ 
              width: isMobile ? '40px' : '60px', 
              height: '2px', 
              backgroundColor: isDark ? '#ffffff' : '#041e3a', 
              margin: isMobile ? '0 auto 1.2rem auto' : '0 auto 1.5rem auto' 
            }} />
            <p style={{ 
              fontFamily: 'var(--font-inter)', 
              fontSize: isMobile ? '0.95rem' : '1.2rem', 
              color: isDark ? '#f0f0f0' : '#444', 
              marginBottom: isMobile ? '2rem' : '3rem',
              fontWeight: 400,
              letterSpacing: '0.5px',
              textShadow: isDark ? '0 2px 4px rgba(0,0,0,0.8)' : 'none',
              padding: isMobile ? '0 5px' : '0'
            }}>
              {slideSubtitle}
            </p>
            <a 
              href="#collections" 
              className="btn-primary" 
              style={{ 
                backgroundColor: isDark ? '#ffffff' : '#041e3a', 
                color: isDark ? '#000000' : '#ffffff',
                fontSize: isMobile ? '0.85rem' : '0.95rem',
                border: isDark ? 'none' : '1px solid #041e3a',
                padding: isMobile ? '0.8rem 2rem' : '0.8rem 2.5rem',
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              {t.hero.discoverCollection}
            </a>
          </motion.div>
        </AnimatePresence>

        <div style={{ position: 'absolute', bottom: isMobile ? '1.5rem' : '3rem', display: 'flex', gap: '0.8rem', pointerEvents: 'auto' }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: currentIndex === idx ? (isMobile ? '20px' : '32px') : (isMobile ? '6px' : '10px'),
                height: isMobile ? '6px' : '10px',
                borderRadius: '5px',
                backgroundColor: isDark 
                  ? (currentIndex === idx ? '#ffffff' : 'rgba(255,255,255,0.4)') 
                  : (currentIndex === idx ? '#041e3a' : 'rgba(4,30,58,0.2)'),
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none'
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Preload the heavy 3D assets so the browser downloads them in the background instantly
useGLTF.preload('/models/nike_jordan_4_retro_black_cat.glb');
useGLTF.preload('/models/rolex-datejust/source/rolex_datejust.glb');
useGLTF.preload('/models/jean_paul_gaultier_ultramale_75ml.glb');
