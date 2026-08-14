using Microsoft.EntityFrameworkCore;

namespace DemoApp.Api;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // .NET will automatically find the Product class if it's in the same project assembly
    public DbSet<Product> Products => Set<Product>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Direct absolute routing to avoid isolated runtime directory confusion
            optionsBuilder.UseSqlite("Data Source=/root/inventory.db");
        }
    }
}
