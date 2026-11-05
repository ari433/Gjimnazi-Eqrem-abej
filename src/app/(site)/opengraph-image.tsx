import { renderOg } from "@/lib/og";

export const alt = "Gjimnazi \"Eqrem Çabej\", Prishtinë";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg("Gjimnazi i shkencave shoqërore-gjuhësore, Prishtinë");
}
