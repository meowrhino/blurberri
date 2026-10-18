# blurberrie930

La web de Irene Búrdalo: ilustración y animación. Hecha por
[meowrhino.studio](https://meowrhino.studio) con la receta del estudio
([meowrhino/JAMstack](https://github.com/meowrhino/JAMstack)). Para Irene:
[GUIA.md](GUIA.md). Traspaso: [TRASPASO.md](TRASPASO.md). Si el build falla:
[CLAUDE.md](CLAUDE.md).

```
blurberri/
├── data/site.json          # todo lo general (textos, colores, about, dress me, sketchbook…);
│                           #   "lists": qué animaciones salen en la home y en qué orden
├── data/                   # también las imágenes: _ABOUT, _SKETCHBOOK, _FREESTUFF, _BAZAR, _LOGO, games
├── projects/<slug>/        # una animación: project.json (name, colors) + video.webm,
│                           #   thumbnail.webm y poster.png (opcional)
├── schema/                 # qué campos lleva cada JSON (VS Code, el build y la vista previa)
├── index.html, about.html, dressme.html, animacion.html, 404.html   # las páginas (plantillas del build)
├── build/build.mjs         # → dist/: la web tal cual se publica
├── js/carga.js             # lee los JSON (js/house.js los pasa a la forma de antes), CASA para el resto
├── js/house.js             # la forma de la casa → la del data.json de antes (la usan carga.js y el build)
├── js/validar.js           # el JSON Schema sin dependencias (de JAMstack)
└── js/                     # nav, main (home), animacion, about, dressup: como antes
```

## Cómo funciona

- **El build** (`npm ci && node build/build.mjs`) escribe la home, el about, el dress me y una
  página por animación, `/animacion/<slug>/`, con su title, canonical y og:image (el póster en
  1200×630 sobre su color de fondo, **sharp**, en `.cache/`). La home lleva, escondidos a la
  vista, los enlaces a todas: lo que leen Google y los lectores de pantalla. También el sitemap y
  el robots. `animacion.html?v=<slug>` sigue funcionando.
- **Vista previa**: Live Server sobre la carpeta. Sin `data-built` en `<html>`, `js/carga.js`
  revisa los JSON con `schema/` y enseña en pantalla lo que pararía el build; las animaciones se
  abren en `animacion.html?v=<slug>`.
- **Publicar**: las dos copias en **GitHub Pages** con la Action (`.github/workflows/deploy.yml`):
  hay vídeos de más de 25 MB, que Cloudflare no publica. En `meowrhino`, github.io sin indexar; en
  la de Irene, su dominio. Si falla, un issue.
