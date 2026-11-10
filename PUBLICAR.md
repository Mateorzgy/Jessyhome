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

## 2. GitHub

1. Creá un repositorio público llamado `jessyhome`. Para GitHub Pages gratuito, usá un repositorio público.
2. Subí todo el contenido de la carpeta preparada **PARA-SUBIR-A-GITHUB** a la raíz del repositorio. No subas el ZIP como un único archivo. `package.json`, `index.html`, `src`, `public` y `.github` deben quedar directamente en la raíz.
3. Verificá que exista `.github/workflows/pages.yml` en GitHub. Si el cargador omitió esa carpeta, usá Add file → Create new file, escribí esa ruta y pegá el contenido del archivo local.
4. Abrí Settings → Secrets and variables → Actions → pestaña **Variables** → New repository variable. Creá estas dos variables:

| Nombre exacto | Valor |
|---|---|
| VITE_SUPABASE_URL | Project URL de Supabase |
| VITE_SUPABASE_ANON_KEY | Clave Publishable o anon de Supabase |

Aunque el segundo nombre diga ANON, acepta una clave Publishable. Son valores públicos del frontend; los permisos de escritura los protege Supabase mediante RLS.

5. En Settings → Pages → Build and deployment → Source, seleccioná **GitHub Actions**.
6. En Actions → **Publicar JessyHome** → Run workflow, elegí `main` y ejecutalo. Si el primer workflow se disparó al subir archivos y falló antes de configurar Pages, volvé a ejecutarlo ahora.
7. Cuando termine en verde, Settings → Pages mostrará la dirección, normalmente `https://TU-USUARIO.github.io/jessyhome/`.
8. En Supabase → Authentication → URL Configuration → Site URL, guardá esa dirección completa.

## 3. Cargar productos

Entrá a la dirección publicada y pulsá **Administrar**, al pie. También podés agregar `#admin` a la URL. Ingresá con el correo y la contraseña de Jessica.

Al conectar Supabase, el catálogo arranca vacío: solo se crean Textiles, Electrodomésticos e Infantil. Los productos de demostración no se copian automáticamente. Jessica puede cargar fotos, nombre, descripción, categoría y ambos precios. Desmarcar Disponible oculta el producto.

Comprobación final: creá un producto, abrí el catálogo en una ventana de incógnito y confirmá que aparezca. Marcalo agotado, recargá la ventana de incógnito y verificá que desaparezca. Confirmá que `#admin` solicite login en esa ventana.

Si aparece “Modo demostración” en la web publicada, faltan las dos variables al compilar: revisá sus nombres y volvé a ejecutar el workflow. Cada cambio de estas variables requiere una nueva publicación; cambiar productos desde el panel no requiere publicar de nuevo.

No hace falta crear `.env.local` para publicar con este workflow: ese archivo es únicamente para probar Supabase en tu computadora.

Referencias oficiales: https://supabase.com/docs/guides/getting-started/api-keys y https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
