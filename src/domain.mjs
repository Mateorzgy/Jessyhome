export const PHONE = "59898360204";
export function money(value, currency = "UYU") {
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "es-UY", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
export function visibleProducts(products, category = "", search = "") {
  const q = search
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  return products.filter(
    (p) =>
      p.in_stock &&
      (!category || p.category_id === category) &&
      `${p.name} ${p.description}`
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .includes(q),
  );
}
export function whatsappUrl(products, currency, demo = false) {
  const lines = products.map(
    (p) =>
      `• ${p.name} — ${currency} ${money(p[currency === "BRL" ? "price_brl" : "price_uyu"], currency)}`,
  );
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(`¡Hola Jessica! ${demo ? "Estoy probando el catálogo de demostración. " : ""}Me interesan estos productos:\n${lines.join("\n")}\n\n¿Me confirmás disponibilidad y cómo coordinamos?`)}`;
}
export function validateProduct(p) {
  if (!p.name?.trim()) throw new Error("Escribí el nombre del producto.");
  if (!p.category_id) throw new Error("Elegí una categoría.");
  for (const k of ["price_uyu", "price_brl"])
    if (!Number.isFinite(Number(p[k])) || Number(p[k]) <= 0)
      throw new Error("Los dos precios deben ser mayores que cero.");
  return {
    ...p,
    name: p.name.trim(),
    price_uyu: Number(p.price_uyu),
    price_brl: Number(p.price_brl),
  };
}
