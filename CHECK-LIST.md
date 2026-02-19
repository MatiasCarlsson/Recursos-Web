# Proyecto: Web de Recursos para Programadores

Stack: Next.js + Tailwind + Supabase + Vercel  
Duración: 8 días  
Objetivo: MVP funcional, profesional y escalable

---

# ✅ DÍA 1 – Fundamentos de Next.js

## 🎯 Objetivo

Entender qué es Next.js y crear el proyecto base funcionando.

## 📌 Tareas

- [ ] Instalar Node.js (si no está instalado)
- [ ] Crear proyecto con:
      `bash
    npx create-next-app@latest
    `
- [ ] Elegir:
  - [ ] App Router
  - [ ] TypeScript (recomendado)
  - [ ] ESLint
  - [ ] Tailwind CSS
- [ ] Ejecutar proyecto con:
      `bash
    npm run dev
    `
- [ ] Entender estructura de carpetas:
  - [ ] `app/`
  - [ ] `layout.tsx`
  - [ ] `page.tsx`
- [ ] Modificar texto del home
- [ ] Crear una segunda ruta `/about`

## ✔ Cómo saber que está completo

- El proyecto corre en localhost
- Puedes navegar entre páginas
- Entiendes cómo se crean rutas

---

# ✅ DÍA 2 – Diseño Base (UI General)

## 🎯 Objetivo

Crear estructura visual básica del sitio.

## 📌 Tareas

### Layout

- [ ] Crear Header simple
- [ ] Crear Footer simple
- [ ] Agregar mensaje personal sutil
- [ ] Definir contenedor principal

### Estilos

- [ ] Configurar tipografía
- [ ] Definir colores principales
- [ ] Crear clase reutilizable para cards
- [ ] Crear botón base reutilizable

### Home

- [ ] Crear sección Hero
- [ ] Crear sección “Explorar recursos”
- [ ] Crear grid vacío para recursos

## ✔ Cómo saber que está completo

- La web tiene estructura visual clara
- No parece una plantilla vacía
- Es responsive en móvil

---

# ✅ DÍA 3 – Modelo de Datos y Supabase

## 🎯 Objetivo

Configurar base de datos y conexión.

## 📌 Tareas

### Supabase

- [ ] Crear cuenta
- [ ] Crear nuevo proyecto
- [ ] Obtener URL y API Key

### Base de datos

- [ ] Crear tabla `resources`
- [ ] Agregar columnas:
  - [ ] id (uuid)
  - [ ] title (text)
  - [ ] description (text)
  - [ ] url (text)
  - [ ] category (text)
  - [ ] tags (text[])
  - [ ] is_free (boolean)
  - [ ] language (text)
  - [ ] created_at (timestamp)

### Indexación

- [ ] Agregar índice en:
  - [ ] category
  - [ ] language
  - [ ] is_free

### Integración

- [ ] Instalar supabase-js
- [ ] Crear archivo `lib/supabase.ts`
- [ ] Hacer primer fetch de prueba

## ✔ Cómo saber que está completo

- Puedes traer datos desde la base
- Ves logs en consola con resultados

---

# ✅ DÍA 4 – Mostrar Recursos

## 🎯 Objetivo

Renderizar recursos reales desde la DB.

## 📌 Tareas

- [ ] Crear componente `ResourceCard`
- [ ] Mostrar:
  - [ ] Título
  - [ ] Descripción
  - [ ] Categoría
  - [ ] Tags
  - [ ] Link externo
- [ ] Hacer fetch en página principal
- [ ] Renderizar lista dinámica
- [ ] Agregar fallback si no hay recursos

## ✔ Cómo saber que está completo

- Los recursos se muestran dinámicamente
- Si agregas uno en Supabase, aparece

---

# ✅ DÍA 5 – Filtros y Búsqueda

## 🎯 Objetivo

Agregar funcionalidad real.

## 📌 Tareas

### Filtros

- [ ] Crear select de categoría
- [ ] Crear filtro por idioma
- [ ] Crear toggle “Solo gratis”
- [ ] Conectar filtros con query a Supabase
- [ ] Probar combinación de filtros

### Búsqueda

- [ ] Crear input de búsqueda
- [ ] Filtrar por título o descripción
- [ ] Optimizar consulta (ilike)
- [ ] Manejar estado de carga

### UX

- [ ] Mostrar “Cargando…”
- [ ] Mostrar “No se encontraron resultados”

## ✔ Cómo saber que está completo

- Cambiar filtros actualiza resultados
- Búsqueda devuelve coincidencias reales

---

# ✅ DÍA 6 – Sistema de Sugerencias

## 🎯 Objetivo

Permitir que usuarios sugieran recursos.

## 📌 Tareas

- [ ] Crear tabla `suggestions`
- [ ] Campos:
  - [ ] title
  - [ ] url
  - [ ] description
  - [ ] category
  - [ ] created_at
- [ ] Crear página `/suggest`
- [ ] Crear formulario
- [ ] Validar campos obligatorios
- [ ] Insertar datos en Supabase
- [ ] Mostrar mensaje de éxito

## ✔ Cómo saber que está completo

- El formulario guarda sugerencias
- Se ven en Supabase

---

# ✅ DÍA 7 – Optimización y Escalabilidad

## 🎯 Objetivo

Preparar proyecto para crecer.

## 📌 Tareas

### Rendimiento

- [ ] Implementar paginación (limit + offset)
- [ ] No traer todos los registros
- [ ] Usar loading states
- [ ] Revisar que no haya console.logs innecesarios

### SEO

- [ ] Agregar metadata
- [ ] Agregar título dinámico
- [ ] Agregar descripción
- [ ] Crear favicon

### Escalabilidad futura

- [ ] Separar lógica de fetch en funciones
- [ ] Crear carpeta `services`
- [ ] Preparar estructura para futuras features

## ✔ Cómo saber que está completo

- Lighthouse > 85 en Performance
- Paginación funciona
- Código organizado

---

# ✅ DÍA 8 – Deploy y Presentación

## 🎯 Objetivo

Publicar y dejar listo para mostrar.

## 📌 Tareas

### Deploy

- [ ] Crear cuenta en Vercel
- [ ] Subir proyecto a GitHub
- [ ] Conectar repo a Vercel
- [ ] Configurar variables de entorno
- [ ] Deploy exitoso

### Revisión final

- [ ] Probar en móvil
- [ ] Probar en desktop
- [ ] Probar filtros
- [ ] Probar sugerencias
- [ ] Revisar links rotos

### Profesionalismo

- [ ] Footer con mensaje personal sutil
- [ ] Link a GitHub (opcional)
- [ ] Ajustar pequeños detalles visuales

## ✔ Cómo saber que está completo

- La web está online
- Se puede compartir link
- Funciona sin errores
- Es usable y clara

---

# 🧠 Post-MVP (Futuro Escalable)

- [ ] Autenticación
- [ ] Panel admin
- [ ] Moderación de sugerencias
- [ ] Sistema de votos
- [ ] Sistema de favoritos
- [ ] Roadmaps propios
- [ ] Newsletter
- [ ] Analytics

---

# Estado Final Esperado

✔ Web pública  
✔ Recursos filtrables  
✔ Búsqueda funcional  
✔ Sistema de sugerencias  
✔ Diseño limpio  
✔ Base escalable  
✔ Lista para crecer
