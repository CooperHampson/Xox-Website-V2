import { useEffect, useState } from 'react';

type HeaderTheme = 'light' | 'dark';

export const useHeaderTheme = () => {
  const [theme, setTheme] = useState<HeaderTheme>('light');

  useEffect(() => {
    const handleScroll = () => {
      const headerCheckPoint = 36;

      const sections = document.querySelectorAll<HTMLElement>(
        '[data-header-theme]'
      );

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        // Is the center of the header currently inside this section?
        if (
          rect.top <= headerCheckPoint &&
          rect.bottom >= headerCheckPoint
        ) {
          const sectionTheme = section.dataset.headerTheme as HeaderTheme;

          if (sectionTheme) {
            setTheme(sectionTheme);
          }

          // Stop once we've found the current section.
          break;
        }
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return theme;
};
