# Despliegue en Cloudflare Pages

Esta aplicación está configurada como un sitio estático para desplegarse en Cloudflare Pages.

## Configuración en Cloudflare Pages

### 1. Variables de Entorno

Configura las siguientes variables de entorno en Cloudflare Pages:

- `PUBLIC_API_URL`: URL de la API externa (ej: `tristateawnings-production.up.railway.app`)
- `PUBLIC_API_KEY`: API key para autenticación (ej: `landing_token`)

**Nota**: Las variables deben tener el prefijo `PUBLIC_` para que sean accesibles desde el cliente.

### 2. Configuración del Build

En Cloudflare Pages, configura:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: `22` (o la versión que uses)

### 3. Comandos de Build

```bash
npm install
npm run build
```

El sitio estático se generará en la carpeta `dist/`.

## Estructura del Proyecto

- `src/pages/`: Páginas de Astro
- `src/components/`: Componentes reutilizables
- `dist/`: Output del build (no incluir en git)

## Notas Importantes

- El formulario de contacto ahora hace la llamada directamente desde el cliente a la API externa
- No se requiere servidor Node.js
- Todas las páginas se generan como HTML estático
- Las variables de entorno `PUBLIC_*` están disponibles en el cliente

