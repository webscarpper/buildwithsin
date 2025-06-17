import React, { useState, useEffect } from 'react';

const AnimationTest = () => {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLetter((prev) => {
        if (prev < 4) {
          return prev + 1;
        } else {
          setIsComplete(true);
          return prev;
        }
      });
    }, 600); // Faster letter animation

    return () => clearInterval(timer);
  }, []);

  const goataLetters = ['G', 'O', 'A', 'T', 'A'];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative">
      {/* Complex animated background grid */}
      <div className="absolute inset-0 z-0">
        <div className="grid-background"></div>
        <div className="energy-waves"></div>
      </div>

      {/* Floating particles with complex movement */}
      <div className="absolute inset-0 z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-complex"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div 
              className="particle"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                backgroundColor: Math.random() > 0.5 ? '#00ffcc' : '#00e6b8',
                borderRadius: '50%',
                boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            />
          </div>
        ))}
      </div>

      {/* Enhanced floating orbs */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-orb"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            <div 
              className="orb-core"
              style={{
                width: `${8 + Math.random() * 16}px`,
                height: `${8 + Math.random() * 16}px`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Main content container */}
      <div className="flex flex-col items-center gap-20 z-10 relative">
        {/* GOATA Symbol Image Container */}
        <div className="relative symbol-container">
          {/* Multiple rotating rings around the image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
            <div className="ring ring-4"></div>
          </div>

          {/* Energy pulses */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="energy-pulse pulse-1"></div>
            <div className="energy-pulse pulse-2"></div>
            <div className="energy-pulse pulse-3"></div>
          </div>

          {/* Main GOATA symbol image */}
          <div className="relative z-10 symbol-image-container">
            <img 
              src="/goata-symbol.png"
              alt="GOATA Symbol"
              className="goata-symbol-image"
              onLoad={() => setImageLoaded(true)}
              onError={() => console.error('Failed to load GOATA symbol image')}
            />
            
            {/* Glowing overlay effect */}
            <div className="absolute inset-0 glow-overlay"></div>
            
            {/* Scanning effect */}
            <div className="scanning-beam"></div>
          </div>

          {/* Corner accents */}
          <div className="corner-accents">
            <div className="corner-accent top-left"></div>
            <div className="corner-accent top-right"></div>
            <div className="corner-accent bottom-left"></div>
            <div className="corner-accent bottom-right"></div>
          </div>
        </div>

        {/* GOATA Text Animation with complex effects */}
        <div className="flex items-center gap-6 text-container">
          {goataLetters.map((letter, index) => (
            <div
              key={index}
              className={`letter-wrapper ${
                index <= currentLetter ? 'active' : 'inactive'
              }`}
              data-text={letter}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
            >
              <div className="letter-main">{letter}</div>
              <div className="letter-glow">{letter}</div>
              <div className="letter-reflection">{letter}</div>
              
              {/* Individual letter effects */}
              <div className="letter-sparks">
                {[...Array(8)].map((_, sparkIndex) => (
                  <div
                    key={sparkIndex}
                    className="spark"
                    style={{
                      transform: `rotate(${sparkIndex * 45}deg) translateY(-40px)`,
                      animationDelay: `${index * 150 + sparkIndex * 50}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Loading Progress Bar */}
        {isComplete && (
          <div className="loading-progress-container">
            <div className="progress-bar-container">
              <div className="progress-bar-track">
                <div className="progress-bar-fill"></div>
              </div>
              <div className="progress-glow"></div>
            </div>
            
            {/* Complex loading indicator */}
            <div className="loading-complex">
              <div className="loading-rings">
                <div className="loading-ring ring-outer"></div>
                <div className="loading-ring ring-middle"></div>
                <div className="loading-ring ring-inner"></div>
              </div>
              
              <div className="loading-dots">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="loading-dot"
                    style={{
                      animationDelay: `${i * 0.15}s`
                    }}
                  />
                ))}
              </div>
              
              <div className="loading-bars">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="loading-bar"
                    style={{
                      transform: `rotate(${i * 30}deg)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimationTest;
