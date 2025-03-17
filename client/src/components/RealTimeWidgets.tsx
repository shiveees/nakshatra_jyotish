import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

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

export function RealTimeWidgets() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate current nakshatra (simplified version)
  const currentNakshatra = NAKSHATRAS[currentTime.getHours() % NAKSHATRAS.length];

  // Calculate current choghadiya (simplified version)
  const currentPeriod = Math.floor((currentTime.getHours() % 24) / 3);
  const currentChoghadiya = CHOGHADIYA[currentPeriod];

  return (
    <div className="fixed top-4 right-4 space-y-4 w-64">
      <Card className="p-4 bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
        <h3 className="text-lg font-bold text-[#6A9C89] mb-2">वर्तमान समय</h3>
        <p className="text-[#6A9C89]">
          {currentTime.toLocaleTimeString('hi-IN')}
        </p>
      </Card>

      <Card className="p-4 bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
        <h3 className="text-lg font-bold text-[#6A9C89] mb-2">वर्तमान नक्षत्र</h3>
        <p className="text-[#6A9C89]">{currentNakshatra}</p>
      </Card>

      <Card className="p-4 bg-[#FFF5E4]/80 backdrop-blur-sm border-[#6A9C89]">
        <h3 className="text-lg font-bold text-[#6A9C89] mb-2">चौघड़िया मुहूर्त</h3>
        <p className="text-[#6A9C89]">
          {currentChoghadiya.name}
          <span className={currentChoghadiya.type === "शुभ" ? "text-green-600" : "text-red-600"}>
            {" "}({currentChoghadiya.type})
          </span>
        </p>
      </Card>
    </div>
  );
}
