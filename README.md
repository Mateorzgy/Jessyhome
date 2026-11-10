# JessyHome

Catálogo de Jessica en Rivera, Uruguay. React + Vite, animaciones de React Bits, publicación estática en GitHub Pages y administración con Supabase.

## Probar en tu computadora

```powershell
cd C:\Users\mateo\Desktop\Crealia\jessyhome
npm install
npm run dev
```

Abrir la dirección que imprime Vite. El enlace **Administrar** está al pie del catálogo; también se puede entrar a `/#admin`.

Sin variables de Supabase se activa la demostración: seis productos disponibles y uno agotado, categorías editables, fotos y cambios guardados en el navegador. No hay login en la demo. Cada navegador tiene sus propios datos; no se sincronizan ni se migran automáticamente a Supabase. Limpiar el almacenamiento del sitio restablece la demo. Las consultas por WhatsApp indican que son productos de demostración.

## Conectar Supabase

1. Crear un proyecto en Supabase.
2. Ejecutar **una vez** `supabase/schema.sql` en SQL Editor. Crea tablas, permisos y el bucket público `product-images`. No contiene productos de demostración.
3. En Authentication → Users, crear a Jessica con correo y contraseña; confirmar su correo desde el panel al crearla. Deshabilitar los registros públicos en la configuración de Auth: la web no ofrece registro.
4. Copiar el UUID de esa usuaria y ejecutar en SQL Editor:

```sql
insert into public.admin_users(user_id) values ('UUID-REAL-DE-JESSICA');
```

5. Copiar `.env.example` a `.env.local` y completar:

```dotenv
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU-CLAVE-PUBLICA
```

Usar la clave **publishable** o **anon**, nunca `service_role` ni una clave secreta. Las variables `VITE_` se incluyen en el código público: la protección está en las políticas RLS, no en ocultar estas dos variables. Reiniciar Vite después de cambiarlas.

6. Entrar a `/#admin` con la cuenta creada y cargar los productos reales. Los precios UYU y BRL se guardan por separado; no hay conversión automática. Marcar un producto como agotado lo oculta del catálogo y de las lecturas públicas de la base.

Las imágenes son públicas por diseño. Ocultar un producto no revoca una URL de imagen previamente compartida. Eliminar una foto del producto quita su referencia; los archivos antiguos permanecen en Storage para evitar borrados accidentales. Pueden limpiarse desde el panel de Supabase cuando ya no se utilicen.

## Publicar en GitHub Pages

1. Crear un repositorio, por ejemplo `jessyhome`, y subir **el contenido de esta carpeta como raíz del repositorio**, incluido `.github/workflows/pages.yml`. No subir `node_modules`, `.env.local` ni el proyecto Crealia.
2. En Settings → Secrets and variables → Actions → Variables, crear `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los mismos valores públicos.
3. En Settings → Pages, elegir **GitHub Actions** como origen.
4. Subir a la rama `main` o ejecutar el workflow **Publicar JessyHome**. El workflow instala, prueba, compila y publica `dist`.
5. Agregar la URL final en la configuración Site URL de Supabase Auth. El login actual usa correo y contraseña; no depende de redirects.

Los recursos usan rutas relativas y la administración usa un hash: funciona tanto en `usuario.github.io/jessyhome/` como en un dominio propio, sin reglas de servidor ni errores 404 al recargar el panel.

Otra opción es ejecutar `npm run build` y publicar **el contenido de `dist`** desde una rama. Para conectar Supabase en esa modalidad, las variables deben existir al compilar.

## Funciones

- Búsqueda sin distinguir tildes, categorías y orden por precio.
- Cambio entre UYU y BRL; ambas monedas en la ficha.
- Selección de productos y mensaje de WhatsApp a **59898360204**. Abrir el enlace no envía el mensaje automáticamente.
- Modal de producto, múltiples fotos, teclado y movimiento reducido.
- Administración de productos y categorías: crear, editar y eliminar; fotos, portada, precios y disponibilidad.
- No hay cantidades de stock, pagos online, ofertas, banners ni cálculo de envíos.

## Comprobaciones

`npm test` verifica reglas del catálogo y mensajes de WhatsApp. `npm run build` produce el sitio estático.

`verify-ui.mjs` prueba en un navegador real las operaciones de la demo. El script usa Chrome local; está preparado para el entorno donde se creó este proyecto. Los resultados visuales y límites están en `DESIGN.md`.

La integración con un proyecto Supabase real y sus políticas deben comprobarse después de conectarlo: usuario público no puede escribir, usuario no autorizado no puede administrar, Jessica puede editar y los agotados no se leen públicamente. No se afirma que esa prueba remota se haya ejecutado sin un proyecto conectado.

## Antes de lanzar

Sustituir fotos, nombres, descripciones y precios de ejemplo por el inventario real. Los créditos están en `IMAGENES.md` y en el pie de la página. No hay testimonios, reseñas ni cifras de ventas inventadas.

React Bits conserva su licencia en `REACT-BITS-LICENSE.md`. Su componente Animated Content se adaptó para mostrar contenido por defecto y respetar movimiento reducido. RTK y Headroom se revisaron como herramientas de compresión del entorno; no forman parte de la web ni quedaron instaladas/configuradas como proxies. Caveman se usó como guía de comunicación concisa.
