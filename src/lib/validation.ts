import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Shkruani emrin dhe mbiemrin.").max(120, "Emri është shumë i gjatë."),
  email: z.string().trim().toLowerCase().email("Shkruani një adresë emaili të vlefshme.").max(200),
  subject: z.string().trim().min(2, "Shkruani subjektin.").max(200, "Subjekti është shumë i gjatë."),
  message: z.string().trim().min(10, "Mesazhi duhet të ketë të paktën 10 shkronja.").max(5000, "Mesazhi është shumë i gjatë."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
  values?: Partial<ContactInput>;
};
