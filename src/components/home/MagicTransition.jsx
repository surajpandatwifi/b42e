import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { MagicTextReveal } from '../ui/magic-text-reveal';

const MagicTransition = () => {
  const sectionRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    gsap.fromTo(
      '.magic-transition-content',
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-[60vh] section-dark text-white relative depth-3 section-transition flex items-center justify-center"
    >
      <div className="cinematic-overlay"></div>
      <div className="container mx-auto section-padding">
        <div className="flex flex-col items-center justify-center text-center magic-transition-content">
          <MagicTextReveal
            text="Amoura Works"
            color="rgba(211, 253, 80, 1)"
            fontSize={48}
            fontFamily="font2, sans-serif"
            fontWeight={600}
            spread={60}
            speed={0.6}
            density={3}
            resetOnMouseLeave={true}
            className="magic-reveal-container"
          />
        </div>
      </div>
    </section>
  );
};

export default MagicTransition;
