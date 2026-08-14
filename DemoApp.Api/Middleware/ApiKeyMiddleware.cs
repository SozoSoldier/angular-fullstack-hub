using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace DemoApp.Api;

public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private const string APIKEYNAME = "X-API-KEY";
    private const string EXSPECTEDKEY = "DemoPortfolioSecretPassphrase123!";

    public ApiKeyMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // FIX: Only enforce the API key check on actual data requests (/api/...)
        // This allows static frontend files and web pages to load normally in the browser
        if (!context.Request.Path.StartsWithSegments("/api"))
        {
            await _next(context);
            return;
        }

        // --- Core security validation remains completely intact for database endpoints ---
        if (!context.Request.Headers.TryGetValue(APIKEYNAME, out var extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("API Key was not provided inside headers.");
            return;
        }

        if (!EXSPECTEDKEY.Equals(extractedApiKey))
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Unauthorized client key signature.");
            return;
        }

        await _next(context);
    }
}
