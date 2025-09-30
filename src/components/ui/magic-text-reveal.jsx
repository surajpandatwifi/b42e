import React, { useRef, useEffect, useCallback, useMemo } from 'react';

export const MagicTextReveal = ({
  text = "Magic Text",
  color = "rgba(255, 255, 255, 1)",
  fontSize = 96,
  fontFamily = "Jakarta Sans, sans-serif",
  fontWeight = 700,
  className = "",
  style = {}
}) => {
  const canvasRef = useRef(null);
  const globalDpr = useMemo(
    () => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1),
    []
  );

  const measureText = useCallback((text, fontSize, fontWeight, fontFamily) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    return {
      width: Math.ceil(metrics.width + fontSize),
      height: Math.ceil(fontSize * 1.4),
    };
  }, []);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = measureText(text, fontSize, fontWeight, fontFamily);

    canvas.width = width * globalDpr;
    canvas.height = height * globalDpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(globalDpr, globalDpr);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
  }, [text, fontSize, fontFamily, fontWeight, color, globalDpr, measureText]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        backgroundColor: "transparent",
        ...style,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};
