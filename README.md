Universidad Nacional
Escuela de Informática
EIF-511 Arquitectura de Información

# Tarea 5: Blog de Noticias con Comentarios (Utterances)

## Estudiante
Irina Rivera Chavarría

---------------------------------------------------------------

## Link del sitio web publicado

[https://noticiascr.netlify.app/blog](https://noticiascr.netlify.app/blog)

## Repositorio de GitHub (Código & Comentarios)

[https://github.com/1rinaa/tarea5-arqui](https://github.com/1rinaa/tarea5-arqui)

---------------------------------------------------------------

### Descripción de la implementación
- Se integró el sistema de comentarios **Utterances** siguiendo las directrices del Tutorial 8 mediante el componente `CommentsUtterances.vue`.
- Se incluye la etiqueta `comments` (`script.setAttribute('label', 'comments')`) para clasificar los comentarios en GitHub Issues.
- Los comentarios se asocian al `pathname` de cada noticia (`issueTerm: 'pathname'`).
- Se utiliza `watch(() => route.path, loadComments)` para reactualizar el hilo de comentarios dinámicamente cuando el lector navega de una noticia a otra.
