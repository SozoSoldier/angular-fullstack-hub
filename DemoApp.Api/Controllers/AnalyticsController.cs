using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnalyticsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<InventorySummaryDto>> GetSummary()
    {
        // Calculate live metrics directly from the SQLite dataset via LINQ
        var totalValuation = await _context.Products.SumAsync(p => p.Price);
        var uniqueCount = await _context.Products.CountAsync(p => p.IsDeleted == false);

        var summary = new InventorySummaryDto
        {
            TotalValuation = totalValuation,
            UniqueItemCount = uniqueCount,
            DatabaseStatus = true, // Returns true if the context successfully responds
        };

        return Ok(summary);
    }
}
