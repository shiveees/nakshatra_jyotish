import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { calculatePlanetaryPositions, type Location, DEFAULT_LOCATION } from '@/lib/location';

const RASHIS = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];

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

const NAKSHATRAS = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा",
  "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्व फाल्गुनी", "उत्तर फाल्गुनी",
  "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा",
  "मूल", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शतभिषा",
  "पूर्व भाद्रपद", "उत्तर भाद्रपद", "रेवती"
];

const CHOGHADIYA = [
  { name: "उद्वेग", type: "अशुभ" },
  { name: "चल", type: "शुभ" },
  { name: "लाभ", type: "शुभ" },
  { name: "अमृत", type: "शुभ" },
  { name: "काल", type: "अशुभ" },
  { name: "शुभ", type: "शुभ" },
  { name: "रोग", type: "अशुभ" },
  { name: "मृत्यु", type: "अशुभ" }
];

interface WidgetProps {
  location?: Location;
}

export function RealTimeWidgets({ location = DEFAULT_LOCATION }: WidgetProps) {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [planetaryPositions, setPlanetaryPositions] = useState(calculatePlanetaryPositions(location));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setPlanetaryPositions(calculatePlanetaryPositions(location, now));
    }, 1000);
    return () => clearInterval(timer);
  }, [location]);

  // Calculate current planetary positions
  const getPlanetPosition = (angle: number) => {
    const rashiIndex = Math.floor(angle / 30);
    const houseIndex = Math.floor((angle + 180) / 30) % 12;
    return {
      rashi: RASHIS[rashiIndex],
      house: houseIndex + 1
    };
  };

  // Calculate current nakshatra
  const getCurrentNakshatra = () => {
    const moonPosition = planetaryPositions[1]?.angle || 0;
    const nakshatraIndex = Math.floor((moonPosition * 27) / 360);
    const rashiIndex = Math.floor(moonPosition / 30);
    return {
      name: NAKSHATRAS[nakshatraIndex % 27],
      rashi: RASHIS[rashiIndex % 12]
    };
  };

  // Calculate current choghadiya
  const getCurrentChoghadiya = () => {
    const hour = currentTime.getHours();
    const isSunrise = hour >= 6 && hour < 18;
    const periodLength = 12 / 8; // Length of each period in hours
    const periodIndex = Math.floor(((hour - (isSunrise ? 6 : 18)) % 12) / periodLength);
    return CHOGHADIYA[periodIndex % 8];
  };

  const nakshatra = getCurrentNakshatra();
  const choghadiya = getCurrentChoghadiya();

  return (
    <div className="fixed right-4 top-20 space-y-2 w-48 z-50">
      {/* Planetary Positions */}
      <Card className="p-2 bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
        <h3 className="text-sm font-bold text-[#6A9C89] mb-1">ग्रह स्थिति</h3>
        <div className="space-y-1 text-xs">
          {PLANETS.map((planet, index) => {
            const position = getPlanetPosition(planetaryPositions[index]?.angle || 0);
            return (
              <div key={planet.name} className="flex items-center justify-between">
                <span className="text-[#6A9C89]">{planet.symbol} {planet.name}</span>
                <span className="text-[#FFA725]">
                  {position.rashi} ({position.house})
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Nakshatra Position */}
      <Card className="p-2 bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
        <h3 className="text-sm font-bold text-[#6A9C89] mb-1">नक्षत्र स्थिति</h3>
        <div className="text-xs">
          <div className="text-[#FFA725]">{nakshatra.name}</div>
          <div className="text-[#6A9C89]">राशि: {nakshatra.rashi}</div>
        </div>
      </Card>

      {/* Choghadiya */}
      <Card className="p-2 bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
        <h3 className="text-sm font-bold text-[#6A9C89] mb-1">चौघड़िया</h3>
        <div className="text-xs flex justify-between items-center">
          <span className="text-[#FFA725]">{choghadiya.name}</span>
          <span className={choghadiya.type === "शुभ" ? "text-[#C1D8C3]" : "text-red-500"}>
            ({choghadiya.type})
          </span>
        </div>
      </Card>
    </div>
  );
}