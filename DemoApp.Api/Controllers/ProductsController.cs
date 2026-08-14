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
        await _repo.SaveChangesAsync();
        return NoContent();
    }
}
