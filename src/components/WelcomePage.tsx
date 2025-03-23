import React, { useEffect, useState, useRef } from 'react';
import { Shield, Lock, Key, Database, ArrowLeft } from 'lucide-react';

export function WelcomePage({ onGetStarted, onBack }: { onGetStarted: () => void; onBack?: () => void }) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const blockchainRef = useRef<HTMLDivElement>(null);
  const encryptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update video playback based on scroll position
      const videoElement = document.querySelector<HTMLVideoElement>('.hero-video');
      if (videoElement) {
        const scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
        videoElement.currentTime = scrollProgress * videoElement.duration;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-black text-white">
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .fade-up {
            opacity: 0;
            animation: fadeUp 1s ease forwards;
          }
          
          .scroll-section {
            height: 150vh;
          }
          
          .sticky-content {
            height: 100vh;
            position: sticky;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .parallax-text {
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
          
          .hero-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .gradient-overlay {
            background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
          }
        `}
      </style>

      {/* Hero Section */}
      <section ref={heroRef} className="h-screen relative overflow-hidden">
        <video 
          className="hero-video"
          src="/encryption-animation.mp4" 
          muted 
          playsInline
          style={{
            opacity: Math.max(0, 1 - scrollY / 500)
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 
            className="text-8xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent"
            style={{
              transform: `translateY(${-scrollY * 0.5}px)`,
              opacity: Math.max(0, 1 - scrollY / 500)
            }}
          >
            MPVault
          </h1>
          <p 
            className="text-2xl text-cyan-100 max-w-3xl mx-auto mb-8 font-light tracking-wide"
            style={{
              transform: `translateY(${-scrollY * 0.4}px)`,
              opacity: Math.max(0, 1 - scrollY / 500)
            }}
          >
            The future of password security.
            <br />
            Powered by blockchain technology.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            style={{
              transform: `translateY(${-scrollY * 0.3}px)`,
              opacity: Math.max(0, 1 - scrollY / 500)
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Security Section */}
      <section ref={securityRef} className="scroll-section relative">
        <div className="sticky-content">
          <div className="relative w-full h-full">
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: Math.min(1, Math.max(0, (scrollY - window.innerHeight) / 500))
              }}
            >
              <Shield className="w-96 h-96 text-cyan-400" style={{
                transform: `
                  scale(${1 + Math.max(0, (scrollY - window.innerHeight) / 500)})
                  rotate(${Math.max(0, (scrollY - window.innerHeight) / 5)}deg)
                `
              }} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 
                className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-200 via-cyan-100 to-cyan-200 bg-clip-text text-transparent"
                style={{
                  transform: `translateY(${Math.max(0, (scrollY - window.innerHeight) * 0.4)}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - window.innerHeight) / 500))
                }}
              >
                Military-Grade Security
              </h2>
              <p 
                className="text-xl text-cyan-100/90 max-w-2xl font-light tracking-wide"
                style={{
                  transform: `translateY(${Math.max(0, (scrollY - window.innerHeight) * 0.3)}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - window.innerHeight) / 500))
                }}
              >
                Your passwords are protected with AES-256 encryption,
                <br />
                the same standard used by governments worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Section */}
      <section ref={blockchainRef} className="scroll-section relative">
        <div className="sticky-content">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="grid grid-cols-4 gap-4 perspective-1000"
                style={{
                  transform: `
                    rotateX(${45 + Math.max(0, (scrollY - window.innerHeight * 2) / 20)}deg)
                    rotateZ(${45 + Math.max(0, (scrollY - window.innerHeight * 2) / 20)}deg)
                  `
                }}
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 backdrop-blur-sm rounded-lg preserve-3d border border-cyan-400/20"
                    style={{
                      transform: `
                        translateZ(${Math.sin((scrollY + i * 100) * 0.002) * 50}px)
                        scale(${1 + Math.sin((scrollY + i * 100) * 0.002) * 0.2})
                      `,
                      opacity: 0.3 + Math.sin((scrollY + i * 100) * 0.002) * 0.5
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 
                className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-200 via-white to-cyan-200 bg-clip-text text-transparent"
                style={{
                  transform: `translateY(${Math.max(0, (scrollY - window.innerHeight * 2) * 0.4)}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - window.innerHeight * 2) / 500))
                }}
              >
                Blockchain-Powered
              </h2>
              <p 
                className="text-xl text-cyan-100/90 max-w-2xl font-light tracking-wide"
                style={{
                  transform: `translateY(${Math.max(0, (scrollY - window.innerHeight * 2) * 0.3)}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - window.innerHeight * 2) / 500))
                }}
              >
                Your encrypted passwords are stored on the blockchain,
                <br />
                ensuring maximum security and accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="min-h-screen relative flex items-center justify-center">
        <div className="text-center px-4">
          <h2 
            className="text-7xl font-bold mb-8 bg-gradient-to-r from-cyan-200 via-white to-cyan-200 bg-clip-text text-transparent"
          >
            The Future of Password Security
          </h2>
          <p 
            className="text-2xl text-cyan-100/90 max-w-3xl mx-auto mb-12 font-light tracking-wide"
          >
            Join thousands of users who trust MPVault
            <br />
            to keep their digital life secure.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white px-12 py-6 rounded-full text-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
          >
            Experience MPVault
          </button>
        </div>
      </section>

      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-8 left-8 z-50 text-cyan-200/70 hover:text-cyan-100 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      )}
    </div>
  );
} 