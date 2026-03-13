"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Grid3X3, RotateCcw, CheckCircle2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────
interface Point {
  x: number;
  y: number;
}

type Phase = "draw" | "grid";

// ─── Geometry helpers ────────────────────────────────────────

/** Ray-casting point-in-polygon test */
function pointInPolygon(px: number, py: number, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Check if a line segment intersects a polygon edge */
function segmentIntersectsPolygon(
  ax: number, ay: number, bx: number, by: number,
  polygon: Point[]
): boolean {
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (segmentsIntersect(
      ax, ay, bx, by,
      polygon[j].x, polygon[j].y, polygon[i].x, polygon[i].y
    )) {
      return true;
    }
  }
  return false;
}

function segmentsIntersect(
  ax: number, ay: number, bx: number, by: number,
  cx: number, cy: number, dx: number, dy: number
): boolean {
  const d1 = direction(cx, cy, dx, dy, ax, ay);
  const d2 = direction(cx, cy, dx, dy, bx, by);
  const d3 = direction(ax, ay, bx, by, cx, cy);
  const d4 = direction(ax, ay, bx, by, dx, dy);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }
  return false;
}

function direction(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): number {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

/** Classify a grid cell: "inside" | "partial" | "outside" */
function classifyCell(
  cellX: number, cellY: number, cellSize: number, polygon: Point[]
): "inside" | "partial" | "outside" {
  const corners = [
    { x: cellX, y: cellY },
    { x: cellX + cellSize, y: cellY },
    { x: cellX + cellSize, y: cellY + cellSize },
    { x: cellX, y: cellY + cellSize },
  ];

  const cornersInside = corners.filter((c) => pointInPolygon(c.x, c.y, polygon)).length;

  // All 4 corners inside → check if any polygon edge crosses the cell
  if (cornersInside === 4) {
    // Check if any polygon edge passes through the cell
    const edgeCrosses = cellEdgesCrossPolygon(cellX, cellY, cellSize, polygon);
    return edgeCrosses ? "partial" : "inside";
  }

  // No corners inside → check if polygon edge crosses the cell at all
  if (cornersInside === 0) {
    const edgeCrosses = cellEdgesCrossPolygon(cellX, cellY, cellSize, polygon);
    // Also check if the polygon entirely contains the cell (small polygon inside large cell)
    if (!edgeCrosses) {
      // Check if any polygon vertex is inside the cell
      const polyVertexInCell = polygon.some(
        (p) => p.x >= cellX && p.x <= cellX + cellSize && p.y >= cellY && p.y <= cellY + cellSize
      );
      return polyVertexInCell ? "partial" : "outside";
    }
    return "partial";
  }

  // Some corners inside, some outside
  return "partial";
}

function cellEdgesCrossPolygon(cellX: number, cellY: number, cellSize: number, polygon: Point[]): boolean {
  const edges: [number, number, number, number][] = [
    [cellX, cellY, cellX + cellSize, cellY],
    [cellX + cellSize, cellY, cellX + cellSize, cellY + cellSize],
    [cellX + cellSize, cellY + cellSize, cellX, cellY + cellSize],
    [cellX, cellY + cellSize, cellX, cellY],
  ];
  for (const [ax, ay, bx, by] of edges) {
    if (segmentIntersectsPolygon(ax, ay, bx, by, polygon)) return true;
  }
  return false;
}

// ─── Component ───────────────────────────────────────────────

const CANVAS_SIZE = 500;
const MIN_GRID = 3;
const MAX_GRID = 30;
const DEFAULT_GRID = 8;

export default function GridAreaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("draw");
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gridCount, setGridCount] = useState(DEFAULT_GRID);
  const [stats, setStats] = useState({ inside: 0, partial: 0, area: 0 });
  const [canvasScale, setCanvasScale] = useState(1);

  // ── Responsive scaling ──
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setCanvasScale(Math.min(1, w / CANVAS_SIZE));
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Get canvas-relative coords ──
  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_SIZE / rect.width;
      const scaleY = CANVAS_SIZE / rect.height;
      let clientX: number, clientY: number;
      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    []
  );

  // ── Drawing handlers ──
  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (phase !== "draw") return;
      e.preventDefault();
      const pos = getPos(e);
      if (!pos) return;
      setIsDrawing(true);
      setPoints([pos]);
    },
    [phase, getPos]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || phase !== "draw") return;
      e.preventDefault();
      const pos = getPos(e);
      if (!pos) return;
      setPoints((prev) => {
        const last = prev[prev.length - 1];
        // Only add point if moved enough (avoids too many points)
        const dist = Math.hypot(pos.x - last.x, pos.y - last.y);
        if (dist < 4) return prev;
        return [...prev, pos];
      });
    },
    [isDrawing, phase, getPos]
  );

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    // Auto-close: the polygon is closed by connecting last point to first
  }, [isDrawing]);

  // ── Compute grid stats when gridCount or points change in grid phase ──
  useEffect(() => {
    if (phase !== "grid" || points.length < 3) return;
    const cellSize = CANVAS_SIZE / gridCount;
    let inside = 0;
    let partial = 0;

    for (let row = 0; row < gridCount; row++) {
      for (let col = 0; col < gridCount; col++) {
        const cls = classifyCell(col * cellSize, row * cellSize, cellSize, points);
        if (cls === "inside") inside++;
        else if (cls === "partial") partial++;
      }
    }

    const cellArea = (1 / gridCount) * (1 / gridCount); // as fraction of total canvas
    setStats({
      inside,
      partial,
      area: parseFloat(((inside + partial * 0.5) * cellArea * 100).toFixed(1)),
    });
  }, [phase, gridCount, points]);

  // ── Render canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (phase === "grid" && points.length >= 3) {
      // Draw grid
      const cellSize = CANVAS_SIZE / gridCount;

      // Classify and paint cells
      for (let row = 0; row < gridCount; row++) {
        for (let col = 0; col < gridCount; col++) {
          const cx = col * cellSize;
          const cy = row * cellSize;
          const cls = classifyCell(cx, cy, cellSize, points);
          if (cls === "inside") {
            ctx.fillStyle = "rgba(34, 197, 94, 0.35)"; // green
            ctx.fillRect(cx, cy, cellSize, cellSize);
          } else if (cls === "partial") {
            ctx.fillStyle = "rgba(250, 204, 21, 0.30)"; // yellow
            ctx.fillRect(cx, cy, cellSize, cellSize);
          }
        }
      }

      // Draw grid lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridCount; i++) {
        const pos = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(CANVAS_SIZE, pos);
        ctx.stroke();
      }
    }

    // Draw polygon
    if (points.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (phase === "grid") {
        // Closed polygon
        ctx.closePath();
        ctx.fillStyle = "rgba(99, 102, 241, 0.08)";
        ctx.fill();
      }

      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Close line (dashed when drawing, solid in grid)
      if (points.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.lineTo(points[0].x, points[0].y);
        if (phase === "draw") {
          ctx.setLineDash([8, 6]);
          ctx.strokeStyle = "rgba(129, 140, 248, 0.5)";
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = "#818cf8";
        }
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw start point indicator while drawing
    if (phase === "draw" && points.length > 0) {
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#818cf8";
      ctx.fill();
      ctx.strokeStyle = "#312e81";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [points, phase, gridCount]);

  // ── Actions ──
  function confirmShape() {
    if (points.length < 3) return;
    setPhase("grid");
  }

  function resetAll() {
    setPhase("draw");
    setPoints([]);
    setGridCount(DEFAULT_GRID);
    setStats({ inside: 0, partial: 0, area: 0 });
  }

  function adjustGrid(delta: number) {
    setGridCount((prev) => Math.max(MIN_GRID, Math.min(MAX_GRID, prev + delta)));
  }

  return (
    <div className="space-y-5">
      {/* Instructions */}
      <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          {phase === "draw" ? (
            <Pencil className="w-5 h-5 text-indigo-400" />
          ) : (
            <Grid3X3 className="w-5 h-5 text-indigo-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {phase === "draw"
              ? "Desenhe uma forma irregular"
              : "Ajuste a malha de quadrículas"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {phase === "draw"
              ? "Use o mouse ou o dedo para desenhar. A forma será fechada automaticamente."
              : "Use os controles para variar a quantidade de quadrículas e observar a contagem."}
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative bg-slate-950 rounded-2xl border border-border overflow-hidden"
        style={{ maxWidth: CANVAS_SIZE }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{
            width: CANVAS_SIZE * canvasScale,
            height: CANVAS_SIZE * canvasScale,
            touchAction: "none",
            cursor: phase === "draw" ? "crosshair" : "default",
          }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* Empty state */}
        {phase === "draw" && points.length === 0 && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-2"
              >
                ✏️
              </motion.div>
              <p className="text-muted-foreground text-sm font-medium">
                Clique e arraste para desenhar
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {phase === "draw" && (
          <>
            <Button
              onClick={confirmShape}
              disabled={points.length < 3}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar forma
            </Button>
            <Button onClick={resetAll} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Limpar
            </Button>
          </>
        )}

        {phase === "grid" && (
          <>
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => adjustGrid(-1)}
                disabled={gridCount <= MIN_GRID}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-bold text-foreground w-16 text-center">
                {gridCount} × {gridCount}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => adjustGrid(1)}
                disabled={gridCount >= MAX_GRID}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={resetAll} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Desenhar novamente
            </Button>
          </>
        )}
      </div>

      {/* Stats panel */}
      {phase === "grid" && points.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
            <div className="w-4 h-4 bg-green-500/40 rounded mx-auto mb-2 border border-green-500/50" />
            <p className="text-2xl font-bold text-green-400">{stats.inside}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Totalmente dentro</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
            <div className="w-4 h-4 bg-yellow-500/40 rounded mx-auto mb-2 border border-yellow-500/50" />
            <p className="text-2xl font-bold text-yellow-400">{stats.partial}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Parcialmente dentro</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-center">
            <div className="text-lg mb-1">📐</div>
            <p className="text-2xl font-bold text-indigo-400">≈{stats.area}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Área estimada</p>
          </div>
        </motion.div>
      )}

      {/* Educational tip */}
      {phase === "grid" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4"
        >
          <p className="text-sm text-amber-200/90 font-medium mb-1">💡 Dica</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Quanto mais quadrículas você usar, mais precisa será a estimativa da área.
            A fórmula é: <strong className="text-foreground">Área ≈ quadrados inteiros + (quadrados parciais × 0,5)</strong>.
            Experimente aumentar a quantidade para ver como a estimativa muda!
          </p>
        </motion.div>
      )}
    </div>
  );
}
