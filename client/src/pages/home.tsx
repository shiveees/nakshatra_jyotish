import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { BirthChartForm } from "@/components/BirthChartForm";
import { PlanetaryView } from "@/components/PlanetaryView";
import { Card, CardContent } from "@/components/ui/card";
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
  { name: "उद्वेग", type: "अशुभ", duration: 90 }, // 90 minutes each
  { name: "चल", type: "शुभ", duration: 90 },
  { name: "लाभ", type: "शुभ", duration: 90 },
  { name: "अमृत", type: "शुभ", duration: 90 },
  { name: "काल", type: "अशुभ", duration: 90 },
  { name: "शुभ", type: "शुभ", duration: 90 },
  { name: "रोग", type: "अशुभ", duration: 90 },
  { name: "मृत्यु", type: "अशुभ", duration: 90 }
];

export default function Home() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [planetaryPositions, setPlanetaryPositions] = useState(calculatePlanetaryPositions(location));

  useEffect(() => {
    // Update every minute instead of every second for better performance
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setPlanetaryPositions(calculatePlanetaryPositions(location, now));
    }, 60000);
    return () => clearInterval(timer);
  }, [location]);

  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: "वर्तमान स्थान"
        });
      });
    }
  }, []);

  // Calculate current planetary positions with precision
  const getPlanetPosition = (angle: number) => {
    const rashiIndex = Math.floor(angle / 30) % 12;
    const houseIndex = Math.floor((angle + 180) / 30) % 12;
    const degrees = Math.floor(angle % 30);
    const minutes = Math.floor((angle % 1) * 60);
    return {
      rashi: RASHIS[rashiIndex],
      house: houseIndex + 1,
      position: `${degrees}°${minutes}'`
    };
  };

  // Calculate current nakshatra with planetary influence
  const getCurrentNakshatra = () => {
    const moonPosition = planetaryPositions[1]?.angle || 0;
    const nakshatraIndex = Math.floor((moonPosition * 27) / 360) % 27;
    const rashiIndex = Math.floor(moonPosition / 30) % 12;

    // Find planets in the same nakshatra region
    const nakshatraStart = (nakshatraIndex * 360) / 27;
    const nakshatraEnd = ((nakshatraIndex + 1) * 360) / 27;

    const companionPlanets = PLANETS.filter((_, index) => {
      const planetAngle = planetaryPositions[index]?.angle || 0;
      return planetAngle >= nakshatraStart && planetAngle < nakshatraEnd && index !== 1; // Exclude Moon
    });

    return {
      name: NAKSHATRAS[nakshatraIndex],
      rashi: RASHIS[rashiIndex],
      companions: companionPlanets
    };
  };

  // Calculate current choghadiya with timing
  const getCurrentChoghadiya = () => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const isSunrise = hour >= 6 && hour < 18;
    const dayStart = isSunrise ? 6 : 18;
    const periodLength = 90; // 90 minutes per period

    const minutesSinceStart = ((hour - dayStart + 24) % 12) * 60 + minute;
    const periodIndex = Math.floor(minutesSinceStart / periodLength) % 8;

    const startTime = new Date(currentTime);
    startTime.setHours(dayStart + Math.floor(periodIndex * 1.5));
    startTime.setMinutes((periodIndex * 1.5 % 1) * 60);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 90);

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('hi-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    return {
      ...CHOGHADIYA[periodIndex],
      startTime: formatTime(startTime),
      endTime: formatTime(endTime)
    };
  };

  const nakshatra = getCurrentNakshatra();
  const choghadiya = getCurrentChoghadiya();

  return (
    <div className="min-h-screen bg-[#FFF5E4] text-[#6A9C89] overflow-hidden relative">
      <PlanetaryView location={location} />

      <div className="container mx-auto px-4 py-8 relative grid grid-cols-12 gap-4">
        {/* Left side widgets */}
        <div className="col-span-3 space-y-4">
          {/* Planetary Positions */}
          <Card className="bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-[#6A9C89] mb-2">ग्रह स्थिति</h3>
              <p className="text-sm mb-2 text-[#6A9C89]">{location.name}</p>
              <div className="space-y-2">
                {PLANETS.map((planet, index) => {
                  const position = getPlanetPosition(planetaryPositions[index]?.angle || 0);
                  return (
                    <div key={planet.name} className="flex items-center justify-between">
                      <span className="text-[#6A9C89]">{planet.symbol} {planet.name}</span>
                      <span className="text-[#FFA725]">
                        {position.rashi} ({position.house}) {position.position}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Nakshatra Position */}
          <Card className="bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-[#6A9C89] mb-2">नक्षत्र स्थिति</h3>
              <div>
                <div className="text-[#FFA725] text-lg">{nakshatra.name}</div>
                <div className="text-[#6A9C89]">राशि: {nakshatra.rashi}</div>
                {nakshatra.companions.length > 0 && (
                  <div className="mt-2 text-sm">
                    <div className="text-[#6A9C89]">साथी ग्रह:</div>
                    <div className="flex flex-wrap gap-2">
                      {nakshatra.companions.map(planet => (
                        <span key={planet.name} className="text-[#FFA725]">
                          {planet.symbol} {planet.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Choghadiya */}
          <Card className="bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-[#6A9C89] mb-2">चौघड़िया</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#FFA725] text-lg">{choghadiya.name}</span>
                  <span className={choghadiya.type === "शुभ" ? "text-[#C1D8C3]" : "text-red-500"}>
                    ({choghadiya.type})
                  </span>
                </div>
                <div className="text-sm text-[#6A9C89]">
                  समय: {choghadiya.startTime} - {choghadiya.endTime}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="col-span-9">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-[#FFA725]">
            {t('common.title')}
          </h1>
          <p className="text-xl text-center mb-8 text-[#6A9C89]">
            {t('common.subtitle')}
          </p>

          <div className="max-w-2xl mx-auto">
            <Card className="backdrop-blur-lg bg-[#FFF5E4]/30 border-[#6A9C89]/20">
              <CardContent className="p-6">
                <BirthChartForm onSubmit={console.log} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}