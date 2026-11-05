import { Fragment, type ReactNode } from "react";

/**
 * Small, safe Markdown renderer for CMS text. Builds React elements directly
 * (no HTML injection). Supports: ## / ### headings, paragraphs, - and 1.
 * lists, > quotes, **bold**, *italic* and [links](https://…).
 */

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[2]) out.push(<strong key={k}>{m[2]}</strong>);
    else if (m[3]) out.push(<em key={k}>{m[3]}</em>);
    else if (m[4] && m[5]) {
      const href = m[5];
      const safe = /^(https?:\/\/|\/|mailto:|tel:|#)/.test(href);
      const external = /^https?:\/\//.test(href);
      out.push(
        safe ? (
          <a key={k} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {m[4]}
          </a>
        ) : (
          <Fragment key={k}>{m[4]}</Fragment>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        const key = `b${bi}`;
        if (block.startsWith("### ")) return <h3 key={key}>{inline(block.slice(4), key)}</h3>;
        if (block.startsWith("## ")) return <h2 key={key}>{inline(block.slice(3), key)}</h2>;
        if (block.startsWith("# ")) return <h2 key={key}>{inline(block.slice(2), key)}</h2>;
        const lines = block.split("\n");
        if (lines.every((l) => /^[-*] /.test(l)))
          return (
            <ul key={key}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.slice(2), `${key}-${li}`)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+[.)] /.test(l)))
          return (
            <ol key={key}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\d+[.)] /, ""), `${key}-${li}`)}</li>
              ))}
            </ol>
          );
        if (lines.every((l) => l.startsWith(">")))
          return <blockquote key={key}>{inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), key)}</blockquote>;
        return (
          <p key={key}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `${key}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/** Plain-text excerpt from Markdown, for meta descriptions. */
export function plainText(source: string, max = 160) {
  const t = source
    .replace(/[#>*_`]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}
