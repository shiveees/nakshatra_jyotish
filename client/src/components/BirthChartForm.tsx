import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { insertBirthChartSchema, type InsertBirthChart } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function BirthChartForm({ onSubmit }: { onSubmit: (data: InsertBirthChart) => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const form = useForm<InsertBirthChart>({
    resolver: zodResolver(insertBirthChartSchema),
    defaultValues: {
      name: "",
      birthDate: new Date(),
      birthTime: "",
      birthPlace: "",
      latitude: "",
      longitude: ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.name')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.birthDate')}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.birthTime')}</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthPlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.birthPlace')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {t('form.submit')}
        </Button>
      </form>
    </Form>
  );
}
