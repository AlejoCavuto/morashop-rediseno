# Fútbol del grupo

Diseño: sistema generado con la skill ui-ux-pro-max (Sports Team/Club → Vibrant & Block-based + Dark OLED,
Barlow Condensed + Barlow). Identidad "fútbol 5 de noche": partidos como entradas, marcador sobre pasto,
pecheras de color por equipo, medidor de cobro con un segmento por jugador y podio en el ranking.

App para el grupo de fútbol: jugadores, armado de equipos, resultados, ranking y **control de pagos de la cancha**.
Vive en `/futbol` (HTML/CSS/JS sin librerías) y guarda los datos compartidos con `/api/futbol` (Vercel KV).

## Qué hace

- **Jugadores**: se cargan una vez (se pueden pegar varios nombres juntos). Se pueden desactivar sin perder su historial.
- **Partidos**: fecha, hora, cancha, **monto del alquiler** y jugadores por equipo (7 por defecto, editable en cada partido y en Ajustes).
- **Equipos**: cada jugador va al A, al B o no juega. "Sortear parejo" mezcla según la calificación promedio.
- **Resultado**: marcador, goles, asistencias y calificación (1 a 10) de cada jugador. La mejor calificación es la figura.
- **Ranking**: tabla por puntos (ganado/empatado/perdido configurables), goleadores, asistencias y calificación promedio.
  Cada jugador tiene su historial partido por partido.
- **Pagos**: el alquiler se divide en partes iguales entre los que juegan.
  - El jugador toca "Avisar que pagué": **transferencia** (sube la foto/captura/PDF del comprobante) o **efectivo**.
  - Queda "a confirmar" hasta que **el encargado** lo certifica ("✓ Pagó efectivo" / "✓ Pagó transferencia").
    El encargado también puede marcar un pago directo aunque el jugador no haya avisado, o rechazar un aviso.
  - La pestaña Pagos muestra los avisos pendientes y cuánto debe cada uno en total.
  - "Copiar para WhatsApp" arma el resumen de quién pagó y quién falta.

## Puesta en marcha (modo compartido)

En Vercel → proyecto → Settings:

1. **Storage**: conectar una base Vercel KV / Upstash Redis (crea `KV_REST_API_URL` y `KV_REST_API_TOKEN`).
   Si ya está conectada para el cupón de bienvenida, se reutiliza.
2. **Environment Variables**: `FUTBOL_ADMIN_PIN` = el PIN del encargado de la cancha.
3. Redeploy. Entrar a `/futbol`, tocar "🔒 Encargado" y poner el PIN.

Sin KV configurado la app funciona igual en **modo local** (datos solo en ese navegador). En Ajustes hay Exportar/Importar
para pasar los datos al modo compartido o tener un respaldo.
