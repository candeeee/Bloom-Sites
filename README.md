# Bloom Sites — web v2

Sitio estático (HTML, CSS y JavaScript sin librerías). Se puede subir tal cual a cualquier hosting.
Para verlo en tu compu, abrí `index.html` en el navegador.

## Estructura

```
index.html              Presentación de Bloom: qué hace, rubros, cómo trabaja, sobre Bloom y contacto
inmobiliarias.html      Una página por rubro, con demostración interactiva
abogados.html
belleza.html            Belleza y bienestar (uñas, pestañas, cejas, peluquerías): turnos con seña
espacios.html           Espacios y reservas (canchas, salones, salas): horarios libres y reserva
gastronomia.html
empresas.html
emprendimientos.html
css/style.css           Todos los estilos (mobile first, con índice al principio)
js/script.js            Todo el comportamiento (con índice al principio)
assets/images/          Imágenes para compartir en redes (og-*.png) y tus fotos
assets/icons/           Íconos del sitio
favicon.ico · site.webmanifest · sitemap.xml · robots.txt
```

## Antes de publicar

### 1. Poner tu dominio real
Todas las direcciones absolutas usan `https://tudominio.com.ar` como marcador (canonical, Open Graph,
Twitter, datos estructurados, sitemap y robots). Reemplazalo en todos los archivos. Desde una terminal,
dentro de la carpeta del proyecto:

```
grep -rl "https://tudominio.com.ar" . | xargs sed -i 's#https://tudominio.com.ar#https://www.TU-DOMINIO.com.ar#g'
```

(En Mac: `sed -i ''` en lugar de `sed -i`.) También podés usar "Buscar y reemplazar en archivos" de tu editor.

### 2. Tu presentación personal
En `index.html`, sección "Sobre Bloom", hay un bloque marcado con instrucciones para poner tu foto,
tu nombre y un texto breve.

### 3. Fotos
Las fotos de las demostraciones ya están cargadas, en WebP, dentro de `assets/images/`. Los nombres
empiezan con el rubro (`inmo-`, `abog-`, `bel-`, `esp-`, `gas-`, `emp-`, `emp2-`). `header.webp` es el fondo
de la portada del index. Para cambiar una, reemplazá el archivo con el mismo nombre o editá el `src` en el HTML.

Para sumar una foto nueva donde todavía hay un bloque de color (`class="ph ..."`), reemplazalo por:

```html
<img class="photo r-43" src="assets/images/mi-foto.webp" alt="Descripción de lo que se ve" width="800" height="600" loading="lazy">
```

Con `r-43` (4:3), `r-11` (cuadrada), `r-45` (4:5), `r-32` (3:2) o `r-169` (16:9) según el lugar. La foto se recorta
sola para llenarlo. Recomendaciones: WebP, ancho máximo 1600 px, `alt` que describa la imagen, `width` y `height`
reales, y `loading="lazy"` en todas las que no estén arriba de todo (en las del celular de la portada, sin `lazy`).

Dónde sigue habiendo bloques de color a propósito:
- `emprendimientos.html`: las otras tres variantes (indumentaria, cosmética y velas) y 4 de los 6 productos de
  la variante de blanquería. Las fotos de cada una se definen en `VARIANTS`, en `js/script.js`.
- `inmobiliarias.html`: la ficha usa la foto de la propiedad elegida, y la tira de miniaturas está oculta
  porque no hay varias fotos por propiedad.

## Configuración

- **WhatsApp:** número y mensaje por defecto en `js/script.js` (`WA_NUMBER` y `DEFAULT_MSG`).
  Cada página de rubro tiene su propio mensaje en el atributo `data-wa-msg` de sus botones.
- **Instagram:** aparece en el encabezado, el pie y el contacto del index (`@bloomsitess`).

## SEO

Cada página tiene title y description propios, canonical, Open Graph, Twitter Card, una sola h1, migas de pan
y datos estructurados Schema.org (Organization y WebSite en el index; WebPage, BreadcrumbList y Service en
cada rubro). `sitemap.xml` lista las 8 páginas.

**SEO local:** no se agregó ninguna ubicación. Cuando quieras apuntar a una zona (por ejemplo Buenos Aires,
CABA o Provincia de Buenos Aires):
1. Sumala al `<title>` y a la `description` de las páginas que corresponda.
2. En el JSON-LD de cada rubro, cambiá `"areaServed"` por una lista, por ejemplo:
   `[{"@type":"City","name":"Buenos Aires"},{"@type":"Country","name":"Argentina"}]`
3. Si más adelante tenés una dirección física, se puede agregar un bloque `LocalBusiness`.

Después de publicar, conviene cargar el sitemap en Google Search Console.

## Editar las demostraciones

- Los textos de cada demo están en el HTML de cada página, dentro de `<div class="dm">`.
- La lista "Qué podría tener tu web" usa `data-key` en cada botón y `data-part` en la parte de la demo
  que se ilumina. Si agregás una parte nueva, usá la misma palabra en los dos.
- Los productos de `emprendimientos.html` (y sus cuatro variantes) están en `js/script.js`, en `VARIANTS`.
- Los turnos de `belleza.html` y las reservas de `espacios.html` usan los mismos grupos de botones (`#dm-service`, `#dm-pro`, `#dm-days`, `#dm-slots`). En `espacios.html`, cada espacio tiene en `data-busy` los horarios ocupados, separados por coma. El porcentaje de seña está en `data-senia` del botón de reservar.
- Los botones de las demos no envían nada: muestran un aviso explicando qué harían en una web real.
- Todas las demos están rotuladas como concepto. Los negocios son inventados; si cambiás nombres,
  mantené el aviso "No es un cliente real".

## Accesibilidad y rendimiento

Navegación por teclado, estados de foco visibles, menú mobile con `aria-expanded` y cierre con Escape,
pestañas con flechas, textos alternativos y respeto por `prefers-reduced-motion`.
Sin frameworks ni librerías: un CSS y un JS. La única carga externa son las tipografías de Google Fonts
(Newsreader y Manrope).
