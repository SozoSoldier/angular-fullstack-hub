using DemoApp.Api; // Required to discover the AppDbContext class
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore; // Required for .UseSqlServer() extension

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader()
    );
});

// 1. Create and maintain a single master connection to preserve the memory space
var masterConnection = new SqliteConnection(
    "Data Source=InMemoryPortfolioDb;Mode=Memory;Cache=Shared"
);
masterConnection.Open();

// 2. Register the DbContext using our active master connection
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(masterConnection));

builder.Services.AddControllers();

// Tells .NET Dependency Injection to hand over a ProductRepository whenever IProductRepository is requested
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// ... rest of builder config
var app = builder.Build();
app.UseMiddleware<ApiKeyMiddleware>();
app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

// 3. Ensure the initial database schemas and seed records are pushed into RAM
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // EnsureCreated handles both table initialization and data seeding automatically
    await context.Database.EnsureCreatedAsync();
    System.Console.WriteLine(
        "[Render Initializer]: In-Memory SQLite database initialized and seeded."
    );
}

app.Run();
