// Seed routes for the static preview crawler; it also follows internal links.
const SQ = [
  "/", "/rreth-shkolles", "/historia-dhe-misioni", "/udheheqja-dhe-stafi", "/arritjet",
  "/programet", "/per-nxenesit", "/dokumentet", "/klubet", "/klubi-i-medias", "/projektet",
  "/galeria", "/lajme", "/njoftimet", "/kalendari", "/kontakti",
];
export const NAV = [...SQ, ...SQ.map((p) => (p === "/" ? "/de" : `/de${p}`))];
