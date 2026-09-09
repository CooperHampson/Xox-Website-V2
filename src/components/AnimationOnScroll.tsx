import React, { useEffect, useRef, useState } from 'react';

interface AnimatedOnScrollProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedOnScroll: React.FC<AnimatedOnScrollProps> = ({
  children,
  className,
}) => {
  // The outer wrapper is observed but never animated.
  const observerRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [hasPlayedInitialAnimation, setHasPlayedInitialAnimation] =
    useState(false);
  const [shouldPlayInitialAnimation, setShouldPlayInitialAnimation] =
    useState(false);

  useEffect(() => {
    const element = observerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;

        setIsVisible(visible);

        // The element has become visible for the first time.
        if (visible && !hasPlayedInitialAnimation) {
          setShouldPlayInitialAnimation(true);
          setHasPlayedInitialAnimation(true);
        }
      },
      {
        root: null,
        rootMargin: '-72px 0px 0px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasPlayedInitialAnimation]);

  // Remove the initial animation class after it finishes.
  useEffect(() => {
    if (!shouldPlayInitialAnimation) return;

    const timer = setTimeout(() => {
      setShouldPlayInitialAnimation(false);
    }, 1000); // Match your CSS animation duration

    return () => clearTimeout(timer);
  }, [shouldPlayInitialAnimation]);

  const classNames = [
    className,

    // Hidden before it has ever entered the viewport.
    !hasPlayedInitialAnimation && 'is-hidden',

    // Only added once to trigger the initial animation.
    shouldPlayInitialAnimation && 'is-loading',

    // After the initial animation has played,
    // hide when leaving the viewport.
    hasPlayedInitialAnimation &&
      !shouldPlayInitialAnimation &&
      !isVisible &&
      'is-hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={observerRef}>
      <div className={classNames}>
        {children}
      </div>
    </div>
  );
};
