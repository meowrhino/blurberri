// El contenido a la manera del estudio (JAMstack) → el de antes
//
// El contenido vive así: data/site.json (lo general: textos, colores, el about,
// el juego, las galerías; y "lists": las animaciones, en orden) y cada
// animación en projects/<slug>/ (project.json con su nombre y sus colores,
// video.webm, thumbnail.webm y, si lo tiene, poster.png).
//
// El resto del JS sigue trabajando con el data.json de antes; toOld() pasa de
// una forma a otra. La usan el navegador (carga.js) y el build: sin DOM ni disco.

export const slugsOf = (site) => site.lists?.animations?.projects || [];

export function toOld(site, projects) {
  const { $schema, url, lists, animations, ...rest } = site;
  return {
    ...rest,
    animaciones: {
      ...animations,
      proyectos: slugsOf(site).map((slug) => ({ name: projects[slug].name, slug, colors: projects[slug].colors })),
    },
  };
}
