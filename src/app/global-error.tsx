"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="sq">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f4f6fa", color: "#0a1838", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ maxWidth: 520, padding: 24 }}>
          <h1 style={{ fontSize: 40, letterSpacing: "-0.03em", margin: 0 }}>Faqja nuk u ngarkua.</h1>
          <p style={{ color: "#566079", fontSize: 18 }}>Ndodhi një gabim i papritur. Provoni përsëri.</p>
          <button onClick={reset} style={{ marginTop: 16, padding: "12px 24px", borderRadius: 999, border: 0, background: "#0a1838", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Provo përsëri
          </button>
        </div>
      </body>
    </html>
  );
}
