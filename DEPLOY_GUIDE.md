# Guía de Despliegue: BoxQuote Pro

## 1. Subir Código a GitHub

El repositorio local ya ha sido inicializado y configurado. Para subir los cambios a tu repositorio remoto, ejecuta el siguiente comando en tu terminal:

```bash
git push -u origin main
```

> **Nota:** Si es la primera vez que subes código desde esta terminal, es posible que te pida tus credenciales de GitHub.

---

## 2. Configurar Backend (Supabase)

BoxQuote Pro está preparado para conectarse con Supabase.

1.  Ve a [supabase.com](https://supabase.com/) e inicia sesión.
2.  Crea un **New Project**.
3.  Una vez creado, ve a **Project Settings** -> **API**.
4.  Copia las siguientes credenciales:
    *   `Project URL`
    *   `anon` / `public` Key

### Configuración Local (Opcional)
Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`) y pega tus credenciales:

```env
VITE_SUPABASE_URL=tu_url_del_proyecto
VITE_SUPABASE_ANON_KEY=tu_clave_anon
```

---

## 3. Despliegue en Vercel (Frontend)

1.  Ve a [vercel.com](https://vercel.com/) e inicia sesión con GitHub.
2.  Haz clic en **Add New...** -> **Project**.
3.  Importa el repositorio `BoxQuotePro`.
4.  Vercel detectará automáticamente que es un proyecto **Vite**. La configuración por defecto es correcta:
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
5.  **Variables de Entorno:**
    Despliega la sección "Environment Variables" y añade las mismas que copiaste de Supabase:
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
6.  Haz clic en **Deploy**.

¡Listo! Tu aplicación estará en línea en unos minutos.
