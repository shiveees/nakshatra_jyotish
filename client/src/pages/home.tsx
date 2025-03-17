import { useTranslation } from "react-i18next";
import { BirthChartForm } from "@/components/BirthChartForm";
import { PlanetaryView } from "@/components/PlanetaryView";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground bg-[url('https://images.unsplash.com/photo-1464802686167-b939a6910659')] bg-cover bg-fixed">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-2">
          {t('common.title')}
        </h1>
        <p className="text-xl text-center mb-8 text-muted-foreground">
          {t('common.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="backdrop-blur-lg bg-background/80">
            <CardContent className="p-6">
              <BirthChartForm onSubmit={console.log} />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-background/80">
            <CardContent className="p-6">
              <PlanetaryView />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
