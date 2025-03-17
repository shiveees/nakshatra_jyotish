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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormLabel className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t('form.name')}
                </FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background/50 backdrop-blur-sm" />
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
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('form.birthDate')}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                    className="bg-background/50 backdrop-blur-sm" 
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
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('form.birthTime')}
                </FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="bg-background/50 backdrop-blur-sm" />
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
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('form.birthPlace')}
                </FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background/50 backdrop-blur-sm" />
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
            className="w-full bg-primary/80 hover:bg-primary backdrop-blur-sm
                     transition-all duration-300 ease-in-out transform hover:scale-105
                     hover:shadow-lg hover:shadow-primary/20"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {t('form.submit')}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}