"use client"

import React, { useEffect, useRef, useState } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
}

export default function AnimateOnScroll({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className = '' 
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 }); // Memicu animasi saat 15% elemen terlihat
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const baseClasses = "transition-all duration-1000 ease-out w-full";
  const visibilityClasses = isVisible ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0";
  
  let transformClasses = "";
  if (!isVisible) {
    if (direction === 'up') transformClasses = "translate-y-16";
    if (direction === 'down') transformClasses = "-translate-y-16";
    if (direction === 'left') transformClasses = "translate-x-16";
    if (direction === 'right') transformClasses = "-translate-x-16";
  }

  return (
    <div 
      ref={domRef} 
      className={`${baseClasses} ${visibilityClasses} ${transformClasses} ${className}`} 
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}