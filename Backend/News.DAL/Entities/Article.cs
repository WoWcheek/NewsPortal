using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace News.DAL.Entities;

public class Article
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string PictureUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    [ForeignKey(nameof(Category))]
    public Guid CategoryId { get; set; }

    public Category Category { get; set; } = null!;

    [ForeignKey(nameof(Author))]
    public string AuthorId { get; set; } = string.Empty;

    public IdentityUser Author { get; set; } = null!;
}
