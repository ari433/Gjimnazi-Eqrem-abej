import { z } from "zod";
import type { Locale } from "./i18n";

const MSG = {
  sq: {
    name: "Shkruani emrin dhe mbiemrin.",
    nameLong: "Emri është shumë i gjatë.",
    email: "Shkruani një adresë emaili të vlefshme.",
    subject: "Shkruani subjektin.",
    subjectLong: "Subjekti është shumë i gjatë.",
    message: "Mesazhi duhet të ketë të paktën 10 shkronja.",
    messageLong: "Mesazhi është shumë i gjatë.",
    check: "Kontrolloni fushat e shënuara.",
    sent: "Faleminderit. Mesazhi u dërgua te administrata e shkollës.",
    failed: "Mesazhi nuk u dërgua. Provoni përsëri pas pak.",
    inactive: "Formulari ende nuk është aktivizuar. Na shkruani përmes Instagramit të shkollës.",
  },
  de: {
    name: "Bitte Vor- und Nachnamen angeben.",
    nameLong: "Der Name ist zu lang.",
    email: "Bitte eine gültige E-Mail-Adresse angeben.",
    subject: "Bitte einen Betreff angeben.",
    subjectLong: "Der Betreff ist zu lang.",
    message: "Die Nachricht muss mindestens 10 Zeichen haben.",
    messageLong: "Die Nachricht ist zu lang.",
    check: "Bitte die markierten Felder prüfen.",
    sent: "Vielen Dank. Ihre Nachricht wurde an die Schulverwaltung gesendet.",
    failed: "Die Nachricht wurde nicht gesendet. Bitte später erneut versuchen.",
    inactive: "Das Formular ist noch nicht aktiv. Bitte schreiben Sie uns über Instagram.",
  },
};

export function contactMessages(locale: Locale) {
  return MSG[locale];
}

export function contactSchema(locale: Locale = "sq") {
  const m = MSG[locale];
  return z.object({
    name: z.string().trim().min(2, m.name).max(120, m.nameLong),
    email: z.string().trim().toLowerCase().email(m.email).max(200),
    subject: z.string().trim().min(2, m.subject).max(200, m.subjectLong),
    message: z.string().trim().min(10, m.message).max(5000, m.messageLong),
  });
}

export type ContactInput = z.infer<ReturnType<typeof contactSchema>>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
  values?: Partial<ContactInput>;
};
