import { useCallback, useEffect, useRef,} from 'react';

const occludedElements = new Set<HTMLElement>();

let listenersAttached = false;

function updateOcclusion() {
  const header =
    document.getElementById('merch-header');

  if (!header) {
    return;
  }

  const headerRect =
    header.getBoundingClientRect();

  occludedElements.forEach((element) => {
    const elementRect =
      element.getBoundingClientRect();

    const overlap =
      headerRect.bottom - elementRect.top;

    if (overlap <= 0) {
      element.style.clipPath = 'inset(0)';
      return;
    }

    const clippedTop = Math.min(
      overlap,
      elementRect.height,
    );

    element.style.clipPath =
      `inset(${clippedTop}px 0 0 0)`;
  });
}

function attachListeners() {
  if (listenersAttached) {
    return;
  }

  listenersAttached = true;

  window.addEventListener(
    'scroll',
    updateOcclusion,
    { passive: true },
  );

  window.addEventListener(
    'resize',
    updateOcclusion,
  );
}

function detachListeners() {
  if (
    !listenersAttached ||
    occludedElements.size > 0
  ) {
    return;
  }

  listenersAttached = false;

  window.removeEventListener(
    'scroll',
    updateOcclusion,
  );

  window.removeEventListener(
    'resize',
    updateOcclusion,
  );
}

export function useHeaderOcclusion<
  T extends HTMLElement,
>() {
  const elementRef = useRef<T | null>(null);

  const setElementRef = useCallback(
    (element: T | null) => {
      if (elementRef.current) {
        occludedElements.delete(
          elementRef.current,
        );
      }

      elementRef.current = element;

      if (element) {
        occludedElements.add(element);
        attachListeners();
        updateOcclusion();
      }

      detachListeners();
    },
    [],
  );

  useEffect(() => {
    return () => {
      const element = elementRef.current;

      if (element) {
        element.style.clipPath = '';
        occludedElements.delete(element);
      }

      detachListeners();
    };
  }, []);

  return setElementRef;
}