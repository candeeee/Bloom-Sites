# Bloom Sites — web v2

Sitio estático (HTML, CSS y JavaScript sin librerías). Se puede subir tal cual a cualquier hosting.
Para verlo en tu compu, abrí `index.html` en el navegador.

## Estructura

```
index.html              Presentación de Bloom: qué hace, rubros, cómo trabaja, sobre Bloom y contacto
inmobiliarias.html      Una página por rubro, con demostración interactiva
abogados.html
medicos.html
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
Las imágenes de las maquetas son placeholders hechos con CSS (bloques de color con una etiqueta que dice
qué foto iría). Para poner una foto real, reemplazá el bloque por una imagen:

```html
<!-- antes -->
<div class="ph r-43" style="--ph:#DCE0CF" role="img" aria-label="..." data-label="..."></div>
<!-- después -->
<img src="assets/images/mi-foto.webp" alt="Descripción de lo que se ve" width="800" height="600" loading="lazy">
```

Recomendaciones: formato WebP, ancho máximo 1600 px, `alt` que describa la imagen, `width` y `height`
reales, y `loading="lazy"` en todas las que no estén arriba de todo.

## Configuración

- **WhatsApp:** número y mensaje por defecto en `js/script.js` (`WA_NUMBER` y `DEFAULT_MSG`).
  Cada página de rubro tiene su propio mensaje en el atributo `data-wa-msg` de sus botones.
- **Instagram:** aparece en el encabezado, el pie y el contacto del index (`@bloomsitess`).

## SEO

Cada página tiene title y description propios, canonical, Open Graph, Twitter Card, una sola h1, migas de pan
y datos estructurados Schema.org (Organization y WebSite en el index; WebPage, BreadcrumbList y Service en
cada rubro). `sitemap.xml` lista las 7 páginas.

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
- Los botones de las demos no envían nada: muestran un aviso explicando qué harían en una web real.
- Todas las demos están rotuladas como concepto. Los negocios son inventados; si cambiás nombres,
  mantené el aviso "No es un cliente real".

## Accesibilidad y rendimiento

Navegación por teclado, estados de foco visibles, menú mobile con `aria-expanded` y cierre con Escape,
pestañas con flechas, textos alternativos y respeto por `prefers-reduced-motion`.
Sin frameworks ni librerías: un CSS y un JS. La única carga externa son las tipografías de Google Fonts
(Newsreader y Manrope).
