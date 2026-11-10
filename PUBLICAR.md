# Publicar JessyHome

Seguí este orden: Supabase, GitHub, primera carga de productos.

## 1. Supabase

1. Entrá a https://supabase.com/dashboard y creá un proyecto nuevo llamado JessyHome. Guardá la contraseña de la base de datos; no es la contraseña de Jessica.
2. Abrí SQL Editor → New query. Copiá TODO el archivo `supabase/schema.sql` y pulsá Run una sola vez. Crea productos, categorías, permisos y almacenamiento para fotos.
3. Entrá a Authentication → Users → Add user → Create new user. Usá el correo de Jessica y una contraseña para ella. Activá la confirmación automática del correo si aparece la opción.
4. Copiá el UID/UUID de esa usuaria. Volvé a SQL Editor y ejecutá, reemplazando el texto entre comillas:

```sql
insert into public.admin_users (user_id)
values ('PEGAR-UUID-DE-JESSICA')
on conflict (user_id) do nothing;
```

5. En la configuración de Authentication, desactivá **Allow new users to sign up**. Mantené habilitado el acceso por correo y contraseña.
6. En el diálogo **Connect** del proyecto o en Settings → API / API Keys, copiá la **Project URL** y una clave **Publishable** (empieza por `sb_publishable_`). También sirve la antigua clave `anon`. No copies la contraseña de la base, una clave `secret` ni `service_role`.

## 2. GitHub: publicación directa

Los archivos listos para el navegador están en `docs`. No hay que usar workflows ni variables de GitHub Actions.

1. En el repositorio Jessyhome, abrí Settings → Pages.
2. En Source seleccioná **Deploy from a branch**.
3. Elegí la rama **main** y la carpeta **/docs**.
4. Pulsá **Save**. GitHub mostrará la dirección publicada cuando termine.

### Conectar Supabase sin recompilar

En VS Code abrí `docs/config.js` y completá los dos valores entre comillas:

```js
window.JESSYHOME_CONFIG = {
  supabaseUrl: "https://TU-PROYECTO.supabase.co",
  supabaseKey: "TU-CLAVE-PUBLISHABLE"
};
```

Usá la clave pública Publishable o anon, nunca secret ni service_role. Guardá y subí desde la terminal de la carpeta JessyHome:

```powershell
git add docs/config.js
git commit -m "Conectar Supabase"
git push
```

También podés editar `docs/config.js` directamente en GitHub con el botón del lápiz y guardar el commit. En ese caso ejecutá `git pull --ff-only` en VS Code antes de trabajar otra vez. No necesitás reinstalar ni compilar para cambiar estos dos valores.

En Supabase → Authentication → URL Configuration → Site URL, guardá la dirección final mostrada por GitHub Pages.

### Cambios futuros al diseño o código

```powershell
git pull --ff-only
npm run build:pages
git add src public scripts index.html package.json package-lock.json docs
git commit -m "Actualizar JessyHome"
git push
```

`build:pages` compila y prepara `/docs`, conservando la configuración de `docs/config.js`. Para probar Supabase con `npm run dev`, copiá los mismos valores a `public/config.js`.

GitHub utiliza su infraestructura interna de Pages para publicar desde una rama. No hay un workflow propio ni pasos de Actions que configurar o ejecutar.

## 3. Cargar productos

Entrá a la dirección publicada y pulsá **Administrar**, al pie. También podés agregar `#admin` a la URL. Ingresá con el correo y la contraseña de Jessica.

Al conectar Supabase, el catálogo arranca vacío: solo se crean Textiles, Electrodomésticos e Infantil. Los productos de demostración no se copian automáticamente. Jessica puede cargar fotos, nombre, descripción, categoría y ambos precios. Desmarcar Disponible oculta el producto.

Comprobación final: creá un producto, abrí el catálogo en una ventana de incógnito y confirmá que aparezca. Marcalo agotado, recargá la ventana de incógnito y verificá que desaparezca. Confirmá que `#admin` solicite login en esa ventana.

Si aparece “Modo demostración”, los dos valores de `docs/config.js` siguen vacíos. Completalos y subí el archivo. Si solo completás uno, la web mostrará un error de configuración.

Los cambios de productos desde el panel se guardan directamente en Supabase; no requieren Git ni una nueva publicación.

Referencia oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
