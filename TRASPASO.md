# Traspaso: la versión nueva a la copia de Irene

Irene ya tiene su copia, `930blurberrie/WEB`, que publica `930blurberrie.com`
con GitHub Pages (*legacy*: sirve los ficheros de `main` tal cual), y **la edita
ella** (el último cambio suyo, "nuevo top", el 2026-10-06). Es la versión de
antes: un `data/data.json` con todo y los vídeos en `data/_ANIMATION/`; las
animaciones son todas `animacion.html?v=…`, una sola página para Google.

**Su contenido viene de su copia** (traído el 2026-10-18, hasta `ef675f7`). Lo
que haya cambiado desde entonces hay que traerlo antes.

**Las dos copias publican en GitHub Pages, no en Cloudflare**: hay vídeos de más
de 25 MB (deadcrush, 79 MB), que Workers no publica. La Action corre en las dos
y el build decide por el dueño del repo: en `meowrhino`, github.io sin indexar;
en la de Irene, la raíz con el `url` de `site.json`. El DNS del dominio está en
Cloudflare, apuntando a GitHub: no se toca.

Tiempo: unos 20 minutos, y un rato con ella: **cambia cómo edita** (las
animaciones pasan de `data.json` a una carpeta cada una). Hablarlo antes.

## Antes

- [ ] `main` de meowrhino al día y sin cambios a medias (`git status` limpio).
- [ ] ¿Ha tocado algo Irene desde `ef675f7`?
      `gh api repos/930blurberrie/WEB/commits --jq '.[0:3][] | .sha[0:7]+" "+.commit.message'`.
      Si sí, pasar sus cambios aquí antes: lo general de `data/data.json` a `data/site.json`;
      `animaciones.proyectos` a `projects/<slug>/project.json` (`name`, `colors`) y el orden a
      `lists`; los vídeos de `data/_ANIMATION/_VIDEOS/<slug>.webm` a `projects/<slug>/video.webm`,
      `_MINIATURAS/<slug>_thumbnail.webm` a `thumbnail.webm` y `<slug>.png` a `poster.png`.

## 1. Irene cambia cómo publica su repo

Nosotros solo podemos leer su repo. Ella, o nos da permiso de escribir, o hace el paso 2:

- [ ] En `930blurberrie/WEB`: **Settings → Pages → Source: GitHub Actions**. El dominio
      (`930blurberrie.com`) se queda como está.
- [ ] **Settings → Collaborators**: `meowrhino` con *Write*, para el paso 2.

## 2. La versión nueva a su `main`

Su `main` y el nuestro han ido por separado. Se guarda la de antes en una rama y se sube la
nueva encima:

- [ ] `git push https://github.com/930blurberrie/WEB.git <sha-de-su-main>:refs/heads/antes`
- [ ] `git push --force-with-lease=main:<sha-de-su-main> https://github.com/930blurberrie/WEB.git main`
- [ ] En su repo, pestaña **Actions**: la de `build & deploy` en verde.

## 3. Comprobar en su dominio

- [ ] La home (las miniaturas se mueven; sketchbook, free stuff), una animación
      (`/animacion/bedrotting/`: el vídeo, sus colores), el about y el dress me (con música).
- [ ] `animacion.html?v=amore` sigue funcionando (enlaces viejos).
- [ ] `view-source:` de una animación: su título, el `canonical` con su dominio, y **sin** `noindex`.
- [ ] `/robots.txt` dice `Allow` y `/sitemap.xml` tiene sus direcciones.
- [ ] Compartir una animación por WhatsApp: sale su póster (la og).

## 4. Search Console, con su cuenta de Google

- [ ] Dar de alta el dominio y enviar `sitemap.xml`.

## 5. Irene en su ordenador

Con ella delante, siguiendo [GUIA.md](GUIA.md):

- [ ] **Sincronizar**: la estructura cambia (si tenía cambios sin subir, antes).
- [ ] Live Server: **Go Live** y ve la vista previa.
- [ ] Un cambio pequeño (un color de una animación), Confirmar → Sincronizar, y la bolita verde.

## 6. Al acabar

- [ ] Fila de blurberri en `JAMstack/inventario.md` con las dos direcciones.
