using System.ComponentModel.DataAnnotations;

public class Product
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Product name is mandatory.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 100 characters long.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Price is mandatory.")]
    [Range(0.01, 10000.00, ErrorMessage = "Price must be between $0.01 and $10,000.00.")]
    public decimal Price { get; set; }

    public bool IsDeleted { get; set; } = false;
}
