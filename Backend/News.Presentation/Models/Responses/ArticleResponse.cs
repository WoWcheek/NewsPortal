using News.BLL.DTO;

namespace News.Presentation.Models.Responses;

public class ArticleResponse
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string PictureUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public string Category { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;
}
