# Recursos Web

Plataforma para descubrir recursos útiles de desarrollo web con curación manual, filtros por categorías y etiquetas, y un panel de administración para mantener la calidad del catálogo.

## Stack

- Next.js (App Router)
- TypeScript
- Prisma + PostgreSQL
- NextAuth
- Tailwind CSS v4
- Zod

## Scripts

Usando pnpm:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm admin:create
pnpm admin:delete
pnpm previews:refresh
```

## Variables de Entorno

Variables principales esperadas por el proyecto:

- `DATABASE_URL`
- `DIRECT_URL` (si aplica para Prisma)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (opcional)
- `TURNSTILE_SECRET_KEY` (opcional)

## Módulos Principales

- Catálogo público de recursos con filtros y búsqueda.
- Gestión de categorías, etiquetas y recursos desde el panel admin.
- Recepción de sugerencias de la comunidad con validación y control anti-spam.
- Página "Acerca del proyecto" con narrativa del producto, animaciones de entrada y efectos hover para una experiencia más dinámica.

## Seguridad en Sugerencias

El endpoint público `/api/suggestions` aplica:

- Estado inicial `pendiente` para usuarios no admin.
- Rate limit por IP y correo de contacto.
- Campo honeypot para bots básicos.
- Integración opcional con Cloudflare Turnstile.

Si `TURNSTILE_SECRET_KEY` no está definida, la validación de captcha se omite.

## API Endpoints

Lista de endpoints públicos y métodos HTTP principales expuestos por la app (base: `/api`).

- **/api/auth** — `GET`, `POST`
  - Proveedor NextAuth para autenticación (login/logout, callbacks).

- **/api/resources** — `GET`, `POST`
  - `GET /api/resources` : lista paginada y filtros (search, categoriaId, etiquetaId, destacado, modeloPrecioId, sort, page, limit).
  - `POST /api/resources` : crear recurso (requiere admin autenticado).

- **/api/resources/:id** — `GET`, `PUT`, `DELETE`
  - `GET /api/resources/:id` : obtener recurso por id.
  - `PUT /api/resources/:id` : actualizar recurso (requiere admin).
  - `DELETE /api/resources/:id` : eliminar recurso (requiere admin).

- **/api/categories** — `GET`, `POST`
  - `GET /api/categories` : lista paginada de categorías (query params disponibles).
  - `POST /api/categories` : crear categoría (requiere admin).

- **/api/categories/:id** — `GET`, `PUT`, `DELETE`
  - `GET /api/categories/:id` : obtener categoría por id.
  - `PUT /api/categories/:id` : actualizar categoría (requiere admin).
  - `DELETE /api/categories/:id` : eliminar categoría (requiere admin).

- **/api/tags** — `GET`, `POST`
  - `GET /api/tags` : lista paginada de etiquetas (query params disponibles).
  - `POST /api/tags` : crear etiqueta (requiere admin).

- **/api/tags/:id** — `GET`, `PUT`, `DELETE`
  - `GET /api/tags/:id` : obtener etiqueta por id.
  - `PUT /api/tags/:id` : actualizar etiqueta (requiere admin).
  - `DELETE /api/tags/:id` : eliminar etiqueta (requiere admin).

- **/api/suggestions** — `GET`, `POST`
  - `GET /api/suggestions` : lista paginada de sugerencias (admin view).
  - `POST /api/suggestions` : crear sugerencia pública (rate-limit, honeypot y opcional Turnstile). Si el usuario es admin, crea sugerencia directamente.

- **/api/suggestions/:id** — `GET`, `PUT`, `DELETE`
  - `GET /api/suggestions/:id` : obtener sugerencia por id.
  - `PUT /api/suggestions/:id` : actualizar sugerencia (requiere admin).
  - `DELETE /api/suggestions/:id` : eliminar sugerencia (requiere admin).

- **/api/price-models** — `GET`, `POST`
  - `GET /api/price-models` : lista de modelos de precio.
  - `POST /api/price-models` : crear modelo de precio (requiere admin).

- **/api/suggestion-statuses** — `GET`
  - `GET /api/suggestion-statuses` : lista de estados posibles para sugerencias.

Nota: muchos endpoints de escritura (`POST`, `PUT`, `DELETE`) requieren que el usuario sea admin y autenticado; la verificación se realiza en el servidor con `requireAdmin()` o verificando la sesión de `next-auth`.
