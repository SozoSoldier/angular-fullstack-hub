export interface AuditLog {
  id: number;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
}
