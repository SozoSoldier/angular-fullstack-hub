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

    public async Task AddAuditLogAsync(string action, string description, string user)
    {
        var log = new AuditLog
        {
            Action = action,
            Description = description,
            PerformedBy = user,
            Timestamp = DateTime.UtcNow,
        };
        await _context.AuditLogs.AddAsync(log);
    }

    public async Task<List<AuditLog>> GetAuditLogsAsync()
    {
        // Returns logs sorted with the newest entries at the very top of the list
        return await _context.AuditLogs.OrderByDescending(l => l.Timestamp).ToListAsync();
    }

    public async Task ClearAuditLogsAsync()
    {
        // Removes all entries from the physical database table array
        _context.AuditLogs.RemoveRange(_context.AuditLogs);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
