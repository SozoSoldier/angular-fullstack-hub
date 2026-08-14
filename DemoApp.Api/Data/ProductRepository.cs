// Data/ProductRepository.cs
using Microsoft.EntityFrameworkCore;

namespace DemoApp.Api;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    // Inject the DB context here instead of the controller
    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResultDto<Product>> GetAllAsync(int page, int pageSize, string? search)
    {
        var query = _context.Products.Where(p => p.IsDeleted == false);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));
        }

        var totalItems = await query.CountAsync();

        var products = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResultDto<Product>
        {
            Items = products,
            TotalItems = totalItems,
            CurrentPage = page,
            PageSize = pageSize,
        };
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
    }

    public async Task UpdateAsync(Product product)
    {
        // Entity Framework tracks modifications locally on the entity instance,
        // so we can mark it modified explicitly or rely on state tracking markers.
        _context.Entry(product).State = EntityState.Modified;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
