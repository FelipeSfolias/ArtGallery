// A interface ObraArte não tem campo de imagem (segue o enunciado).
// Por isso a ilustração é encontrada pelo título: "A Noite Estrelada" -> obras/a-noite-estrelada.svg
// Os arquivos ficam em public/obras/.

const ILUSTRACOES = new Set([
  "a-noite-estrelada",
  "abaporu",
  "operarios",
  "retirantes",
  "o-lavrador-de-cafe",
  "o-pensador",
  "mona-lisa",
  "o-grito",
  "a-grande-onda-de-kanagawa",
  "moca-com-brinco-de-perola",
]);

/** "Moça com Brinco de Pérola" -> "moca-com-brinco-de-perola" */
export function slug(texto: string): string {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Caminho da ilustração SVG da obra, ou null se não houver. */
export function imagemDaObra(titulo: string): string | null {
  const nome = slug(titulo);
  return ILUSTRACOES.has(nome) ? `obras/${nome}.svg` : null;
}

/** Ícone usado quando a obra não tem ilustração. */
export function iconeDaObra(tecnica: string): string {
  const t = (tecnica ?? "").toLowerCase();
  if (/escult|bronze|m[aá]rmore|argila|cer[aâ]mica/.test(t)) return "🗿";
  if (/foto/.test(t)) return "📷";
  if (/desenho|grafite|carv[aã]o|nanquim|l[aá]pis/.test(t)) return "✏️";
  if (/gravura|xilo|lito/.test(t)) return "🖋️";
  if (/digital/.test(t)) return "🖥️";
  return "🎨";
}
