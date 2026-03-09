'use client';

import { useEffect, useRef } from 'react';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

function generateCandles(count: number): Candle[] {
  const candles: Candle[] = [];
  let price = 420;

  for (let i = 0; i < count; i++) {
    const volatility = 12 + Math.sin(i * 0.3) * 8;
    const bias = Math.sin(i * 0.05) * 3;
    const change = (Math.random() - 0.48 + bias * 0.02) * volatility;
    const open = price;
    const close = price + change;
    const wickPct = 0.3 + Math.random() * 0.5;
    const high = Math.max(open, close) + Math.abs(change) * wickPct;
    const low = Math.min(open, close) - Math.abs(change) * wickPct;
    const volume = 0.2 + Math.random() * 0.8;

    candles.push({ open, close, high, low, volume });
    price = close + (Math.random() - 0.5) * 2;
  }

  return candles;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const NUM_CANDLES = 120;
    const CANDLE_W = 10;
    const GAP = 6;
    const SPACING = CANDLE_W + GAP;
    const candles = generateCandles(NUM_CANDLES);

    let offset = 0;
    let animFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Compute MA (simple 10-period)
    const maValues = candles.map((_, i) => {
      const start = Math.max(0, i - 9);
      const slice = candles.slice(start, i + 1);
      return slice.reduce((s, c) => s + (c.open + c.close) / 2, 0) / slice.length;
    });

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ── Grid lines ──
      ctx.save();
      ctx.strokeStyle = 'rgba(0,255,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();

      // ── Chart area ──
      const chartTop    = H * 0.3;
      const chartBottom = H * 0.78;
      const chartH      = chartBottom - chartTop;
      const volBottom   = H * 0.92;
      const volH        = H * 0.09;

      const allPrices = candles.flatMap(c => [c.high, c.low]);
      const minP = Math.min(...allPrices) - 5;
      const maxP = Math.max(...allPrices) + 5;
      const priceRange = maxP - minP;

      const scaleY = (p: number) =>
        chartBottom - ((p - minP) / priceRange) * chartH;

      // ── Horizontal level lines ──
      [0.25, 0.5, 0.75].forEach(pct => {
        const y = scaleY(minP + priceRange * pct);
        ctx.save();
        ctx.setLineDash([3, 10]);
        ctx.strokeStyle = 'rgba(0,255,255,0.05)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        ctx.restore();
      });

      // ── Moving average line ──
      ctx.save();
      ctx.strokeStyle = 'rgba(0,255,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00FFFF';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      let maStarted = false;
      candles.forEach((_, i) => {
        const x = i * SPACING - offset + W * 0.08;
        if (x < -SPACING || x > W + SPACING) return;
        const y = scaleY(maValues[i]);
        if (!maStarted) { ctx.moveTo(x, y); maStarted = true; }
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();

      // ── Candles ──
      candles.forEach((c, i) => {
        const x = i * SPACING - offset + W * 0.08;
        if (x < -SPACING * 2 || x > W + SPACING) return;

        const isBull  = c.close >= c.open;
        const alpha   = 0.5 + c.volume * 0.3;
        const color   = isBull
          ? `rgba(0,255,255,${alpha})`
          : `rgba(90,90,110,${alpha * 0.7})`;

        const openY  = scaleY(c.open);
        const closeY = scaleY(c.close);
        const highY  = scaleY(c.high);
        const lowY   = scaleY(c.low);
        const bodyTop = Math.min(openY, closeY);
        const bodyH   = Math.max(Math.abs(openY - closeY), 1.5);

        ctx.save();
        if (isBull) { ctx.shadowColor = '#00FFFF'; ctx.shadowBlur = 6; }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fillRect(x - CANDLE_W / 2, bodyTop, CANDLE_W, bodyH);
        ctx.restore();

        // Volume bar
        const vH = volH * c.volume;
        ctx.save();
        ctx.fillStyle = isBull
          ? `rgba(0,255,255,${0.08 + c.volume * 0.12})`
          : `rgba(80,80,100,${0.05 + c.volume * 0.08})`;
        ctx.fillRect(x - CANDLE_W / 2, volBottom - vH, CANDLE_W, vH);
        ctx.restore();
      });

      // ── Radial glow at top-center ──
      const grd = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.5);
      grd.addColorStop(0, 'rgba(0,255,255,0.04)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      offset += 0.35;
      if (offset > NUM_CANDLES * SPACING - W * 0.9) offset = 0;

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55, mixBlendMode: 'screen' }}
    />
  );
}
