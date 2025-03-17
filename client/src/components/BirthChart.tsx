import { useTranslation } from "react-i18next";
import { type BirthChart as BirthChartType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface BirthChartProps {
  data: BirthChartType;
  className?: string;
}

const ZODIAC_SIGNS = [
  "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"
];

const PLANETS = [
  { symbol: "☉", name: "सूर्य" },
  { symbol: "☽", name: "चंद्र" },
  { symbol: "☿", name: "बुध" },
  { symbol: "♀", name: "शुक्र" },
  { symbol: "♂", name: "मंगल" },
  { symbol: "♃", name: "बृहस्पति" },
  { symbol: "♄", name: "शनि" },
  { symbol: "♅", name: "उरेनस" },
  { symbol: "♆", name: "नेपच्यून" }
];

export function BirthChart({ data, className }: BirthChartProps) {
  const { t } = useTranslation();
  const size = 600;
  const center = size / 2;
  const radius = size * 0.4;

  // Generate points for houses in diamond shape
  const generateHousePoints = (index: number) => {
    const angle = ((index * 30) - 45) * (Math.PI / 180); // Start from top (-45 degrees)
    // Use square/diamond shape instead of circle
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Generate inner diamond points for house divisions
  const generateInnerPoints = (index: number) => {
    const angle = ((index * 30) - 45) * (Math.PI / 180);
    const innerRadius = radius * 0.6;
    const x = center + innerRadius * Math.cos(angle);
    const y = center + innerRadius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        {/* Main diamond shape */}
        <g transform={`rotate(45 ${center} ${center})`}>
          <rect
            x={center - radius}
            y={center - radius}
            width={radius * 2}
            height={radius * 2}
            className="fill-background/50 stroke-border"
            strokeWidth="2"
          />
        </g>

        {/* Inner diamond shape */}
        <g transform={`rotate(45 ${center} ${center})`}>
          <rect
            x={center - radius * 0.6}
            y={center - radius * 0.6}
            width={radius * 1.2}
            height={radius * 1.2}
            className="fill-none stroke-border"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </g>

        {/* House lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const start = generateHousePoints(i);
          const innerPoint = generateInnerPoints(i);
          return (
            <line
              key={`house-line-${i}`}
              x1={center}
              y1={center}
              x2={start.x}
              y2={start.y}
              className="stroke-border"
              strokeWidth="1"
            />
          );
        })}

        {/* Zodiac signs */}
        {ZODIAC_SIGNS.map((sign, i) => {
          const point = generateHousePoints(i);
          const angle = (i * 30) - 45;
          return (
            <g
              key={`zodiac-${i}`}
              transform={`translate(${point.x},${point.y}) rotate(${angle})`}
            >
              <text
                className="fill-primary text-lg font-astrological"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${-angle})`}
              >
                {sign}
              </text>
            </g>
          );
        })}

        {/* Planetary positions */}
        {PLANETS.map((planet, i) => {
          const angle = ((i * 40) - 45) * (Math.PI / 180); // Distribute planets evenly
          const r = radius * 0.3; // Place planets inside the inner diamond
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);

          return (
            <g
              key={`planet-${i}`}
              transform={`translate(${x},${y})`}
            >
              <text
                className="fill-[#FFA725] text-lg font-astrological"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {planet.symbol}
              </text>
            </g>
          );
        })}

        {/* Center point */}
        <circle
          cx={center}
          cy={center}
          r="4"
          className="fill-primary"
        />
      </svg>

      {/* Chart info */}
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">
          {new Date(data.birthDate).toLocaleDateString()}
          {" "}
          {data.birthTime}
        </p>
        <p className="text-sm text-muted-foreground">
          {data.birthPlace}
        </p>

        {/* Planetary positions */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">{t('chart.planets')}</h4>
          <div className="grid grid-cols-3 gap-2">
            {PLANETS.map((planet) => (
              <div
                key={planet.name}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-[#FFA725]">{planet.symbol}</span>
                <span>{planet.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}