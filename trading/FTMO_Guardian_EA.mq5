//+------------------------------------------------------------------+
//|                                            FTMO_Guardian_EA.mq5 |
//|  Robot de trading autónomo con gestión de riesgo para cuentas   |
//|  de fondeo (FTMO y similares).                                   |
//|                                                                  |
//|  Estrategia: seguimiento de tendencia por cruce de medias EMA    |
//|  con stops basados en ATR. Una sola posición a la vez.           |
//|  Sin martingala, sin grid, sin promediar pérdidas.               |
//|                                                                  |
//|  Frenos de seguridad:                                            |
//|   - Riesgo fijo por operación (% del balance inicial).           |
//|   - Freno de pérdida diaria: deja de operar antes de acercarse   |
//|     al límite diario de FTMO (5%).                               |
//|   - Freno de pérdida total: deja de operar antes del límite      |
//|     máximo de FTMO (10%).                                        |
//|   - Cierre de emergencia de posiciones si se cruza el umbral     |
//|     duro.                                                        |
//|   - Bloqueo al alcanzar el objetivo de profit del challenge.     |
//|   - Cierre opcional de posiciones el viernes antes del fin de    |
//|     semana.                                                      |
//|                                                                  |
//|  ADVERTENCIA: ningún robot garantiza ganancias. Pruébalo en      |
//|  el probador de estrategias y en una cuenta DEMO antes de        |
//|  usarlo en una cuenta real o de challenge.                       |
//+------------------------------------------------------------------+
#property copyright "Uso personal"
#property version   "1.00"
#property strict

#include <Trade/Trade.mqh>

//--- Parámetros de estrategia
input int      InpFastEMA          = 20;      // Periodo EMA rápida
input int      InpSlowEMA          = 50;      // Periodo EMA lenta
input int      InpATRPeriod        = 14;      // Periodo ATR
input double   InpSL_ATR           = 1.5;     // Stop Loss (múltiplos de ATR)
input double   InpTP_ATR           = 3.0;     // Take Profit (múltiplos de ATR)

//--- Parámetros de riesgo
input double   InpRiskPerTradePct  = 1.0;     // Riesgo por operación (% del balance inicial)
input double   InpDailySoftStopPct = 3.0;     // Pérdida diaria: dejar de abrir operaciones (%)
input double   InpDailyHardStopPct = 4.0;     // Pérdida diaria: cerrar todo y bloquear (%)
input double   InpTotalSoftStopPct = 7.0;     // Pérdida total: dejar de abrir operaciones (%)
input double   InpTotalHardStopPct = 8.0;     // Pérdida total: cerrar todo y bloquear (%)
input double   InpProfitTargetPct  = 10.0;    // Objetivo de profit: bloquear al alcanzarlo (%)
input double   InpInitialBalance   = 0.0;     // Balance inicial de la cuenta (0 = detectar al iniciar)

//--- Parámetros de operación
input bool     InpCloseOnFriday    = true;    // Cerrar posiciones el viernes
input int      InpFridayCloseHour  = 20;      // Hora del servidor para cierre del viernes
input int      InpMaxSpreadPoints  = 30;      // Spread máximo permitido (puntos)
input ulong    InpMagicNumber      = 20260722;// Número mágico
input int      InpSlippagePoints   = 10;      // Deslizamiento máximo (puntos)

//--- Globales
CTrade   g_trade;
int      g_hFastEMA  = INVALID_HANDLE;
int      g_hSlowEMA  = INVALID_HANDLE;
int      g_hATR      = INVALID_HANDLE;
double   g_initialBalance = 0.0;
double   g_dayStartEquity = 0.0;
int      g_currentDay     = -1;
datetime g_lastBarTime    = 0;
bool     g_lockedHard     = false;   // bloqueo permanente por umbral duro u objetivo

//+------------------------------------------------------------------+
int OnInit()
  {
   if(InpFastEMA >= InpSlowEMA)
     {
      Print("Error: la EMA rápida debe ser menor que la EMA lenta.");
      return(INIT_PARAMETERS_INCORRECT);
     }

   g_hFastEMA = iMA(_Symbol, _Period, InpFastEMA, 0, MODE_EMA, PRICE_CLOSE);
   g_hSlowEMA = iMA(_Symbol, _Period, InpSlowEMA, 0, MODE_EMA, PRICE_CLOSE);
   g_hATR     = iATR(_Symbol, _Period, InpATRPeriod);

   if(g_hFastEMA == INVALID_HANDLE || g_hSlowEMA == INVALID_HANDLE || g_hATR == INVALID_HANDLE)
     {
      Print("Error creando indicadores.");
      return(INIT_FAILED);
     }

   g_trade.SetExpertMagicNumber(InpMagicNumber);
   g_trade.SetDeviationInPoints(InpSlippagePoints);

   g_initialBalance = (InpInitialBalance > 0.0)
                      ? InpInitialBalance
                      : AccountInfoDouble(ACCOUNT_BALANCE);

   ResetDailyAnchor();

   PrintFormat("FTMO Guardian iniciado. Balance de referencia: %.2f", g_initialBalance);
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   if(g_hFastEMA != INVALID_HANDLE) IndicatorRelease(g_hFastEMA);
   if(g_hSlowEMA != INVALID_HANDLE) IndicatorRelease(g_hSlowEMA);
   if(g_hATR     != INVALID_HANDLE) IndicatorRelease(g_hATR);
  }

//+------------------------------------------------------------------+
void OnTick()
  {
   UpdateDailyAnchor();

   //--- Los frenos de riesgo se evalúan en CADA tick, no solo por vela.
   if(!RiskBrakesAllowTrading())
      return;

   //--- Cierre de viernes
   if(InpCloseOnFriday && IsFridayCloseTime())
     {
      CloseAllPositions("cierre de viernes");
      return;
     }

   //--- La lógica de entrada solo se evalúa una vez por vela cerrada.
   if(!IsNewBar())
      return;

   if(HasOpenPosition())
      return;

   if(!SpreadOK())
      return;

   int signal = GetSignal();
   if(signal == 0)
      return;

   OpenPosition(signal);
  }

//+------------------------------------------------------------------+
//| Ancla diaria: registra el equity al empezar cada día de servidor |
//+------------------------------------------------------------------+
void ResetDailyAnchor()
  {
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   g_currentDay     = dt.day_of_year;
   g_dayStartEquity = AccountInfoDouble(ACCOUNT_EQUITY);
  }

void UpdateDailyAnchor()
  {
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   if(dt.day_of_year != g_currentDay)
     {
      ResetDailyAnchor();
      PrintFormat("Nuevo día de trading. Equity de partida: %.2f", g_dayStartEquity);
     }
  }

//+------------------------------------------------------------------+
//| Frenos de riesgo. Devuelve true si se permite operar.            |
//+------------------------------------------------------------------+
bool RiskBrakesAllowTrading()
  {
   if(g_lockedHard)
      return(false);

   double equity  = AccountInfoDouble(ACCOUNT_EQUITY);

   //--- Objetivo de profit alcanzado: proteger el resultado.
   if(InpProfitTargetPct > 0.0 &&
      equity >= g_initialBalance * (1.0 + InpProfitTargetPct / 100.0))
     {
      CloseAllPositions("objetivo de profit alcanzado");
      g_lockedHard = true;
      Print("OBJETIVO ALCANZADO. El robot deja de operar para proteger el resultado.");
      return(false);
     }

   //--- Pérdida total (medida sobre el balance inicial, como FTMO).
   double totalLossPct = (g_initialBalance - equity) / g_initialBalance * 100.0;
   if(totalLossPct >= InpTotalHardStopPct)
     {
      CloseAllPositions("freno duro de pérdida total");
      g_lockedHard = true;
      PrintFormat("FRENO DURO: pérdida total %.2f%%. Robot bloqueado.", totalLossPct);
      return(false);
     }
   if(totalLossPct >= InpTotalSoftStopPct)
      return(false);

   //--- Pérdida diaria (medida sobre el balance inicial, como FTMO).
   double dailyLossPct = (g_dayStartEquity - equity) / g_initialBalance * 100.0;
   if(dailyLossPct >= InpDailyHardStopPct)
     {
      CloseAllPositions("freno duro de pérdida diaria");
      PrintFormat("FRENO DIARIO DURO: pérdida %.2f%%. No se opera más hoy.", dailyLossPct);
      return(false);
     }
   if(dailyLossPct >= InpDailySoftStopPct)
      return(false);

   return(true);
  }

//+------------------------------------------------------------------+
bool IsNewBar()
  {
   datetime barTime = iTime(_Symbol, _Period, 0);
   if(barTime == g_lastBarTime)
      return(false);
   g_lastBarTime = barTime;
   return(true);
  }

//+------------------------------------------------------------------+
bool HasOpenPosition()
  {
   for(int i = PositionsTotal() - 1; i >= 0; i--)
     {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) == _Symbol &&
         (ulong)PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
         return(true);
     }
   return(false);
  }

//+------------------------------------------------------------------+
bool SpreadOK()
  {
   long spread = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   return(spread <= InpMaxSpreadPoints);
  }

//+------------------------------------------------------------------+
bool IsFridayCloseTime()
  {
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   return(dt.day_of_week == 5 && dt.hour >= InpFridayCloseHour);
  }

//+------------------------------------------------------------------+
//| Señal: +1 compra, -1 venta, 0 nada.                              |
//| Cruce de EMAs confirmado en la última vela CERRADA.              |
//+------------------------------------------------------------------+
int GetSignal()
  {
   double fast[3], slow[3];
   if(CopyBuffer(g_hFastEMA, 0, 1, 2, fast) < 2) return(0);
   if(CopyBuffer(g_hSlowEMA, 0, 1, 2, slow) < 2) return(0);

   // fast[1]/slow[1] = vela cerrada más reciente; fast[0]/slow[0] = la anterior.
   bool crossUp   = fast[0] <= slow[0] && fast[1] > slow[1];
   bool crossDown = fast[0] >= slow[0] && fast[1] < slow[1];

   if(crossUp)   return(1);
   if(crossDown) return(-1);
   return(0);
  }

//+------------------------------------------------------------------+
double GetATR()
  {
   double atr[1];
   if(CopyBuffer(g_hATR, 0, 1, 1, atr) < 1) return(0.0);
   return(atr[0]);
  }

//+------------------------------------------------------------------+
//| Tamaño de lote según el riesgo por operación.                    |
//+------------------------------------------------------------------+
double CalcLots(double slDistance)
  {
   if(slDistance <= 0.0) return(0.0);

   double tickSize  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   if(tickSize <= 0.0 || tickValue <= 0.0) return(0.0);

   double riskMoney    = g_initialBalance * InpRiskPerTradePct / 100.0;
   double lossPerLot   = slDistance / tickSize * tickValue;
   if(lossPerLot <= 0.0) return(0.0);

   double lots = riskMoney / lossPerLot;

   double minLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);

   lots = MathFloor(lots / lotStep) * lotStep;
   lots = MathMax(minLot, MathMin(maxLot, lots));
   return(lots);
  }

//+------------------------------------------------------------------+
void OpenPosition(int signal)
  {
   double atr = GetATR();
   if(atr <= 0.0) return;

   double slDistance = atr * InpSL_ATR;
   double tpDistance = atr * InpTP_ATR;
   double lots = CalcLots(slDistance);
   if(lots <= 0.0)
     {
      Print("Lote calculado inválido; no se abre operación.");
      return;
     }

   int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);

   if(signal > 0)
     {
      double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
      double sl  = NormalizeDouble(ask - slDistance, digits);
      double tp  = NormalizeDouble(ask + tpDistance, digits);
      if(g_trade.Buy(lots, _Symbol, 0.0, sl, tp, "Guardian: compra por cruce EMA"))
         PrintFormat("COMPRA %.2f lotes. SL=%s TP=%s", lots,
                     DoubleToString(sl, digits), DoubleToString(tp, digits));
     }
   else
     {
      double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
      double sl  = NormalizeDouble(bid + slDistance, digits);
      double tp  = NormalizeDouble(bid - tpDistance, digits);
      if(g_trade.Sell(lots, _Symbol, 0.0, sl, tp, "Guardian: venta por cruce EMA"))
         PrintFormat("VENTA %.2f lotes. SL=%s TP=%s", lots,
                     DoubleToString(sl, digits), DoubleToString(tp, digits));
     }
  }

//+------------------------------------------------------------------+
void CloseAllPositions(string reason)
  {
   for(int i = PositionsTotal() - 1; i >= 0; i--)
     {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) != _Symbol) continue;
      if((ulong)PositionGetInteger(POSITION_MAGIC) != InpMagicNumber) continue;

      if(g_trade.PositionClose(ticket))
         PrintFormat("Posición %I64u cerrada (%s).", ticket, reason);
      else
         PrintFormat("Error cerrando posición %I64u: %d", ticket, GetLastError());
     }
  }
//+------------------------------------------------------------------+
