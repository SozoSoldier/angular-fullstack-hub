// Models/AuditLog.cs
using System;

namespace DemoApp.Api;

public class AuditLog
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty; // e.g., "AUTHENTICATION", "PRODUCT_CREATED"
    public string Description { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = "System Administrator";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
