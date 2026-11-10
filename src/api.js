import { createClient } from "@supabase/supabase-js";
import { demoCategories, demoProducts } from "./data";
const config = window.JESSYHOME_CONFIG || {};
const url = config.supabaseUrl || import.meta.env.VITE_SUPABASE_URL,
  key = config.supabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isDemo = !url && !key;
export const configError =
  !url !== !key
    ? "Falta completar la URL y la clave pública de Supabase."
    : null;
export const db = url && key ? createClient(url, key) : null;
const check = ({ data, error }) => {
  if (error) throw error;
  return data;
};
const demoKey = "jessyhome-demo-v1";
function localData() {
  try {
    const v = JSON.parse(localStorage.getItem(demoKey));
    if (v?.products && v?.categories) return v;
  } catch {}
  return {
    products: structuredClone(demoProducts),
    categories: structuredClone(demoCategories),
  };
}
export async function loadCatalog(admin = false) {
  if (configError) throw new Error(configError);
  if (isDemo) return localData();
  const products = db
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  const [p, c] = await Promise.all([
    admin ? products : products.eq("in_stock", true),
    db.from("categories").select("*").order("name"),
  ]);
  return { products: check(p), categories: check(c) };
}
export async function saveRecord(table, record) {
  if (isDemo) {
    const data = localData();
    const row = { ...record, id: record.id || crypto.randomUUID() };
    const i = data[table].findIndex((r) => r.id === row.id);
    if (i < 0) data[table].unshift(row);
    else data[table][i] = row;
    localStorage.setItem(demoKey, JSON.stringify(data));
    return row;
  }
  return check(await db.from(table).upsert(record).select().single());
}
export async function removeRecord(table, id) {
  if (isDemo) {
    const data = localData();
    if (
      table === "categories" &&
      data.products.some((p) => p.category_id === id)
    )
      throw new Error(
        "Mové o eliminá los productos de esta categoría primero.",
      );
    data[table] = data[table].filter((p) => p.id !== id);
    localStorage.setItem(demoKey, JSON.stringify(data));
    return;
  }
  check(await db.from(table).delete().eq("id", id));
}
export async function uploadPhotos(files) {
  const urls = [];
  for (const file of files) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      throw new Error("Usá imágenes JPG, PNG o WebP.");
    if (file.size > 5 * 1024 * 1024)
      throw new Error("Cada foto debe pesar menos de 5 MB.");
    if (isDemo) {
      urls.push(
        await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("No se pudo leer la foto."));
          reader.readAsDataURL(file);
        }),
      );
    } else {
      const path = `${crypto.randomUUID()}.${file.type.split("/")[1]}`;
      check(await db.storage.from("product-images").upload(path, file));
      urls.push(
        db.storage.from("product-images").getPublicUrl(path).data.publicUrl,
      );
    }
  }
  return urls;
}
