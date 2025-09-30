import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import PortfolioGallery from './PortfolioGallery'

const teasers = [
  {
    url: 'https://www.youtube.com/watch?v=OcZAFfSru5A',
    title: 'swipe right for more'
  },
  {
    url: 'https://www.youtube.com/watch?v=71xzS-WkO50',
    title: 'Portfolio Showcase 2'
  },
  {
    url: 'https://www.youtube.com/watch?v=AqqGxOrwv_g',
    title: 'Portfolio Showcase 3'
  },
  {
    url: 'https://www.youtube.com/watch?v=YM1TZnbcbOs',
    title: 'Portfolio Showcase 4'
  },
  {
    url: 'https://www.youtube.com/watch?v=HMJyD-kPWek',
    title: 'Portfolio Showcase 5'
  },
  {
    url: 'https://www.youtube.com/watch?v=L9PMwOelcRk',
    title: 'Portfolio Showcase 6'
  },
  {
    url: 'https://www.youtube.com/watch?v=dRjCKw7YonM',
    title: 'Portfolio Showcase 7'
  },
  {
    url: 'https://www.youtube.com/watch?v=MZeXtcH1JXc',
    title: 'Portfolio Showcase 8'
  },
  {
    url: 'https://www.youtube.com/watch?v=HMGyMunzLfU',
    title: 'Portfolio Showcase 9'
  },
  {
    url: 'https://www.youtube.com/watch?v=Jb0lmUL9v_c',
    title: 'Portfolio Showcase 10'
  }
]

const PortfolioSection = () => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  gsap.registerPlugin(ScrollTrigger)

  useGSAP(() => {
    gsap.fromTo('.portfolio-section-wrapper',
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.portfolio-section-wrapper',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    )

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      onEnter: () => setIsVisible(true),
      once: true
    })
  }, [])

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="min-h-screen section-dark-alt text-white relative depth-3 section-transition portfolio-section-wrapper"
    >
      <div className="cinematic-overlay"></div>
      <PortfolioGallery
        title="Our Portfolio"
        archiveButton={{
          text: "View Our Gallery",
          href: "/projects"
        }}
        videos={teasers}
        className=""
      />
    </section>
  )
}

export default PortfolioSection
