import { useTranslation } from "react-i18next";
import { BirthChartForm } from "@/components/BirthChartForm";
import { PlanetaryView } from "@/components/PlanetaryView";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <PlanetaryView />

      <div className="container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-primary">
          {t('common.title')}
        </h1>
        <p className="text-xl text-center mb-8 text-primary/80">
          {t('common.subtitle')}
        </p>

        <div className="max-w-2xl mx-auto">
          <Card className="backdrop-blur-lg bg-background/30 border border-primary/20">
            <CardContent className="p-6">
              <BirthChartForm onSubmit={console.log} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}