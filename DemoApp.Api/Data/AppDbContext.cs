using Microsoft.EntityFrameworkCore;

namespace DemoApp.Api;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

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

    protected override void OnModelCreating(ModelCreatingModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // SEED DATA: Pre-populates the database file inside the container on startup
        modelBuilder
            .Entity<Product>()
            .HasData(
                new Product
                {
                    Id = 1,
                    Name = "Enterprise Cloud Router",
                    Price = 249.99m,
                    IsDeleted = false,
                },
                new Product
                {
                    Id = 2,
                    Name = "Gigabit PoE Network Switch",
                    Price = 189.50m,
                    IsDeleted = false,
                },
                new Product
                {
                    Id = 3,
                    Name = "Cat6A Shielded Cable (1000ft)",
                    Price = 125.00m,
                    IsDeleted = false,
                }
            );
    }
}
