import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export interface LazyLoadConfig {
  threshold?: number;
  rootMargin?: string;
  animationDuration?: number;
}

export const useLazyLoad = (config: LazyLoadConfig = {}) => {
  const controls = useAnimation();
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    threshold = 0.1,
    rootMargin = "50px",
    animationDuration = 0.5
  } = config;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start({
            opacity: 1,
            y: 0,
            transition: {
              duration: animationDuration,
              ease: "easeOut"
            }
          });
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef) {
      observer.observe(elementRef);
    }

    return () => {
      if (elementRef) {
        observer.unobserve(elementRef);
      }
    };
  }, [elementRef, controls, threshold, rootMargin, animationDuration]);

  return {
    ref: setElementRef,
    controls,
    isVisible,
    initial: { opacity: 0, y: 20 },
    animate: controls
  };
};

export const LazyLoadSection = motion.div;

export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const flowVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const contentFlow = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};