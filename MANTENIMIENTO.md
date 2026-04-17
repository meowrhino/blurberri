# Cómo mantener blurberrie930

Guía paso a paso para añadir, modificar o borrar contenido de la web sin tocar código.

**Regla de oro:** todo se hace en **`data/data.json`** + archivos dentro de **`data/`**. El código HTML/JS/CSS no hay que tocarlo nunca.

---

## Cómo subir los cambios al sitio real

Todas las modificaciones que hagas en este repo se suben a la web con 3 acciones en GitHub:

### Desde la web de GitHub (lo más fácil)
1. Entra a https://github.com/meowrhino/blurberri
2. Haz click en el archivo que quieres editar (ej. `data/data.json`) → botón lápiz ✏️
3. Edita, y al final de la página pulsa **Commit changes**

### Subir archivos nuevos (vídeos, imágenes)
1. Entra a la carpeta donde va el archivo (ej. `data/_ANIMATION/_VIDEOS/`)
2. Pulsa **Add file → Upload files**
3. Arrastra el archivo y pulsa **Commit changes**

En pocos minutos GitHub Pages refresca la web automáticamente.

> Si usas VS Code o cualquier editor con git: `git add -A && git commit -m "update" && git push`

---

## ANIMACIONES (portfolio)

Cada proyecto necesita **2 archivos de vídeo + 1 entrada en `data.json`**.

### ➕ Añadir un proyecto nuevo

Imagina que el nuevo proyecto se llama **"Mi Proyecto"** y su identificador interno (slug) va a ser **`miproyecto`** (sin espacios, sin tildes, sin mayúsculas).

**1. Sube los 2 vídeos** con estos nombres exactos:
- `data/_ANIMATION/_MINIATURAS/miproyecto_thumbnail.webm` → miniatura cortita que se reproduce en bucle en la home (recomendado: 5-10s, sin audio)
- `data/_ANIMATION/_VIDEOS/miproyecto.webm` → el vídeo completo

**2. Añade el proyecto a `data/data.json`** dentro de `animaciones.proyectos`:
```json
{
  "name": "Mi Proyecto",
  "slug": "miproyecto",
  "colors": {
    "bg": "#1a1225",
    "title": "#c9a0dc",
    "button": "#ccc",
    "buttonHover": "#fff"
  }
}
```
Recuerda poner una coma al final del proyecto anterior.

| Campo | Qué es |
|---|---|
| `name` | Nombre visible en la home y en la página del proyecto |
| `slug` | Identificador interno. **Debe ser idéntico al nombre de los archivos de vídeo.** Solo minúsculas, números y guiones. |
| `colors.bg` | Color de fondo de la página del proyecto |
| `colors.title` | Color del título grande en las esquinas |
| `colors.button` | Color del menú (home, about, dress me, back) |
| `colors.buttonHover` | Color al pasar el ratón o cuando está activo |

Las opacidades del título y del motivo de fondo son compartidas para todos los proyectos — se controlan arriba, en `animaciones.opacidadTitulo` y `animaciones.opacidadMotivo`.

### ✏️ Modificar un proyecto
Abre `data/data.json`, busca el proyecto, cambia los colores o el nombre. Guardar.

### ❌ Borrar un proyecto
1. Borra su objeto del array `animaciones.proyectos` en `data/data.json` (ojo con las comas).
2. Borra los 2 archivos de vídeo de `data/_ANIMATION/_MINIATURAS/` y `data/_ANIMATION/_VIDEOS/`.

### 🎨 Escoger colores
Usa https://colorpicker.me o cualquier extractor de color. El formato es hexadecimal (`#1a1225`) o rgba (`rgba(255,255,255,0.3)`).

---

## SKETCHBOOK

14 dibujos ahora mismo. La galería es scrollable horizontal.

### ➕ Añadir un dibujo
1. Sube la imagen a `data/_SKETCHBOOK/` con nombre numérico: si hay 14, el siguiente es `15.webp`.
2. En `data/data.json`, sube `sketchbook.imgCount` a `15`.

**Formato recomendado:** `.webp` (más ligero que PNG/JPG). Se aceptan también `.jpg` y `.png` si añades la extensión en `sketchbook.extensions`.

### ❌ Borrar un dibujo
1. Para mantener la numeración limpia: renombra los posteriores para rellenar el hueco (si borras el 5, el 6 pasa a ser 5, el 7 a 6, etc.).
2. Baja el número de `imgCount` en `data.json`.

---

## FREE STUFF y BAZAR

Ahora mismo están vacíos y muestran "coming soon". Funcionan igual que el sketchbook.

### ➕ Añadir contenido
1. Sube las imágenes a `data/_FREESTUFF/` (o `data/_BAZAR/`) con nombres `1.webp`, `2.webp`, …
2. En `data/data.json`, pon el `imgCount` al número total.

Con `imgCount: 0` se muestra "coming soon"; con `imgCount > 0` aparece la galería.

---

## ABOUT

### ✏️ Cambiar la bio
Edita el array `about.bio` en `data/data.json`. Cada string es un párrafo:
```json
"bio": [
  "Primer párrafo.",
  "Segundo párrafo.",
  "..."
]
```

### ✏️ Cambiar el vídeo del personaje
1. Sube el nuevo vídeo a `data/_ABOUT/RECURSOS/nombre.webm` (formato WebM con alpha, para Chrome/Firefox).
2. Sube también la versión Safari a `data/_ABOUT/RECURSOS_safari/nombre.mov` (formato MOV HEVC con alpha).
3. Actualiza `about.character` en `data/data.json`:
```json
"character": {
  "src": "data/_ABOUT/RECURSOS/nombre.webm",
  "srcFallback": "data/_ABOUT/RECURSOS_safari/nombre.mov"
}
```

> **Importante:** Safari no soporta WebM con transparencia. El `.mov` HEVC con alpha es obligatorio si el vídeo tiene fondo transparente y quieres que se vea bien en iPhone/Mac/Safari.
>
> Cómo exportar desde After Effects: Media Encoder → MOV → códec HEVC → marcar "Include Alpha Channel".

### ✏️ Cambiar los elementos decorativos (ángeles y llaves flotantes)
Están en `about.decos`. Cada objeto es un set:
- `src` / `srcFallback`: los archivos del vídeo
- `count`: rango aleatorio de cuántos aparecen (ej. `[3, 5]` = entre 3 y 5)
- `sizeRange`: rango de tamaño en píxeles
- `positions`: posiciones posibles (se eligen al azar)

Para añadir un nuevo tipo decorativo: copia uno existente, cambia `src`, `srcFallback`, y ajusta tamaños.

### ✏️ Cambiar el texto del footer (subvención)
Edita `about.footerText` en `data/data.json`.

---

## DRESS ME (juego de vestir)

### ➕ Añadir una nueva prenda
Ejemplo: añadir una 8ª opción de pelo.
1. Sube la imagen a `data/games/DRESS UP GAME/01-PELO/pelo08.png` (transparente, formato PNG).
2. En `data/data.json`, sube `dressme.categorias[0].imgCount` de `7` a `8`.

Las categorías son: `01-PELO`, `02-TOPS`, `03-BOTTOMS`, `04-SHOES`. Cada una tiene su propio `imgCount`.

### ✏️ Cambiar la música
Reemplaza `data/games/DRESS UP GAME/musica.wav` con tu archivo (puede ser .wav, .mp3, .ogg — actualiza el path en `dressme.musica.src` si cambias el formato).

### ✏️ Cambiar las flechas (tamaño, posición, aleatoriedad)
Las flechas izquierda/derecha de cada categoría se generan desde `dressme.flechas`:
- `scaleRandom`: cuánto varía el tamaño al cargar (0 = todas iguales, 0.5 = mucha variación).
- `sets.setXX.size`: altura de cada set de flechas (se admite `clamp()`, `px`, `vh`, …).
- `asignacion`: qué set (grande/decorativo) va a la izquierda y a la derecha de cada categoría.

Si "rompes" el enlace (cambias el nombre del png) la flecha no se pintará.

---

## LOGO e INSTAGRAM

### ✏️ Cambiar el link del logo de la home
Edita `social.instagram` en `data/data.json`:
```json
"social": {
  "instagram": "https://www.instagram.com/tu-usuario/"
}
```

### ✏️ Cambiar el logo
Reemplaza `data/_LOGO/930blurberrie_logo.png`. Mantén el mismo nombre.

---

## SEO

La info SEO global está en `seo` dentro de `data/data.json`:
```json
"seo": {
  "author": "Irene Búrdalo",
  "description": "...",
  "keywords": "...",
  "ogImage": "data/_LOGO/930blurberrie_logo.png"
}
```

Los títulos y descripciones por página (aparecen en Google y redes sociales) están en los `<head>` de los `.html`. Solo hay que tocarlos si se renombra algo significativo.

---

## Textos de UI (opcional)

Puedes traducir los textos de navegación editando `ui` en `data/data.json`:
- `ui.tabs[].label` — portfolio, sketchbook, free stuff, bazar
- `ui.back` — enlace "back" en páginas de detalle
- `ui.comingSoon` — texto "coming soon"
- `ui.nav.home` / `about` / `dressme` — etiquetas del menú top
- `dressme.labels.random` / `download` — botones del juego
- `dressme.musica.playLabel` / `pauseLabel` — botón de música

---

## Colores por página (home, about, dressme)

Cada página tiene su bloque en `data/data.json` (`home`, `about`, `dressme`) con un objeto `colors`:
- `colors.bg` — fondo general
- `colors.container` — fondo del recuadro interior
- `colors.button` — color del menú
- `colors.buttonHover` — color del menú al pasar o activo

---

## ⚠️ Errores comunes

| Síntoma | Causa probable |
|---|---|
| La web no carga nada | Error de sintaxis en `data.json` — una coma de más, una comilla sin cerrar. Usa https://jsonlint.com para validar. |
| Un vídeo no se ve | Nombre de archivo no coincide con `slug`. Recuerda: **minúsculas, sin espacios, sin tildes**. |
| El fallback de Safari no funciona | El `.mov` no tiene alpha. Exporta con HEVC + Alpha. |
| Un dibujo del sketchbook no aparece | La extensión no coincide (debe ser `.webp` a menos que añadas otras en `sketchbook.extensions`). |
| El logo no enlaza a tu Instagram | Falta actualizar `social.instagram` en `data.json`. |
| Los cambios no se ven | El navegador tiene caché. Prueba Ctrl+F5 (Windows) o Cmd+Shift+R (Mac). |

---

## Funcionamiento en distintos entornos

La web está preparada para funcionar en:

1. **Localhost (prueba local en VS Code / Python)**: abre la carpeta con un servidor local y visita `http://localhost:8080`.
2. **GitHub Pages**: `https://meowrhino.github.io/blurberri/` — se publica automáticamente al hacer push.
3. **Dominio propio** (`930blurberrie.com`): se configura en:
   - **Settings → Pages → Custom domain** en GitHub
   - Crear un archivo `CNAME` en la raíz del repo con el contenido `930blurberrie.com`
   - Apuntar los DNS del dominio a GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`)

Todas las rutas son **relativas**, así que funciona igual en los 3 entornos sin tocar código.

---

## Estructura del repo

```
blurberri/
├── index.html          ← Home (thumbnails, sketchbook, free stuff, bazar)
├── about.html          ← About me
├── animacion.html      ← Ficha de cada animación
├── dressme.html        ← Dress me (juego de vestir)
├── robots.txt          ← Indexación buscadores
├── MANTENIMIENTO.md    ← Este archivo
├── css/styles.css      ← Estilos (no tocar)
├── js/                 ← Lógica (no tocar)
├── data/
│   ├── data.json       ← ⭐ El archivo que sí hay que tocar
│   ├── _ANIMATION/     ← Vídeos y miniaturas
│   ├── _SKETCHBOOK/    ← Dibujos numerados
│   ├── _FREESTUFF/     ← (vacío, rellenar cuando esté listo)
│   ├── _BAZAR/         ← (vacío, rellenar cuando esté listo)
│   ├── _ABOUT/         ← Recursos del about
│   ├── _LOGO/          ← Logo
│   ├── favicon/        ← Iconos de pestaña
│   └── games/          ← Recursos del juego
└── referencia/         ← Material de referencia (no se publica)
```

---

## Ante cualquier duda

Guarda copia de `data.json` antes de hacer cambios grandes. Si algo se rompe, restaurando ese archivo vuelve todo a estar OK.
