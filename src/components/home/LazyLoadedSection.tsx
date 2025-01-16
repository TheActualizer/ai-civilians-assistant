import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface LazyLoadedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const LazyLoadedSection = ({ children, className = "", delay = 0 }: LazyLoadedSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          delay: delay,
          ease: [0.6, -0.05, 0.01, 0.99]
        }
      });
    }
  }, [inView, controls, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 20, opacity: 0 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};