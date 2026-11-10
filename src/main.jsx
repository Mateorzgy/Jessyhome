import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import AnimatedContent from "./AnimatedContent";
import {
  db,
  isDemo,
  loadCatalog,
  saveRecord,
  removeRecord,
  uploadPhotos,
} from "./api";
import {
  money,
  visibleProducts,
  whatsappUrl,
  validateProduct,
  PHONE,
} from "./domain.mjs";
import "./styles.css";
import { credits as imageCredits } from "./credits";

const img = (name) => `${import.meta.env.BASE_URL}images/${name}.jpg`;
const contact = `https://wa.me/${PHONE}`;
function Icon({ name = "bag" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {name === "bag" ? (
        <>
          <path d="M5 7h14l1 14H4L5 7Z" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </>
      ) : name === "search" ? (
        <>
          <circle cx="10" cy="10" r="6.5" />
          <path d="m15 15 6 6" />
        </>
      ) : (
        <path d="m5 12 14 0m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}
function Reveal({ children, className = "", delay = 0 }) {
  return (
    <AnimatedContent
      className={className}
      distance={24}
      duration={0.7}
      delay={delay}
      threshold={0.04}
    >
      {children}
    </AnimatedContent>
  );
}
function Modal({ title, onClose, children, className = "" }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    const previous = document.activeElement;
    el.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={className}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="dialog-head">
        <h2>{title}</h2>
        <button className="text-button" onClick={onClose} aria-label="Cerrar">
          Cerrar ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
function App() {
  const [route, setRoute] = useState(location.hash);
  useEffect(() => {
    const fn = () => setRoute(location.hash);
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return route.startsWith("#admin") ? <Admin /> : <Shop />;
}
function Shop() {
  const [data, setData] = useState({ products: [], categories: [] }),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [category, setCategory] = useState(""),
    [query, setQuery] = useState(""),
    [currency, setCurrency] = useState("UYU"),
    [sort, setSort] = useState("default"),
    [selected, setSelected] = useState([]),
    [product, setProduct] = useState(null),
    [basket, setBasket] = useState(false),
    [credits, setCredits] = useState(false),
    [slide, setSlide] = useState(0);
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      setData(await loadCatalog());
    } catch {
      setError(
        "No pudimos cargar el catálogo. Probá de nuevo en unos instantes.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
    const sync = () => refresh();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (!document.hidden) setSlide((s) => (s + 1) % 2);
    }, 6500);
    return () => clearInterval(timer);
  }, []);
  let products = visibleProducts(data.products, category, query);
  if (sort !== "default")
    products = [...products].sort(
      (a, b) =>
        (a[currency === "BRL" ? "price_brl" : "price_uyu"] -
          b[currency === "BRL" ? "price_brl" : "price_uyu"]) *
        (sort === "low" ? 1 : -1),
    );
  const chosen = data.products.filter(
    (p) => p.in_stock && selected.includes(p.id),
  );
  const toggle = (p) =>
    setSelected((ids) =>
      ids.includes(p.id) ? ids.filter((id) => id !== p.id) : [...ids, p.id],
    );
  return (
    <>
      <a className="skip-link" href="#catalogo">
        Ir al catálogo
      </a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="JessyHome inicio">
          jessyhome<span>.</span>
        </a>
        <nav aria-label="Principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#contacto">Hablemos</a>
        </nav>
        <button className="bag-button" onClick={() => setBasket(true)}>
          <Icon />
          <span>Mi selección</span>
          <b>{chosen.length}</b>
        </button>
      </header>
      <main>
        <div className="stage">
          <div className="stage-copy">
            <section className="intro" aria-labelledby="hero-title">
              <Reveal>
                <h1 id="hero-title">
                  Tu casa,
                  <br />
                  más tuya.
                </h1>
              </Reveal>
              <Reveal delay={0.08}>
                <p>
                  Textiles, electrodomésticos y pequeños detalles para los más
                  chicos. Elegidos por Jessica, en Rivera.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <a className="button" href="#catalogo">
                  Explorar catálogo <Icon name="arrow" />
                </a>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="hero-note">
                  <span>De Jessica, para tu hogar.</span>
                  <span>Precios en UYU y BRL</span>
                </div>
              </Reveal>
            </section>
            <section
              className="category-intro"
              aria-labelledby="category-title"
            >
              <Reveal>
                <h2 id="category-title">¿Por dónde empezamos?</h2>
              </Reveal>
              <div className="category-links">
                {data.categories.map((c, i) => (
                  <Reveal key={c.id} delay={i * 0.06}>
                    <a
                      href="#catalogo"
                      onClick={() => {
                        setCategory(c.id);
                        setQuery("");
                      }}
                    >
                      {c.name}
                      <Icon name="arrow" />
                    </a>
                  </Reveal>
                ))}
              </div>
              <Reveal>
                <p>
                  Elegí lo que te gusta. Los detalles los conversamos por
                  WhatsApp.
                </p>
              </Reveal>
            </section>
          </div>
          <aside
            className="hero-picture"
            aria-label="Inspiración para el hogar"
          >
            <div className="hero-images">
              <img
                src={img("room")}
                width="1200"
                height="1500"
                alt="Un hogar luminoso, con madera y textiles naturales"
                className={slide === 0 ? "active" : ""}
              />
              <img
                src={img("room2")}
                width="1200"
                height="1500"
                alt="Un rincón tranquilo junto a la cama"
                className={slide === 1 ? "active" : ""}
              />
            </div>
            <div className="picture-caption">
              <span>Rivera, Uruguay</span>
              <button
                onClick={() => setSlide((s) => 1 - s)}
                aria-label="Cambiar imagen"
              >
                {slide + 1} / 2
              </button>
            </div>
          </aside>
        </div>
        <section
          id="catalogo"
          className="catalog"
          aria-labelledby="catalog-title"
        >
          <div className="section-top">
            <Reveal>
              <h2 id="catalog-title">Encontrá tu próximo favorito.</h2>
            </Reveal>
            <div className="currency" role="group" aria-label="Moneda">
              {["UYU", "BRL"].map((c) => (
                <button
                  key={c}
                  aria-pressed={currency === c}
                  onClick={() => setCurrency(c)}
                >
                  {c === "UYU" ? "$ UYU" : "R$ BRL"}
                </button>
              ))}
            </div>
          </div>
          <Reveal>
            <p className="catalog-description">
              Para disfrutar todos los días, en cada rincón de casa.
            </p>
          </Reveal>
          {isDemo && (
            <p className="demo-note">
              Catálogo de demostración · Productos, fotos y precios de ejemplo.
            </p>
          )}
          <div className="catalog-ui">
            <div className="catalog-tools">
              <div className="filters" role="group" aria-label="Categorías">
                <button
                  aria-pressed={!category}
                  onClick={() => setCategory("")}
                >
                  Todo
                </button>
                {data.categories.map((c) => (
                  <button
                    key={c.id}
                    aria-pressed={category === c.id}
                    onClick={() => setCategory(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <label className="search">
                <Icon name="search" />
                <input
                  aria-label="Buscar productos"
                  placeholder="Buscá algo lindo…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="results-bar">
              <span aria-live="polite">
                {loading
                  ? "Cargando catálogo…"
                  : `${products.length} productos`}
              </span>
              <label>
                Ordenar{" "}
                <select
                  aria-label="Ordenar productos"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="default">Recomendados</option>
                  <option value="low">Menor precio</option>
                  <option value="high">Mayor precio</option>
                </select>
              </label>
            </div>
            {error ? (
              <div className="empty" role="alert">
                <p>{error}</p>
                <button onClick={refresh}>Reintentar</button>
              </div>
            ) : !loading && !products.length ? (
              <div className="empty">
                <h3>
                  {query
                    ? "No encontramos ese producto."
                    : "Pronto habrá más por acá."}
                </h3>
                <p>
                  {query
                    ? "Probá con otra palabra o categoría."
                    : "Podés consultar a Jessica por WhatsApp."}
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("");
                  }}
                >
                  Ver todo
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.06}>
                    <article className="product-card">
                      <button
                        className="product-image"
                        onClick={() => setProduct(p)}
                        aria-label={`Ver ${p.name}`}
                      >
                        <img
                          src={p.images?.[0] || img("room")}
                          alt={p.name}
                          width="600"
                          height="700"
                          loading="lazy"
                        />
                        <span>Ver detalles</span>
                      </button>
                      <div className="product-caption">
                        <div>
                          <h3>
                            <button onClick={() => setProduct(p)}>
                              {p.name}
                            </button>
                          </h3>
                          <p className="product-category">
                            {
                              data.categories.find(
                                (c) => c.id === p.category_id,
                              )?.name
                            }
                          </p>
                          <p className="price">
                            {money(
                              p[currency === "BRL" ? "price_brl" : "price_uyu"],
                              currency,
                            )}{" "}
                            <small>{currency}</small>
                          </p>
                        </div>
                        <button
                          className="add-button"
                          aria-label={`${selected.includes(p.id) ? "Quitar" : "Agregar"} ${p.name}`}
                          aria-pressed={selected.includes(p.id)}
                          onClick={() => toggle(p)}
                        >
                          {selected.includes(p.id) ? "−" : "+"}
                        </button>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
        <section
          id="contacto"
          className="contact"
          aria-labelledby="contact-title"
        >
          <Reveal>
            <h2 id="contact-title">
              Lo charlamos
              <br />
              con Jessica.
            </h2>
          </Reveal>
          <Reveal>
            <p>
              ¿Encontraste algo para tu casa? Escribime y coordinamos tu pedido,
              el pago y la entrega.
            </p>
            <a
              href={contact}
              target="_blank"
              rel="noreferrer"
              className="button"
            >
              Hablemos por WhatsApp <Icon name="arrow" />
            </a>
          </Reveal>
          <Reveal>
            <div className="contact-place">
              <span>Rivera, Uruguay</span>
              <a href={contact}>098 360 204</a>
              <span>Atención personal</span>
            </div>
          </Reveal>
        </section>
      </main>
      <footer>
        <a className="footer-brand" href="#">
          jessyhome.
        </a>
        <div className="footer-bottom">
          <span>Un poquito más de hogar.</span>
          <button onClick={() => setCredits(true)}>Créditos de imágenes</button>
          <a href="#admin">Administrar</a>
        </div>
      </footer>
      {product && (
        <ProductModal
          p={product}
          currency={currency}
          selected={selected.includes(product.id)}
          onToggle={() => toggle(product)}
          onClose={() => setProduct(null)}
        />
      )}
      {basket && (
        <Modal
          title="Tu selección"
          onClose={() => setBasket(false)}
          className="basket"
        >
          <p>
            Jessica te confirma disponibilidad, pago y entrega por WhatsApp.
          </p>
          {chosen.length ? (
            <>
              <div className="basket-list">
                {chosen.map((p) => (
                  <div className="basket-row" key={p.id}>
                    <img
                      src={p.images?.[0] || img("room")}
                      alt=""
                      width="64"
                      height="72"
                    />
                    <div>
                      <strong>{p.name}</strong>
                      <p>
                        {money(
                          p[currency === "BRL" ? "price_brl" : "price_uyu"],
                          currency,
                        )}{" "}
                        {currency}
                      </p>
                    </div>
                    <button
                      onClick={() => toggle(p)}
                      aria-label={`Quitar ${p.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="total">
                <span>Total de referencia</span>
                <strong>
                  {money(
                    chosen.reduce(
                      (a, p) =>
                        a +
                        Number(
                          p[currency === "BRL" ? "price_brl" : "price_uyu"],
                        ),
                      0,
                    ),
                    currency,
                  )}{" "}
                  {currency}
                </strong>
              </div>
              <a
                className="button full"
                href={whatsappUrl(chosen, currency, isDemo)}
                target="_blank"
                rel="noreferrer"
              >
                Consultar por WhatsApp <Icon name="arrow" />
              </a>
              {isDemo && (
                <p className="small">
                  La consulta indicará que son productos de demostración.
                </p>
              )}
            </>
          ) : (
            <div className="empty">
              <p>Todavía no elegiste tus favoritos.</p>
              <button
                className="button"
                onClick={() => {
                  setBasket(false);
                  location.hash = "catalogo";
                }}
              >
                Explorar catálogo
              </button>
            </div>
          )}
        </Modal>
      )}
      {credits && (
        <Modal title="Créditos" onClose={() => setCredits(false)}>
          <p>Fotografías de demostración bajo la licencia Unsplash.</p>
          <ul className="credits-list">
            {imageCredits.map(([title, author, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {title}
                </a>{" "}
                · {author}
              </li>
            ))}
          </ul>
          <p>
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noreferrer"
            >
              Licencia Unsplash
            </a>
          </p>
          <p>
            Animación Animated Content de{" "}
            <a
              href="https://reactbits.dev/animations/animated-content"
              target="_blank"
              rel="noreferrer"
            >
              React Bits
            </a>
            , David Haz, MIT + Commons Clause.
          </p>
        </Modal>
      )}
    </>
  );
}
function ProductModal({ p, currency, selected, onToggle, onClose }) {
  const [photo, setPhoto] = useState(0);
  return (
    <Modal title={p.name} onClose={onClose} className="product-dialog">
      <div className="product-detail">
        <div>
          <img
            className="detail-photo"
            src={p.images?.[photo] || img("room")}
            alt={p.name}
          />
          {p.images?.length > 1 && (
            <div className="thumbnails">
              {p.images.map((src, i) => (
                <button
                  key={src}
                  aria-label={`Foto ${i + 1}`}
                  aria-pressed={photo === i}
                  onClick={() => setPhoto(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p>{p.description}</p>
          <p className="detail-price">
            {money(p[currency === "BRL" ? "price_brl" : "price_uyu"], currency)}{" "}
            {currency}
          </p>
          <p className="small">
            {money(
              p[currency === "BRL" ? "price_uyu" : "price_brl"],
              currency === "BRL" ? "UYU" : "BRL",
            )}{" "}
            {currency === "BRL" ? "UYU" : "BRL"}
          </p>
          <button className="button full" onClick={onToggle}>
            {selected ? "Quitar de mi selección" : "Agregar a mi selección"}
          </button>
          <a
            className="direct-link"
            target="_blank"
            rel="noreferrer"
            href={whatsappUrl([p], currency, isDemo)}
          >
            Consultar este producto
          </a>
          {isDemo && <p className="small">Producto de demostración.</p>}
        </div>
      </div>
    </Modal>
  );
}

function Admin() {
  const [session, setSession] = useState(null),
    [authReady, setAuthReady] = useState(isDemo),
    [allowed, setAllowed] = useState(isDemo),
    [data, setData] = useState({ products: [], categories: [] }),
    [tab, setTab] = useState("products"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [editor, setEditor] = useState(null),
    [categoryEdit, setCategoryEdit] = useState(null),
    [remove, setRemove] = useState(null),
    [query, setQuery] = useState("");
  useEffect(() => {
    if (!db) {
      setAuthReady(true);
      return;
    }
    db.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (isDemo) {
      refresh();
      return;
    }
    if (!session) {
      setAllowed(false);
      return;
    }
    let live = true;
    db.rpc("is_admin").then(({ data, error }) => {
      if (!live) return;
      setAllowed(data === true);
      if (error || !data)
        setError("Esta cuenta no tiene permiso para administrar JessyHome.");
      else refresh();
    });
    return () => {
      live = false;
    };
  }, [session]);
  async function refresh() {
    try {
      setData(await loadCatalog(true));
    } catch (e) {
      setError(e.message);
    }
  }
  async function run(fn, message) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      await refresh();
      setNotice(message);
      return true;
    } catch (e) {
      setError(e.message || "No se pudo guardar. Intentá nuevamente.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function login(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await db.auth.signInWithPassword({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (error) setError("No se pudo ingresar. Revisá tu correo y contraseña.");
    setBusy(false);
  }
  if (!authReady)
    return (
      <main className="login">
        <p>Cargando acceso…</p>
      </main>
    );
  if (!isDemo && !session)
    return (
      <main className="login">
        <a className="wordmark" href="#">
          jessyhome.
        </a>
        <h1>Tu catálogo, a mano.</h1>
        <p>Ingresá para administrar productos y categorías.</p>
        {error && <p role="alert">{error}</p>}
        {db ? (
          <form onSubmit={login}>
            <label>
              Correo electrónico
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            </label>
            <label>
              Contraseña
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <button className="button" disabled={busy}>
              {busy ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        ) : (
          <p>Completá la configuración de Supabase para habilitar el acceso.</p>
        )}
        <a href="#">Volver al catálogo</a>
      </main>
    );
  return (
    <div className="admin">
      <header className="admin-top">
        <a href="#" className="wordmark">
          jessyhome.
        </a>
        <span>Administración</span>
        <a href="#">Ver catálogo</a>
        {session && (
          <button
            onClick={async () => {
              await db.auth.signOut();
            }}
          >
            Salir
          </button>
        )}
      </header>
      <div className="admin-shell">
        <aside className="admin-nav">
          <p>Tu tienda</p>
          <button
            aria-pressed={tab === "products"}
            onClick={() => setTab("products")}
          >
            Productos
          </button>
          <button
            aria-pressed={tab === "categories"}
            onClick={() => setTab("categories")}
          >
            Categorías
          </button>
          <p className="small">Jessica · Rivera</p>
        </aside>
        <main className="admin-main">
          <div className="admin-title">
            <div>
              <h1>{tab === "products" ? "Productos" : "Categorías"}</h1>
              <p>
                {tab === "products"
                  ? "Las cosas lindas que compartís con tus clientes."
                  : "Ordená tu catálogo a tu manera."}
              </p>
            </div>
            {allowed && (
              <button
                className="button"
                onClick={() =>
                  tab === "products"
                    ? setEditor({
                        name: "",
                        description: "",
                        category_id: data.categories[0]?.id || "",
                        price_uyu: "",
                        price_brl: "",
                        in_stock: true,
                        images: [],
                      })
                    : setCategoryEdit({ name: "" })
                }
              >
                {tab === "products" ? "Agregar producto" : "Crear categoría"}
              </button>
            )}
          </div>
          {isDemo && (
            <p className="demo-note">
              Modo demostración: los cambios se guardan solo en este navegador.
              El acceso real se activa al conectar Supabase.
            </p>
          )}
          {error && (
            <p className="notice" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
          {allowed &&
            (tab === "products" ? (
              <>
                <label className="admin-search">
                  Buscar producto
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nombre del producto"
                  />
                </label>
                <div className="admin-products">
                  {data.products
                    .filter((p) =>
                      p.name.toLowerCase().includes(query.toLowerCase()),
                    )
                    .map((p) => (
                      <div className="admin-row" key={p.id}>
                        <img
                          src={p.images?.[0] || img("room")}
                          alt=""
                          width="56"
                          height="64"
                        />
                        <div className="admin-identity">
                          <strong>{p.name}</strong>
                          <span>
                            {
                              data.categories.find(
                                (c) => c.id === p.category_id,
                              )?.name
                            }
                          </span>
                        </div>
                        <div className="admin-prices">
                          <span>{money(p.price_uyu)} UYU</span>
                          <span>{money(p.price_brl, "BRL")} BRL</span>
                        </div>
                        <div className="admin-actions">
                          <button
                            className={`stock ${p.in_stock ? "available" : ""}`}
                            aria-pressed={p.in_stock}
                            disabled={busy}
                            onClick={() =>
                              run(
                                () =>
                                  saveRecord("products", {
                                    ...p,
                                    in_stock: !p.in_stock,
                                  }),
                                p.in_stock
                                  ? "Producto oculto del catálogo."
                                  : "Producto visible en el catálogo.",
                              )
                            }
                          >
                            {p.in_stock ? "Disponible" : "Agotado"}
                          </button>
                          <button disabled={busy} onClick={() => setEditor(p)}>
                            Editar
                          </button>
                          <button
                            disabled={busy}
                            onClick={() =>
                              setRemove({ table: "products", ...p })
                            }
                            aria-label={`Eliminar ${p.name}`}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {!data.products.length && (
                  <p className="empty">
                    Tu catálogo empieza con el primer producto.
                  </p>
                )}
              </>
            ) : (
              <div className="category-admin">
                {data.categories.map((c) => (
                  <div className="category-row" key={c.id}>
                    <strong>{c.name}</strong>
                    <span>
                      {
                        data.products.filter((p) => p.category_id === c.id)
                          .length
                      }{" "}
                      productos
                    </span>
                    <button onClick={() => setCategoryEdit(c)}>Editar</button>
                    <button
                      onClick={() => setRemove({ table: "categories", ...c })}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </main>
      </div>
      {editor && (
        <ProductEditor
          p={editor}
          categories={data.categories}
          busy={busy}
          error={error}
          onClose={() => {
            setEditor(null);
            setError("");
          }}
          onSave={async (p, files) => {
            const ok = await run(async () => {
              const valid = validateProduct(p);
              const images = [...valid.images, ...(await uploadPhotos(files))];
              if (!images.length) throw new Error("Agregá al menos una foto.");
              await saveRecord("products", { ...valid, images });
            }, "Producto guardado.");
            if (ok) setEditor(null);
          }}
        />
      )}
      {categoryEdit && (
        <Modal
          title={categoryEdit.id ? "Editar categoría" : "Crear categoría"}
          onClose={() => {
            if (!busy) setCategoryEdit(null);
          }}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await run(
                () =>
                  saveRecord("categories", {
                    ...categoryEdit,
                    name: categoryEdit.name.trim(),
                  }),
                "Categoría guardada.",
              );
              if (ok) setCategoryEdit(null);
            }}
          >
            <label>
              Nombre
              <input
                required
                maxLength="60"
                value={categoryEdit.name}
                onChange={(e) =>
                  setCategoryEdit({ ...categoryEdit, name: e.target.value })
                }
              />
            </label>
            {error && <p role="alert">{error}</p>}
            <button
              className="button"
              disabled={busy || !categoryEdit.name.trim()}
            >
              {busy ? "Guardando…" : "Guardar categoría"}
            </button>
          </form>
        </Modal>
      )}
      {remove && (
        <Modal
          title="Eliminar del catálogo"
          onClose={() => {
            if (!busy) setRemove(null);
          }}
        >
          <p>¿Eliminar “{remove.name}”? Esta acción no se puede deshacer.</p>
          {remove.table === "categories" && (
            <p>La categoría debe estar vacía antes de eliminarla.</p>
          )}
          {error && <p role="alert">{error}</p>}
          <button
            className="button"
            disabled={busy}
            onClick={async () => {
              const ok = await run(
                () => removeRecord(remove.table, remove.id),
                "Eliminado correctamente.",
              );
              if (ok) setRemove(null);
            }}
          >
            Eliminar
          </button>
        </Modal>
      )}
    </div>
  );
}
function ProductEditor({ p, categories, busy, error, onClose, onSave }) {
  const [draft, setDraft] = useState({ ...p }),
    [files, setFiles] = useState([]);
  const field = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  return (
    <Modal
      title={p.id ? "Editar producto" : "Nuevo producto"}
      onClose={() => {
        if (!busy) onClose();
      }}
      className="editor-dialog"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(draft, files);
        }}
      >
        <label>
          Nombre
          <input
            required
            maxLength="100"
            value={draft.name}
            onChange={(e) => field("name", e.target.value)}
          />
        </label>
        <label>
          Descripción
          <textarea
            rows="3"
            maxLength="2000"
            value={draft.description}
            onChange={(e) => field("description", e.target.value)}
          />
        </label>
        <label>
          Categoría
          <select
            aria-label="Categoría"
            required
            value={draft.category_id}
            onChange={(e) => field("category_id", e.target.value)}
          >
            <option value="">Elegir categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        {!categories.length && (
          <p>Primero creá una categoría desde el menú Categorías.</p>
        )}
        <div className="form-pair">
          <label>
            Precio en pesos (UYU)
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={draft.price_uyu}
              onChange={(e) => field("price_uyu", e.target.value)}
            />
          </label>
          <label>
            Precio en reales (BRL)
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={draft.price_brl}
              onChange={(e) => field("price_brl", e.target.value)}
            />
          </label>
        </div>
        <label className="check-label">
          <input
            type="checkbox"
            checked={draft.in_stock}
            onChange={(e) => field("in_stock", e.target.checked)}
          />
          Disponible en el catálogo
        </label>
        <p className="small">
          Al desmarcarlo, el producto queda oculto para los clientes.
        </p>
        <label>
          Agregar fotos
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
          />
        </label>
        <p className="small">
          JPG, PNG o WebP, hasta 5 MB por foto. La primera será la portada.
        </p>
        <div className="edit-photos">
          {draft.images.map((src, i) => (
            <div key={`${src}-${i}`}>
              <img src={src} alt={`Foto ${i + 1}`} />
              <button
                type="button"
                onClick={() =>
                  field(
                    "images",
                    draft.images.filter((_s, j) => j !== i),
                  )
                }
              >
                Quitar
              </button>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    field("images", [
                      src,
                      ...draft.images.filter((_s, j) => j !== i),
                    ])
                  }
                >
                  Portada
                </button>
              )}
            </div>
          ))}
        </div>
        {files.length > 0 && <p>{files.length} fotos nuevas seleccionadas.</p>}
        {error && <p role="alert">{error}</p>}
        <button className="button full" disabled={busy}>
          {busy ? "Guardando…" : "Guardar producto"}
        </button>
      </form>
    </Modal>
  );
}
createRoot(document.getElementById("root")).render(<App />);
