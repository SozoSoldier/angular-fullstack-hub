using DemoApp.Api; // Required to discover your AppDbContext class
using Microsoft.EntityFrameworkCore; // Required for .UseSqlServer() extension

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader()
    );
});

// Changed .UseSqlServer to .UseSqlite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddControllers();

// Tells .NET Dependency Injection to hand over a ProductRepository whenever IProductRepository is requested
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// ... rest of builder config
var app = builder.Build();
app.UseMiddleware<ApiKeyMiddleware>();
app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

// NEW ARCHITECTURE ADDITION: Automatic Container Database Initializer & Migration Runner
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // Automatically creates inventory.db and applies your tables (Product, Soft Delete columns, etc.)
        await Microsoft.EntityFrameworkCore.RelationalDatabaseFacadeExtensions.MigrateAsync(
            context.Database
        );
        System.Console.WriteLine(
            "[Docker Initializer]: SQLite Database tables synced successfully."
        );
    }
    catch (System.Exception ex)
    {
        System.Console.WriteLine($"[Docker Initializer Error]: Database sync failed: {ex.Message}");
    }
}

app.Run();
