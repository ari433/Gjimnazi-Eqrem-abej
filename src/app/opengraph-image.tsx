import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Gjimnazi \"Eqrem Çabej\", Prishtinë";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f6fa", position: "relative", fontFamily: "sans-serif" }}>
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -120,
            fontSize: 820,
            fontWeight: 800,
            lineHeight: 1,
            color: "#2b4bff",
            display: "flex",
          }}
        >
          Ç
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={96} height={96} style={{ borderRadius: 999 }} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 800, color: "#0a1838", letterSpacing: -3, lineHeight: 1 }}>Gjimnazi &ldquo;Eqrem Çabej&rdquo;</div>
            <div style={{ fontSize: 32, color: "#566079", marginTop: 20 }}>Gjimnazi i shkencave shoqërore-gjuhësore, Prishtinë</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
