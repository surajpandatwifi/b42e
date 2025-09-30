import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

export const MagicTextReveal = ({
  text = "Magic Text",
  color = "rgba(255, 255, 255, 1)",
  fontSize = 96,
  fontFamily = "Jakarta Sans, sans-serif",
  fontWeight = 600,
  spread = 60,
  speed = 0.5,
  density = 4,
  resetOnMouseLeave = true,
  className = "",
  style = {}
}) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });

  const transformedDensity = 6 - density;
  const globalDpr = useMemo(() => {
    if (typeof window !== "undefined") return window.devicePixelRatio * 1.5 || 1;
    return 1;
  }, []);

  const measureText = useCallback((text, fontSize, fontWeight, fontFamily) => {
    if (typeof window === "undefined") return { width: 200, height: 60 };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return { width: 200, height: 60 };

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);

    return {
      width: Math.ceil(metrics.width + fontSize * 0.5),
      height: Math.ceil(fontSize * 1.4)
    };
  }, []);

  useEffect(() => {
    const dimensions = measureText(text, fontSize, fontWeight, fontFamily);
    setTextDimensions(dimensions);
  }, [text, fontSize, fontWeight, fontFamily, measureText]);

  // ... rest of logic stays same (particles, updateParticles, render, etc)

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current && textDimensions.width && textDimensions.height) {
        const isMobile = window.innerWidth < 768;
        const basePadding = isMobile ? Math.max(fontSize * 0.3, 20) : Math.max(fontSize * 0.5, 40);

        const minWidth = Math.max(textDimensions.width + basePadding * 2, isMobile ? 120 : 200);
        const minHeight = Math.max(textDimensions.height + basePadding * 2, isMobile ? 60 : 100);

        const parentRect = wrapperRef.current.parentElement?.getBoundingClientRect();
        const viewportMargin = isMobile ? 0.95 : 0.9;
        const maxWidth = parentRect ? parentRect.width * viewportMargin : window.innerWidth * viewportMargin;
        const maxHeight = parentRect ? parentRect.height * viewportMargin : window.innerHeight * viewportMargin;

        const finalWidth = Math.min(minWidth, maxWidth);
        const finalHeight = Math.min(minHeight, maxHeight);

        setWrapperSize({ width: finalWidth, height: finalHeight });
      }
    };

    if (textDimensions.width && textDimensions.height) {
      handleResize();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [textDimensions, fontSize]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setHasBeenShown(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (resetOnMouseLeave || !hasBeenShown) {
      setIsHovered(false);
    }
  }, [resetOnMouseLeave, hasBeenShown]);

  return (
    <div
      ref={wrapperRef}
      className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${className}`}
      style={{
        width: wrapperSize.width || 'auto',
        height: wrapperSize.height || 'auto',
        minWidth: '150px',
        minHeight: '80px',
        maxWidth: '100%',
        cursor: 'pointer',
        backgroundColor: 'transparent', // ✅ no background
        border: 'none',                 // ✅ no border
        backdropFilter: 'none',         // ✅ remove blur
        ...style
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute z-10 transition-opacity duration-200 ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          color,
          fontFamily,
          fontWeight,
          fontSize: `${fontSize}px`,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        {text}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};
