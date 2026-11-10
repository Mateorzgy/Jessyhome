# JessyHome — decisiones y verificación

## Dirección

The split stage, semilla **86881665**. Tipografías Young Serif y Source Serif 4. Fondo blanco frío con verde profundo; se conservaron las proporciones de Frost and slate y se trasladó el acento a verde para acompañar el hogar y la madera. Una imagen ambiental permanece junto a la introducción y las categorías; el catálogo ocupa después todo el ancho.

Una sustitución de composición: el contacto pasó de Photo strip, three-cell bar a Sentence, portrait, two links. No existen newsletter, reservas ni datos para llenar los campos originales; el negocio conversa por WhatsApp. Se conserva la geometría de tres columnas con título, consulta y datos reales. No hay escenas de scroll fijadas que requieran `scenes.mjs`.

Idea: **la selección personal de Jessica, en una ciudad de dos monedas, se convierte en un catálogo que acompaña la conversación con ella**. El elemento interactivo central es elegir productos, cambiar UYU/BRL y armar una consulta de WhatsApp con esos productos y precios. El gesto visual es una fotografía doméstica que cambia suavemente; React Bits aporta entradas por sección. Se respetan las preferencias de movimiento reducido.

Inventario de datos reales: Jessica; nombre provisional JessyHome; Rivera; Uruguay; cercanía con Brasil; pesos uruguayos; reales brasileños; teléfono 098 360 204; textiles; electrodomésticos; infantil; venta conversada por WhatsApp; envíos coordinados personalmente; stock binario; categorías editables.

Argumento: la introducción identifica el negocio y su persona; las categorías permiten elegir dónde empezar; el catálogo muestra productos y precios; el contacto resuelve cómo comprar. No se agregaron reseñas ni promesas comerciales sin evidencia.

Copy deck: “Tu casa, más tuya.” / “Textiles, electrodomésticos y pequeños detalles para los más chicos. Elegidos por Jessica, en Rivera.” / “Explorar catálogo” / “¿Por dónde empezamos?” / “Encontrá tu próximo favorito.” / “Lo charlamos con Jessica.”

## Administración

Accent ladder, semilla **267169001**, conservando paleta y fuentes. Pregunta principal: ¿qué productos están visibles y qué necesito cambiar? Lista con fotografías propias de cada registro, importes alineados y disponibilidad como señal de color. Las categorías tienen su propia vista. En móvil los controles de cada producto comparten una fila.

## Crítica

ROUND 1
Seen in one second: hogar, catálogo personal, verdes tranquilos.
Idea (one sentence): la selección de Jessica conecta hogar y conversación en dos monedas.
Live thing: selección y consulta de WhatsApp.
Layout words by section: hero=split / categorías=lista / catálogo=productos / contacto=banda / footer=marca.
Scores: design 6.5 · usability 7 · creativity 6.5 · content 5 → overall 6.0.
Caps applied: fallos del primer inspector y una imagen rota.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. desktop-page-01: fotos de café y jarra no correspondían a los productos; reemplazadas por cafetera eléctrica y jarra eléctrica.
2. mobile-page-01: imagen infantil rota; sustituida por bloques de madera con fuente comprobada.
3. tablet admin: el texto Disponible sobresalía de su fondo; acciones agrupadas en una fila flexible.

ROUND 2 (final)
Seen in one second: catálogo de hogar, cálido y legible, con contacto personal.
Idea (one sentence): la selección de Jessica conecta hogar y conversación en dos monedas.
Live thing: catálogo filtrable, monedas independientes y selección para WhatsApp.
Layout words by section: hero=split fotográfico / categorías=lista abierta / catálogo=grilla comercial / contacto=banda / footer=marca grande.
Scores: design 7.5 · usability 8 · creativity 6.5 · content 7 → overall 7.4.
Caps applied: creatividad limitada por una identidad todavía provisional y fotografías de terceros.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. desktop-page-01: las fotos de producto tienen encuadres diferentes; las fotografías reales deberán unificarse al cargar el inventario. El diseño usa proporciones de recorte constantes.
2. mobile-page-01: las fotos ambientales de sábanas y jarra muestran más habitación que objeto; reemplazarlas por fotos cercanas de cada producto real.
3. desktop-fold: la identidad es tipográfica y no tiene un símbolo propio; se conserva el nombre provisional pedido por el usuario, pendiente de identidad definitiva.

Administración final: pregunta principal visible, precios alineados, moneda explícita, estado textual, dos destinos de navegación y acción de alta disponible. Sin gráficos ni cifras ficticias. Los registros de la demo se pueden modificar; se indica que son locales.

## Evidencia final

- `npm test`: 4 pruebas correctas.
- `npm run build`: compilación correcta.
- `verify-ui.mjs`: búsqueda, categorías, UYU/BRL, WhatsApp, CRUD, carga de foto, persistencia demo, stock oculto, restricción de borrar categoría con productos, teclado y anchos del panel. Sin errores de JavaScript.
- `verify-build.mjs`: build servido bajo `/jessyhome/`, recursos e imágenes locales y recarga de `#admin`, correcto.
- Inspector catálogo: **0 FAIL**, 1 WARN en 1440, 768 y 390. Aviso: no hay video. Se mantiene porque no hay video auténtico del negocio; se usa movimiento de imágenes sin añadir material ajeno irrelevante.
- Inspector administración: **0 FAIL, 0 WARN**, mismos tres anchos.
- Lint de fuente: **0 FAIL, 0 WARN**.
- Movimiento: 21 elementos detectados en escritorio; sin escenas de scroll especiales.
- Se abrieron todas las capturas finales de catálogo y administración. Informes en `.taste-skill/final` y `.taste-skill/admin/final`.
- La base de datos, Auth y Storage de un proyecto Supabase real **no se probaron**, porque aún no hay un proyecto conectado. Se entregan SQL, políticas RLS y guía.

Todos los productos, descripciones, precios y fotografías de catálogo son de demostración: juego de cama, cafetera, osito, manta, jarra, bloques de madera y toallas agotadas. Autores, títulos, fuentes y licencias de las ocho fotografías figuran en `IMAGENES.md` y en Créditos de imágenes del pie. No hay dibujos ni clips que sustituir.

## Herramientas solicitadas

Se aplicó design-taste-frontend y se integró Animated Content de React Bits, conservando su licencia. Caveman guió la brevedad de la comunicación. Se revisaron RTK y Headroom: son herramientas de compresión para el entorno del agente, no dependencias del sitio. No se instalaron ni se configuró un proxy para esta sesión; no se atribuyen ahorros de tokens a herramientas que no se ejecutaron.
