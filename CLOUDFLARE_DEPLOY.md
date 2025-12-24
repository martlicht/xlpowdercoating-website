# Despliegue en Cloudflare Pages

Esta aplicación está configurada como un sitio estático para desplegarse en Cloudflare Pages.

## Configuración en Cloudflare Pages

### 1. Variables de Entorno

Configura las siguientes variables de entorno en Cloudflare Pages:

#### Pasos para configurar variables de entorno:

1. Ve a tu proyecto en Cloudflare Pages Dashboard
2. Navega a **Settings** → **Environment variables**
3. Haz clic en **Add variable** para cada una:

   **Variable 1:**
   - **Name**: `PUBLIC_API_URL`
   - **Value**: Tu URL de API (ej: `tristateawnings-production.up.railway.app` o `https://tristateawnings-production.up.railway.app`)
   - **Environments**: Selecciona Production (y Preview/Development si lo deseas)
   - Haz clic en **Save**

   **Variable 2:**
   - **Name**: `PUBLIC_API_KEY`
   - **Value**: Tu API key (ej: `landing_token`)
   - **Environments**: Selecciona Production (y Preview/Development si lo deseas)
   - Haz clic en **Save**

4. **Importante**: Después de agregar o modificar variables, necesitas hacer un nuevo deploy para que los cambios surtan efecto.

**Nota**: Las variables deben tener el prefijo `PUBLIC_` para que sean accesibles desde el cliente en Astro.

### 2. Configuración del Build

En Cloudflare Pages, configura:

- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: `22` (o la versión que uses)
- **Deploy command**: (dejar vacío o no configurar - Cloudflare Pages detectará automáticamente el sitio estático)

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

