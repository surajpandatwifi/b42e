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
      className="min-h-[80vh] section-dark text-white relative depth-3 section-transition flex items-center justify-center"
    >
      <div className="cinematic-overlay"></div>
      <div className="container mx-auto section-padding">
        <div className="flex flex-col items-center justify-center text-center space-y-8 sm:space-y-12 magic-transition-content">
          <div className="floating-panel-dark max-width-content mx-auto">
            <p className="font-[font1] text-base sm:text-lg lg:text-xl leading-relaxed text-layer-2">
              Hover to reveal the magic
            </p>
          </div>

          <div className="relative flex items-center justify-center magic-reveal-container">
            <MagicTextReveal
              text="Amoura Works"
              color="rgba(211, 253, 80, 1)"
              fontSize={120}
              fontFamily="font2, sans-serif"
              fontWeight={600}
              spread={80}
              speed={0.7}
              density={2}
              resetOnMouseLeave={true}
              className="w-full"
            />
          </div>

          <div className="floating-panel-dark max-width-content mx-auto">
            <p className="font-[font1] text-sm sm:text-base text-layer-1 leading-relaxed">
              Every project deserves attention to detail
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagicTransition;
