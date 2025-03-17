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
  { symbol: "☉", name: "Sun" },
  { symbol: "☽", name: "Moon" },
  { symbol: "☿", name: "Mercury" },
  { symbol: "♀", name: "Venus" },
  { symbol: "♂", name: "Mars" },
  { symbol: "♃", name: "Jupiter" },
  { symbol: "♄", name: "Saturn" },
  { symbol: "♅", name: "Uranus" },
  { symbol: "♆", name: "Neptune" }
];

export function BirthChart({ data, className }: BirthChartProps) {
  const { t } = useTranslation();
  const size = 600;
  const center = size / 2;
  const radius = size * 0.4;

  // Generate points for houses
  const generateHousePoints = (index: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="fill-background/50 stroke-border"
          strokeWidth="2"
        />

        {/* House lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const start = generateHousePoints(i);
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
          const angle = i * 30 - 90;
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
                <span className="text-primary">{planet.symbol}</span>
                <span>{planet.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
