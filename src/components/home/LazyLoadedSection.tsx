import { useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface LazyLoadedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const LazyLoadedSection = ({ children, className = "", delay = 0 }: LazyLoadedSectionProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -10% 0px"
  });

  useEffect(() => {
    if (isInView) {
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
  }, [isInView, controls, delay]);

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