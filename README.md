# Nuestro-universo

## El final del agujero negro (rama `despedida-agujero-negro`)

El código original está intacto en `main`. Esta rama solo añade un final
opcional, que se puede encender o apagar en cualquier momento.

### Interruptor (en el código)

En `main.js`, al principio del archivo:

```js
const FINALE_ENABLED = true; // true = final activo, false = universo original
```

- `true`: al pulsar **EXPLORAR**, a los 5 segundos el agujero negro empieza
  a consumir todos los recuerdos (las frases de `main.js`). Cuando ya no
  queda ninguno, aparece la pantalla de despedida a Cristal.
- `false`: el universo funciona exactamente como antes, sin final.

También se puede forzar por URL, sin tocar el código:

- `?final=1` → activa el final
- `?final=0` → desactiva el final y vuelve el universo original

El texto de la despedida se edita en `index.html`, en `#farewell-screen`.
Está firmada como Alberto, el nombre con el que Cristal lo llamaba, e
incluye la frase “Eventualmente todo lo que es para ti termina
encontrándote...”, que marcó el inicio de la relación.

La pantalla final ya no tiene botón de regreso: es un final, no una
pausa. Para volver a ver el universo original hay que poner
`FINALE_ENABLED = false` o abrir la página con `?final=0`. Nada se
borra, los recuerdos solo se esconden durante el final.

### Ver esta rama en Vercel

Vercel crea un despliegue de vista previa (Preview Deployment) por cada
rama que se sube a GitHub, sin tocar la web de producción (`main`).

1. Esta rama ya está en GitHub: `despedida-agujero-negro`.
2. Si el proyecto ya está conectado a Vercel, al subir la rama Vercel
   genera automáticamente una URL de preview. También aparece al crear
   un Pull Request hacia `main`.
3. Si aún no está conectado: en Vercel → **Add New → Project** → importa
   `zelttikDevv/Nuestro-universo` → despliega. Después, cada rama nueva
   tendrá su propia preview.
4. Para verla: Vercel → Project → **Deployments** → busca la fila de la
   rama `despedida-agujero-negro` → **Visit**.

La producción sigue siendo `main` hasta que decidas fusionar esta rama.
