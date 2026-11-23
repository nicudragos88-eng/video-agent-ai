# Video Agent AI — MVP

Interfaz web y backend Node.js para texto a vídeo e imagen a vídeo mediante Replicate.

## Despliegue en Render
1. Sube estos archivos a un repositorio GitHub (incluida la carpeta `public`).
2. En Render crea **New > Web Service**, conecta el repositorio.
3. Runtime **Node**, Build command `npm install`, Start command `npm start`.
4. En **Environment** añade `REPLICATE_API_TOKEN`, `TEXT_VIDEO_MODEL` e `IMAGE_VIDEO_MODEL`.
5. En Replicate elige modelos disponibles y comprueba su documentación: deben aceptar `prompt`, `aspect_ratio` y, para imagen a vídeo, `image`. Los esquemas cambian según el modelo; adapta `server.js` si usan otros campos.
6. Despliega y abre la URL `onrender.com`.

## Notas
- No se incluyen claves ni créditos de generación.
- Es un MVP sin cuentas, cuotas ni base de datos. No lo publiques para terceros sin autenticación, límites de uso y control de costes.
- La subida de imagen está limitada a 8 MB y se transmite como data URI; algunos modelos requieren una URL de imagen en su lugar.
- Los enlaces de resultados pueden expirar; descarga los vídeos que quieras conservar.
