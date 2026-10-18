# Guía de la web

> **Regla de oro: solo se tocan `data/` y `projects/`.** Lo demás es el código.

## Qué hay

```
data/site.json             todo lo general: los textos, los colores de cada página, el about,
                           el dress me, el sketchbook, free stuff, bazar, y qué animaciones
                           salen en la home, en qué orden ("lists")
data/                      también las imágenes de todo eso (_ABOUT, _SKETCHBOOK, _FREESTUFF,
                           _BAZAR, _LOGO, games…)
projects/<nombre>/         una animación, una carpeta:
  project.json               su nombre y sus colores
  video.webm                 el vídeo entero
  thumbnail.webm             la miniatura que se mueve en la home (5-10 s, sin audio)
  poster.png                 opcional: la imagen fija de la miniatura mientras carga,
                             y la que sale al compartir el enlace
```

El **nombre de la carpeta** es también el de la dirección: `projects/bedrotting/` →
`930blurberrie.com/animacion/bedrotting/`. Minúsculas sin acentos, números y guiones. Mejor no
cambiarlo una vez publicado: rompería los enlaces que ya circulan.

## La primera vez: preparar VS Code

Solo se hace una vez.

1. En VS Code: **Archivo → Nueva ventana** y, en la bienvenida, **Clonar repositorio Git…** →
   **Clonar desde GitHub**. Entra con tu cuenta, elige tu repositorio y una carpeta.
2. Al abrirla, VS Code propone instalar **Live Server** (abajo a la derecha): **Instalar**.
3. Abajo a la derecha sale **Go Live**: es la vista previa.

**VS Code te ayuda con los campos**: si pasas el ratón por encima de uno (`"name"`, `"colors"`…)
te dice qué es, y si escribes uno mal o pones algo que no toca, lo subraya en rojo. Para ver
qué campos puedes poner, dentro de las llaves pulsa **Ctrl+Espacio**. Lo sabe por la primera
línea de cada JSON (`"$schema": …`): **no la borres**.

## Añadir una animación, paso a paso

1. **Copia una carpeta** de `projects/` y ponle el nombre nuevo: `projects/amore/` →
   `projects/nueva/`. Borra sus vídeos y deja el `project.json`.
2. **Los vídeos**, en `.webm` (con [videoToWeb](https://meowrhino.github.io/videoToWeb/)), con
   estos nombres: `video.webm` (el entero) y `thumbnail.webm` (la miniatura). Si quieres, también
   `poster.png`.
3. **El nombre y los colores**: abre `project.json` y cámbialos (los campos, abajo).
4. **En la home**: en `data/site.json`, abajo del todo, en `lists` → `animations` → `projects`,
   añade el nombre de la carpeta en el sitio donde quieras que salga.
5. **Go Live** para verlo, y después **Subir los cambios**.

Para **quitar una animación**: bórrala de la lista de `data/site.json`. Si además borras la
carpeta, desaparece del todo.

## Los campos de una animación (`project.json`)

| campo | qué hace |
|---|---|
| `name` | el nombre: en la home, en la página de la animación y en Google |
| `colors.bg` | el fondo de su página: `"#1a1225"` |
| `colors.title` | el título grande de las esquinas |
| `colors.button` | el menú (home, about, dress me, back) |
| `colors.buttonHover` | el menú al pasar el ratón |

Las opacidades del título y del motivo de fondo son las mismas para todas: en `data/site.json`,
`animations` → `opacidadTitulo` y `opacidadMotivo`.

## Lo demás, en `data/site.json`

- **Sketchbook, free stuff, bazar**: las imágenes en su carpeta (`data/_SKETCHBOOK/`…),
  numeradas (`1.webp`, `2.webp`…, con [imgToWeb](https://meowrhino.github.io/imgToWeb/), **en
  Chrome o Firefox**). En `site.json`, `imgCount` dice cuántas hay: con `0` sale "coming soon".
- **About**: la bio en `about` → `bio`, un párrafo por línea de la lista. El texto del pie, en
  `footerText`. El personaje y los ángeles van en `.webm` y, para Safari, también en `.mov`
  (HEVC con transparencia: Media Encoder → MOV → HEVC → *Include Alpha Channel*).
- **Dress me**: una prenda nueva es una imagen más en su carpeta de `data/games/DRESS UP GAME/`
  (`pelo10.png`…) y un número más en el `imgCount` de su categoría (`dressme` → `categorias`).
- **Colores de la home, el about y el dress me**: `home`, `about` y `dressme` → `colors`.
- **Instagram del logo**: `social` → `instagram`.

## Verlo antes de subirlo

**Go Live** abajo a la derecha de VS Code. Se abre la web en el navegador y se refresca sola
cada vez que guardas. Si hay algo que no se publicaría (una coma, un campo mal escrito), sale
en pantalla, y dice dónde.

## Subir los cambios

1. Pestaña **Control de código fuente** (las tres bolitas unidas, a la izquierda).
2. Escribe qué has hecho (`animación nueva: nueva`) y **Confirmar** (*Commit*). Si pregunta si
   quieres añadir todos los cambios: **Sí**.
3. **Sincronizar cambios** (*Sync*).
4. En un par de minutos está en la web. En GitHub, al lado del último cambio sale una bolita:
   amarilla es que se está publicando, verde que ya está, roja que algo no cuadra.

**Antes de empezar a tocar**, dale también a **Sincronizar**, para bajar lo que haya cambiado.

**Los ficheros grandes**: GitHub no acepta ninguno de más de 100 MB. Si un vídeo pasa, hay que
comprimirlo más (videoToWeb) o subirlo a YouTube o Vimeo.

## Si sale en rojo

La web no se rompe: se queda como estaba hasta que se arregla. Pincha la bolita roja, luego
**Details**, y lee el último mensaje, que dice el fichero y qué pasa:

- **"no es un JSON válido, línea 12"** → casi siempre **una coma**: que falta entre dos cosas,
  o que sobra después de la última. O unas comillas sin cerrar.
- **"\"nombre\" no es un campo de aquí (¿mal escrito?). Los que hay: name, colors"** → un
  campo mal escrito: cópialo de la lista que sale en el mensaje.
- **"falta projects/nueva/video.webm"** → el vídeo no se llama así (mayúsculas, la extensión) o
  no se ha subido.
- **"\"lists\" dice \"nueva\", y no hay ningún projects/nueva/project.json"** → el nombre de la
  lista y el de la carpeta no son iguales.
