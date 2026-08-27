// Data/IProductRepository.cs
namespace DemoApp.Api;

public interface IProductRepository
{
    Task<PagedResultDto<Product>> GetAllAsync(int page, int pageSize, string? search);
    Task<Product?> GetByIdAsync(int id);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task AddAuditLogAsync(string action, string description, string user);
    Task<List<AuditLog>> GetAuditLogsAsync(); // To pull logs out to the UI later
    Task ClearAuditLogsAsync();
    Task SaveChangesAsync();
}
