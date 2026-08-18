using Microsoft.EntityFrameworkCore;

namespace DemoApp.Api;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    // .NET will automatically find the Product class if it's in the same project assembly
    public DbSet<Product> Products => Set<Product>();

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Direct absolute routing to avoid isolated runtime directory confusion
            optionsBuilder.UseSqlite("Data Source=/root/inventory.db");
        }
    }

    // FIXED: Changed type parameter from ModelCreatingModelBuilder to ModelBuilder
    protected override void OnModelCreating(ModelBuilder modelBuilder)
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

        // NEW SEED DATA: Pre-populates default system startup logs
        modelBuilder
            .Entity<AuditLog>()
            .HasData(
                new AuditLog
                {
                    Id = 1,
                    Action = "SYSTEM_STARTUP",
                    Description =
                        "In-Memory database container initialized and tables scaffolded successfully.",
                    PerformedBy = "Kernel Engine",
                    Timestamp = DateTime.UtcNow.AddMinutes(-5),
                },
                new AuditLog
                {
                    Id = 2,
                    Action = "SEED_DATA",
                    Description = "Default core network products seeded into active memory caches.",
                    PerformedBy = "Database Initializer",
                    Timestamp = DateTime.UtcNow.AddMinutes(-4),
                }
            );
    }
}
