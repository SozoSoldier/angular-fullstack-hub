// Controllers/ProductsController.cs
using Microsoft.AspNetCore.Mvc;

namespace DemoApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repo;

    // The Controller now talks purely to our Repository interface contract wrapper
    public ProductsController(IProductRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<Product>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 6,
        [FromQuery] string? search = null
    )
    {
        var result = await _repo.GetAllAsync(page, pageSize, search);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Create(Product product)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _repo.AddAsync(product);
        await _repo.AddAuditLogAsync(
            "PRODUCT_CREATED",
            $"New inventory product cataloged: Name='{product.Name}', Price=${product.Price}",
            "Admin User"
        );
        await _repo.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Product updatedProduct)
    {
        if (id != updatedProduct.Id)
        {
            return BadRequest("ID mismatch configuration.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var product = await _repo.GetByIdAsync(id);
        if (product == null || product.IsDeleted)
        {
            return NotFound();
        }

        product.Name = updatedProduct.Name;
        product.Price = updatedProduct.Price;

        await _repo.UpdateAsync(product);
        await _repo.AddAuditLogAsync(
            "PRODUCT_UPDATED",
            $"Inventory parameters modified for ID #{id}: Revised fields submitted successfully.",
            "Admin User"
        );
        await _repo.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _repo.GetByIdAsync(id);
        if (product == null || product.IsDeleted)
        {
            return NotFound();
        }

        product.IsDeleted = true; // Flag for our Soft Delete
        await _repo.AddAuditLogAsync(
            "PRODUCT_DELETED",
            $"Soft deletion executed successfully on product ID #{id}. Access flag revoked.",
            "Admin User"
        );
        await _repo.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("audit-logs")]
    public async Task<ActionResult<List<AuditLog>>> GetLogs()
    {
        var logs = await _repo.GetAuditLogsAsync();
        return Ok(logs);
    }

    [HttpDelete("audit-logs")]
    public async Task<IActionResult> ClearLogs()
    {
        await _repo.ClearAuditLogsAsync();

        // Write a fresh baseline entry to log the purge action itself!
        await _repo.AddAuditLogAsync(
            "LOGS_CLEARED",
            "Administrative telemetry database clearance executed successfully.",
            "Admin User"
        );

        return NoContent(); // 204 No Content confirms success
    }
}
