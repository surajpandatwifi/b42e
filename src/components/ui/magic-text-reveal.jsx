import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";

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
  style = {},
}) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  const globalDpr = useMemo(
    () => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1),
    []
  );

  const measureText = useCallback(
    (text, fontSize, fontWeight, fontFamily) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const metrics = ctx.measureText(text);
      return {
        width: Math.ceil(metrics.width + fontSize * 0.5),
        height: Math.ceil(fontSize * 1.4),
      };
    },
    []
  );

  // Measure wrapper size
  useEffect(() => {
    const dims = measureText(text, fontSize, fontWeight, fontFamily);
    setWrapperSize({
      width: dims.width + fontSize * 0.5,
      height: dims.height + fontSize * 0.5,
    });
  }, [text, fontSize, fontWeight, fontFamily, measureText]);

  // Create particle field
  const createParticles = useCallback((ctx, textWidth, textHeight) => {
    ctx.clearRect(0, 0, textWidth, textHeight);
    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, textWidth / 2, textHeight / 2);

    const imgData = ctx.getImageData(0, 0, textWidth, textHeight);
    const data = imgData.data;
    const particles = [];

    for (let y = 0; y < textHeight; y += density) {
      for (let x = 0; x < textWidth; x += density) {
        const alpha = data[(y * textWidth + x) * 4 + 3];
        if (alpha > 128) {
          particles.push({
            x: Math.random() * textWidth,
            y: Math.random() * textHeight,
            targetX: x,
            targetY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    }
    return particles;
  }, [text, color, fontSize, fontFamily, fontWeight, density]);

  // Render animation
  const renderParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = wrapperSize;
    canvas.width = width * globalDpr;
    canvas.height = height * globalDpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(globalDpr, globalDpr);

    if (!particlesRef.current.length) {
      particlesRef.current = createParticles(ctx, width, height);
    }

    const particles = particlesRef.current;

    const now = performance.now();
    const deltaTime = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      p.vx += dx * speed * deltaTime;
      p.vy += dy * speed * deltaTime;

      p.vx *= 0.8;
      p.vy *= 0.8;

      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = color;
      ctx.fillRect(p.x, p.y, 1.2, 1.2);
    }

    animationFrameRef.current = requestAnimationFrame(renderParticles);
  }, [wrapperSize, color, speed, globalDpr, createParticles]);

  useEffect(() => {
    if (wrapperSize.width && wrapperSize.height) {
      renderParticles();
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [wrapperSize, renderParticles]);

  return (
    <div
      ref={wrapperRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: wrapperSize.width || "auto",
        height: wrapperSize.height || "auto",
        backgroundColor: "transparent",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};
