import { renderOg } from "@/lib/og";

export const alt = "Gymnasium \"Eqrem Çabej\", Prishtina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg("Gymnasium für Sozial- und Sprachwissenschaften, Prishtina");
}
