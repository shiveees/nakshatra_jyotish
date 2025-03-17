import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { insertBirthChartSchema, type InsertBirthChart } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Clock, MapPin } from "lucide-react";

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

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#6A9C89]">नक्षत्र लोक</h2>
          <p className="text-[#6A9C89]/80">जन्मपत्रिका विश्लेषण</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-[#6A9C89]">
                  <Sparkles className="h-4 w-4" />
                  {t('form.name')}
                </FormLabel>
                <FormControl>
                  <Input {...field} className="custom-input" />
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-[#6A9C89]">
                  <Calendar className="h-4 w-4" />
                  {t('form.birthDate')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={value instanceof Date ? formatDate(value) : ''}
                    onChange={(e) => {
                      const dateStr = e.target.value;
                      if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                        onChange(parseDate(dateStr));
                      } else {
                        onChange(e.target.value);
                      }
                    }}
                    {...field}
                    className="custom-input"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-[#6A9C89]">
                  <Clock className="h-4 w-4" />
                  {t('form.birthTime')}
                </FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="custom-input" />
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FormField
            control={form.control}
            name="birthPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-[#6A9C89]">
                  <MapPin className="h-4 w-4" />
                  {t('form.birthPlace')}
                </FormLabel>
                <FormControl>
                  <Input {...field} className="custom-input" />
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button 
            type="submit" 
            size="lg"
            className="w-full custom-button"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {t('form.submit')}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}