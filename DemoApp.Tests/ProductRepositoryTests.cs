// DemoApp.Tests/ProductRepositoryTests.cs
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DemoApp.Api;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace DemoApp.Tests;

public class ProductRepositoryTests
{
    // Helper method to provision a completely isolated, fresh in-memory database workspace for every test execution
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ShouldFilterResults_WhenKeywordIsProvided()
    {
        // ARRANGE: Set up a mock database scenario with seed products
        using var context = GetInMemoryDbContext();
        context.Products.AddRange(
            new List<Product>
            {
                new Product
                {
                    Id = 1,
                    Name = "Alpha Cisco Router",
                    Price = 100m,
                    IsDeleted = false,
                },
                new Product
                {
                    Id = 2,
                    Name = "Beta PoE Switch",
                    Price = 200m,
                    IsDeleted = false,
                },
                new Product
                {
                    Id = 3,
                    Name = "Gamma Network Cable",
                    Price = 300m,
                    IsDeleted = false,
                },
            }
        );
        await context.SaveChangesAsync();

        var repository = new ProductRepository(context);

        // ACT: Execute a search query looking specifically for "Router"
        var result = await repository.GetAllAsync(page: 1, pageSize: 10, search: "Router");

        // ASSERT: Verify that only the matching product was parsed out
        Assert.Single(result.Items);
        Assert.Equal("Alpha Cisco Router", result.Items.First().Name);
    }

    [Fact]
    public async Task UpdateAsync_ShouldPreserveSoftDeleteFlag_WhenMarkedTrue()
    {
        // ARRANGE: Seed a healthy data target item inside our local RAM grid
        using var context = GetInMemoryDbContext();
        var product = new Product
        {
            Id = 1,
            Name = "Server Rack Bundle",
            Price = 500m,
            IsDeleted = false,
        };
        context.Products.Add(product);
        await context.SaveChangesAsync();

        var repository = new ProductRepository(context);

        // ACT: Simulate our logical Soft Deletion flag flip event
        product.IsDeleted = true;
        await repository.UpdateAsync(product);
        await repository.SaveChangesAsync();

        // ASSERT: Verify the object state inside the database table remains physically preserved, but flagged
        var updatedProduct = await context.Products.FindAsync(1);
        Assert.NotNull(updatedProduct);
        Assert.True(updatedProduct.IsDeleted);

        // Ensure our repository's filtered collection pipeline completely hides it from standard view lists
        var activeViewResult = await repository.GetAllAsync(page: 1, pageSize: 10, search: null);
        Assert.Empty(activeViewResult.Items);
    }
}
