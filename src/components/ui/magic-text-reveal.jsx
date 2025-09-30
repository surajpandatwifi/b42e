import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

export const MagicTextReveal = ({
  text = "Magic Text",
  color = "rgba(255, 255, 255, 1)",
  fontSize = 96,
  fontFamily = "Jakarta Sans, sans-serif",
  fontWeight = 700,
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
  const [showText, setShowText] = useState(true); // 👈 make visible by default
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  const globalDpr = useMemo(() => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1), []);

  const measureText = useCallback((text, fontSize, fontWeight, fontFamily) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    return {
      width: Math.ceil(metrics.width + fontSize * 0.5),
      height: Math.ceil(fontSize * 1.4),
    };
  }, []);

  // Measure wrapper size
  useEffect(() => {
    const dims = measureText(text, fontSize, fontWeight, fontFamily);
    setWrapperSize({
      width: dims.width + fontSize * 0.5,
      height: dims.height + fontSize * 0.5,
    });
  }, [text, fontSize, fontWeight, fontFamily, measureText]);

  // Draw text onto canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = wrapperSize.width * globalDpr;
    canvas.height = wrapperSize.height * globalDpr;
    canvas.style.width = `${wrapperSize.width}px`;
    canvas.style.height = `${wrapperSize.height}px`;

    ctx.scale(globalDpr, globalDpr);
    ctx.clearRect(0, 0, wrapperSize.width, wrapperSize.height);

    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, wrapperSize.width / 2, wrapperSize.height / 2);
  }, [wrapperSize, color, text, fontSize, fontFamily, fontWeight, globalDpr]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div
      ref={wrapperRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: wrapperSize.width || 'auto',
        height: wrapperSize.height || 'auto',
        cursor: 'default',
        backgroundColor: 'transparent', // ✅ transparent
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div
        className="absolute z-10"
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
          pointerEvents: 'none',
        }}
      >
        {text}
      </div>
    </div>
  );
};
