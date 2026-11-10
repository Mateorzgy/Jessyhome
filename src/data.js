const image = (name) => `${import.meta.env.BASE_URL}images/${name}.jpg`;
export const demoCategories = [
  { id: "textiles", name: "Textiles" },
  { id: "cocina", name: "Electrodomésticos" },
  { id: "infantil", name: "Infantil" },
];
export const demoProducts = [
  {
    id: "linen",
    name: "Juego de cama suave",
    description:
      "Un descanso más lindo. Juego de sábanas de dos plazas, en tono natural.",
    category_id: "textiles",
    price_uyu: 1890,
    price_brl: 249,
    in_stock: true,
    images: [image("bed")],
  },
  {
    id: "coffee",
    name: "Cafetera de filtro",
    description:
      "Para ese primer café del día. Cafetera eléctrica con jarra y filtro reutilizable.",
    category_id: "cocina",
    price_uyu: 2490,
    price_brl: 329,
    in_stock: true,
    images: [image("coffee")],
  },
  {
    id: "bear",
    name: "Un pequeño compañero",
    description:
      "Un osito suave para acompañar sus juegos. Consultá las medidas y la edad recomendada.",
    category_id: "infantil",
    price_uyu: 690,
    price_brl: 89,
    in_stock: true,
    images: [image("bear")],
  },
  {
    id: "blanket",
    name: "Manta de algodón",
    description:
      "Una capa de abrigo para el sillón, la cama y las tardes tranquilas.",
    category_id: "textiles",
    price_uyu: 1290,
    price_brl: 169,
    in_stock: true,
    images: [image("blanket")],
  },
  {
    id: "kettle",
    name: "Jarra eléctrica",
    description:
      "Agua caliente para compartir. Jarra eléctrica con apagado automático.",
    category_id: "cocina",
    price_uyu: 1590,
    price_brl: 209,
    in_stock: true,
    images: [image("kettle")],
  },
  {
    id: "toys",
    name: "Juegos de madera",
    description:
      "Formas y colores para descubrir jugando. Consultá las piezas incluidas y la edad recomendada.",
    category_id: "infantil",
    price_uyu: 890,
    price_brl: 119,
    in_stock: true,
    images: [image("toys")],
  },
  {
    id: "hidden",
    name: "Toallas de baño",
    description: "Producto agotado de demostración.",
    category_id: "textiles",
    price_uyu: 990,
    price_brl: 129,
    in_stock: false,
    images: [image("bed")],
  },
];
