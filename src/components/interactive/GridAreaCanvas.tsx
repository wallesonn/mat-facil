"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Grid3X3, RotateCcw, CheckCircle2, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [cellSide, setCellSide] = useState("1");
  const [unit, setUnit] = useState<"mm" | "cm" | "m">("cm");
  const [stats, setStats] = useState({ inside: 0, partial: 0 });

  const unitLabel = unit === "mm" ? "mm\u00B2" : unit === "cm" ? "cm\u00B2" : "m\u00B2";
  const sideValue = parseFloat(cellSide) || 0;
  const cellAreaReal = sideValue * sideValue;
  const realArea = parseFloat(((stats.inside + stats.partial * 0.5) * cellAreaReal).toFixed(4));

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

    setStats({ inside, partial });
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
    setCellSide("1");
    setStats({ inside: 0, partial: 0 });
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
        className="relative bg-slate-950 rounded-2xl border border-border overflow-hidden w-full"
        style={{ maxWidth: CANVAS_SIZE }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{
            width: "100%",
            height: "auto",
            touchAction: "none",
            cursor: phase === "draw" ? "crosshair" : "default",
            aspectRatio: "1 / 1",
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
          <Button onClick={resetAll} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Desenhar novamente
          </Button>
        )}
      </div>

      {/* Grid controls + measurement */}
      {phase === "grid" && points.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Slider para quantidade de quadrículas */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Quadrículas da malha</p>
              <span className="text-sm font-bold text-indigo-400">{gridCount} × {gridCount}</span>
            </div>
            <input
              type="range"
              min={MIN_GRID}
              max={MAX_GRID}
              value={gridCount}
              onChange={(e) => setGridCount(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{MIN_GRID}×{MIN_GRID}</span>
              <span>{MAX_GRID}×{MAX_GRID}</span>
            </div>
          </div>

          {/* Lado do quadrinho + unidade */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="w-4 h-4 text-indigo-400" />
              <p className="text-sm font-semibold text-foreground">Tamanho do lado do quadrinho</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={cellSide}
                onChange={(e) => setCellSide(e.target.value)}
                className="w-24 sm:w-28 text-center font-bold"
                placeholder="1.0"
              />
              <div className="flex rounded-lg border border-border overflow-hidden">
                {(["mm", "cm", "m"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-3 py-2 text-xs font-bold transition-colors ${
                      unit === u
                        ? "bg-indigo-600 text-white"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats panel */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3 sm:p-4 text-center">
              <div className="w-4 h-4 bg-green-500/40 rounded mx-auto mb-1.5 sm:mb-2 border border-green-500/50" />
              <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.inside}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Totalmente dentro</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-3 sm:p-4 text-center">
              <div className="w-4 h-4 bg-yellow-500/40 rounded mx-auto mb-1.5 sm:mb-2 border border-yellow-500/50" />
              <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.partial}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Parcialmente dentro</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-base sm:text-lg mb-1">📏</div>
              <p className="text-xl sm:text-2xl font-bold text-purple-400">≈{realArea}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Área ({unitLabel})</p>
            </div>
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
            A fórmula é: <strong className="text-foreground">Área ≈ (inteiros + parciais × 0,5) × lado²</strong>.
            Arraste o slider para variar a malha e veja como a estimativa fica mais precisa!
          </p>
        </motion.div>
      )}
    </div>
  );
}
