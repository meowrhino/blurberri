# Videos — Estado actual y plan Safari

## Situacion

Safari moderno (16.4+) soporta WebM normal, pero **NO soporta WebM con canal alpha (transparencia)**. Los videos sin transparencia (animaciones, thumbnails) funcionan bien en Safari. Los **3 videos del About** tienen alpha y se ven como rectangulos negros en Safari.

## Lo que necesita fallback

Solo 3 archivos — todos del About, todos con transparencia:

| Archivo actual | Tamano | Fallback necesario | Tamano estimado |
|---|---|---|---|
| `data/_ABOUT/RECURSOS/character_aboutme.webm` | 4.5 MB | `character_aboutme.mov` (HEVC alpha) | ~6-10 MB |
| `data/_ABOUT/RECURSOS/angel_alphatest.webm` | 1.0 MB | `angel_alphatest.mov` (HEVC alpha) | ~1.5-3 MB |
| `data/_ABOUT/RECURSOS/key.webm` | 1.3 MB | `key.mov` (HEVC alpha) | ~2-4 MB |
| **Total extra** | | | **~10-17 MB** |

El codigo ya esta preparado con dual-source. Cuando los `.mov` esten en la carpeta, Safari los usara automaticamente.

## Videos que NO necesitan fallback

Todos estos funcionan bien en Safari tal cual:

| Video | Pagina | Por que funciona |
|---|---|---|
| 4x `*_thumbnail.webm` | Home | WebM sin alpha, Safari lo soporta |
| 4x `*.webm` (animaciones) | Animacion detail | WebM sin alpha, Safari lo soporta |

## Como exportar los 3 fallbacks

La clienta necesita exportar los 3 videos del About en **HEVC con alpha**:

1. Desde After Effects: Media Encoder > formato MOV > codec HEVC > marcar "Include Alpha Channel"
2. O exportar a ProRes 4444 y usar Apple Compressor para convertir a HEVC alpha
3. Guardar como `.mov` en la misma carpeta (`data/_ABOUT/RECURSOS/`)

Archivos esperados:
- `data/_ABOUT/RECURSOS/character_aboutme.mov`
- `data/_ABOUT/RECURSOS/angel_alphatest.mov`
- `data/_ABOUT/RECURSOS/key.mov`

## Presupuesto de espacio

| Concepto | Tamano |
|---|---|
| Repo actual | ~354 MB |
| Fallbacks necesarios | ~10-17 MB |
| **Repo con fallbacks** | **~364-371 MB** |

No hay problema de espacio. Estamos muy lejos del limite de 1 GB de GitHub.
