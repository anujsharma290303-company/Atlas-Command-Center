export type AlertType = "crypto" | "weather";

export interface AlertConfig {
  id: string;
  type: AlertType;
  metric: string;
  condition: "above" | "below";
  threshold: number;
  target: string;
}

export interface AlertEvent {
  id: string;
  alertConfigId: string;   // ✅ links event back to which AlertConfig triggered it
  message: string;
  timestamp: number;       // ✅ was: timeStamp — keep casing consistent
}