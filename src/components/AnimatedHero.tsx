'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, Environment, OrbitControls, Float, ContactShadows, Html } from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const slides = [
  {
    id: 'oldmoney',
    title: 'Old Money Aesthetics',
    subtitle: 'Classic tailoring and timeless elegance.',
    type: 'image',
    src: '/images/old-money.jpg.png'
  },
  {
    id: 'streetwear',
    title: 'Premium Streetwear',
    subtitle: 'Urban edge meets luxury materials.',
    type: 'image',
    src: '/images/streetwear.jpg.png'
  },
  {
    id: 'shoes',
    title: 'Exclusive Shoes',
    subtitle: 'Step into greatness with curated kicks.',
    type: '3d',
    model: '/models/nike_jordan_4_retro_black_cat.glb'
  },
  {
    id: 'accessories',
    title: 'Curated Accessories',
    subtitle: 'The finishing touch of pure excellence.',
    type: '3d',
    model: '/models/rolex-datejust/source/rolex_datejust.glb'
  },
  {
    id: 'fragrances',
    title: 'Luxury Fragrances',
    subtitle: 'Leave a trail of undeniable prestige.',
    type: '3d',
    model: '/models/jean_paul_gaultier_ultramale_75ml.glb'
  }
];

export default function AnimatedHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 7 seconds per slide to allow 3D models to load and spin
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000); 
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentIndex];

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
          {slide.type === 'image' && (
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                backgroundImage: `url(${slide.src || '/images/streetwear.jpg.png'})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                filter: 'brightness(0.5)'
              }} 
            />
          )}

          {slide.type === '3d' && slide.model && (
            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, cursor: 'grab' }}>
               <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                 <ambientLight intensity={0.7} />
                 <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} />
                 <spotLight position={[-10, 10, -10]} angle={0.2} penumbra={1} intensity={0.5} />
                 <Environment preset="city" />
                 <Suspense fallback={<Html center><span style={{ color: '#041e3a', fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: '1.2rem', whiteSpace: 'nowrap' }}>Loading 3D Visuals...</span></Html>}>
                   <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                     <Center>
                       <Model url={slide.model} />
                     </Center>
                   </Float>
                   <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#041e3a" />
                 </Suspense>
                 <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={3} />
               </Canvas>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay Text */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        pointerEvents: 'none', // Important: allows dragging the 3D model through the text layer
        zIndex: 10
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${slide.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ pointerEvents: 'auto' }}
          >
            <h2 style={{ 
              fontFamily: 'var(--font-playfair)', 
              fontSize: '4.5rem', 
              color: slide.type === 'image' ? '#ffffff' : '#041e3a', 
              fontWeight: 600,
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: slide.type === 'image' ? '0 4px 12px rgba(0,0,0,0.6)' : 'none',
              padding: '0 20px'
            }}>
              {slide.title}
            </h2>
            <div style={{ 
              width: '60px', 
              height: '2px', 
              backgroundColor: slide.type === 'image' ? '#ffffff' : '#041e3a', 
              margin: '0 auto 1.5rem auto' 
            }} />
            <p style={{ 
              fontFamily: 'var(--font-inter)', 
              fontSize: '1.2rem', 
              color: slide.type === 'image' ? '#f0f0f0' : '#444', 
              marginBottom: '3rem',
              fontWeight: 400,
              letterSpacing: '0.5px',
              textShadow: slide.type === 'image' ? '0 2px 4px rgba(0,0,0,0.8)' : 'none'
            }}>
              {slide.subtitle}
            </p>
            <a 
              href="#collections" 
              className="btn-primary" 
              style={{ 
                backgroundColor: slide.type === 'image' ? '#ffffff' : '#041e3a', 
                color: slide.type === 'image' ? '#000000' : '#ffffff',
                fontSize: '0.95rem',
                border: slide.type === 'image' ? 'none' : '1px solid #041e3a',
                padding: '0.8rem 2.5rem',
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              Discover Collection
            </a>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div style={{ position: 'absolute', bottom: '3rem', display: 'flex', gap: '0.8rem', pointerEvents: 'auto' }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: currentIndex === idx ? '32px' : '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: slide.type === 'image' 
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
