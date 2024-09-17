using Microsoft.AspNetCore.Identity;
using News.DAL.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace News.BLL.DTO;

public class ArticleDTO
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string PictureUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public Guid CategoryId { get; set; }

    public CategoryDTO Category { get; set; } = null!;

    public string AuthorId { get; set; } = string.Empty;
}
