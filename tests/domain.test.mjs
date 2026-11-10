import { test } from "node:test";
import assert from "node:assert/strict";
import {
  visibleProducts,
  whatsappUrl,
  validateProduct,
} from "../src/domain.mjs";
const products = [
  {
    id: 1,
    name: "Sábana",
    description: "Algodón",
    category_id: "a",
    in_stock: true,
    price_uyu: 100,
    price_brl: 15,
  },
  {
    id: 2,
    name: "Agotado",
    description: "",
    category_id: "a",
    in_stock: false,
    price_uyu: 10,
    price_brl: 2,
  },
];
test("agotados ocultos incluso al buscar por nombre", () =>
  assert.equal(visibleProducts(products, "", "agotado").length, 0));
test("buscador tolera tildes y filtros combinados", () => {
  assert.equal(visibleProducts(products, "a", "sabana").length, 1);
  assert.equal(visibleProducts(products, "b", "sabana").length, 0);
});
test("WhatsApp conserva teléfono, moneda, productos y aviso demo", () => {
  const url = new URL(whatsappUrl([products[0]], "BRL", true));
  assert.equal(url.pathname, "/59898360204");
  const message = url.searchParams.get("text");
  assert.match(message, /demostración/);
  assert.match(message, /Sábana/);
  assert.match(message, /BRL/);
  assert.match(message, /15/);
});
test("rechaza precios inválidos y categorías vacías", () => {
  assert.throws(() => validateProduct({ ...products[0], price_brl: -1 }));
  assert.throws(() => validateProduct({ ...products[0], price_uyu: Infinity }));
  assert.throws(() => validateProduct({ ...products[0], category_id: "" }));
  assert.equal(
    validateProduct({ ...products[0], price_uyu: "100.50" }).price_uyu,
    100.5,
  );
});
