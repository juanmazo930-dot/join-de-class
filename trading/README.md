# FTMO Guardian EA — robot de trading autónomo para MT5

Este es un **Expert Advisor (EA)**: un robot que corre dentro de MetaTrader 5 y
opera solo, sin depender de ti, una vez que lo instalas y lo dejas corriendo.
Es la única forma legítima de tener "un agente que no dependa de ti" en una
cuenta FTMO: el robot corre **en tu propia plataforma, bajo tu cuenta**, que es
lo que FTMO permite (FTMO prohíbe que un tercero gestione tu cuenta, pero sí
permite EAs propios).

## Lo que hace

- **Estrategia**: seguimiento de tendencia. Compra cuando la EMA 20 cruza por
  encima de la EMA 50, vende cuando cruza por debajo. Stop Loss a 1.5 × ATR y
  Take Profit a 3 × ATR (relación riesgo/beneficio 1:2). Una sola posición a
  la vez. Sin martingala, sin grid, sin promediar pérdidas.
- **Riesgo por operación**: 1% del balance inicial (configurable).
- **Frenos FTMO** (revisados en cada tick):
  | Freno | Por defecto | Límite FTMO |
  |---|---|---|
  | Pérdida diaria — deja de abrir operaciones | 3% | 5% |
  | Pérdida diaria — cierra todo | 4% | 5% |
  | Pérdida total — deja de abrir operaciones | 7% | 10% |
  | Pérdida total — cierra todo y se bloquea | 8% | 10% |
  | Objetivo de profit — se bloquea para proteger el resultado | +10% | objetivo del challenge |
- **Cierre de viernes**: cierra posiciones el viernes a las 20:00 (hora del
  servidor) para no quedar expuesto el fin de semana.
- **Filtro de spread**: no opera si el spread supera 30 puntos.

## Requisito importante: los EAs NO corren en el teléfono

La app móvil de MT5 **no ejecuta robots**. Para que opere sin depender de ti
necesitas una de estas dos opciones:

1. **Un PC con Windows encendido** con MT5 de escritorio y el EA cargado.
2. **Un VPS** (servidor virtual alquilado, ~10–20 USD/mes). El propio MT5
   ofrece uno: en la terminal de escritorio, menú del servidor → "Virtual
   Hosting". Instalas el EA una vez, lo migras al VPS y desde ahí corre 24/5.
   Después puedes **monitorear las operaciones desde la app del teléfono**
   (verás las posiciones que el robot abre y cierra).

## Instalación (una sola vez, desde un PC)

1. Abre MT5 de escritorio e inicia sesión con tus credenciales FTMO
   (servidor `FTMO-Server3`).
2. Abre el MetaEditor (F4), crea un nuevo Expert Advisor llamado
   `FTMO_Guardian_EA` y pega el contenido de `FTMO_Guardian_EA.mq5`.
   Compila (F7) — debe decir `0 errors`.
3. **Primero pruébalo**: Ctrl+R abre el Probador de Estrategias. Corre el EA
   sobre EURUSD en H1 con datos de al menos 2 años. Mira el resultado.
4. **Después pruébalo en DEMO**: FTMO te da una Free Trial. Deja el robot
   corriendo ahí 2–4 semanas.
5. Solo si los pasos 3 y 4 te convencen, cárgalo en la cuenta del challenge:
   arrastra el EA al gráfico (recomendado: EURUSD, timeframe H1), activa
   "Algo Trading" (botón en la barra superior) y verifica la carita feliz en
   la esquina del gráfico.
6. Si usas VPS: clic derecho en el gráfico → "Virtual Hosting" → migrar.

## Configuración recomendada

- **Símbolo**: EURUSD (spread bajo, buen comportamiento en tendencia).
- **Timeframe**: H1 o H4. En timeframes menores el spread se come la ventaja.
- **Riesgo por operación**: deja el 1%. Subirlo acelera tanto las ganancias
  como la muerte de la cuenta.

## Lo que este robot NO es

- **No garantiza ganancias.** Ninguna estrategia lo hace; los cruces de medias
  pierden en mercados laterales y ganan en tendencias. La ventaja, si existe,
  se ve en meses, no en días.
- **No lee noticias.** Los eventos de alto impacto (NFP, tasas de interés)
  pueden generar picos que se salten el stop. Si quieres, apágalo manualmente
  los días de noticias grandes (calendario: https://www.forexfactory.com).
- **No es un "inversor agresivo que nunca pierde oportunidades".** Está
  configurado al revés a propósito: su primera prioridad es **no violar las
  reglas de FTMO**, porque una cuenta quemada no aprovecha ninguna
  oportunidad.

## Seguridad

Tus credenciales aparecieron en una captura de pantalla compartida en esta
conversación. **Cambia la master password en trader.ftmo.com** antes de usar
la cuenta.
