import React, { useEffect, useRef, useState } from 'react';
import './ContactPage.css';

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollAnimate: React.FC<ScrollAnimateProps> = ({ children, className = '' }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
  
      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '-72px 0px 0px 0px',
        threshold: 0.5,
      }
    );
  
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
  
    return () => {
      observer.disconnect();
    };
    },[]);

    const classNames= [
      className,
      isIntersecting ? 'is-visible' : 'is-hidden'
    ].filter(Boolean).join(' ');

    return (
      <div ref={elementRef} className={classNames}>{children}</div>
    );
};