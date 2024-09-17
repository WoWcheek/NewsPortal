namespace News.Presentation.Models.Requests;

public class AddArticleRequest
{
    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string PictureUrl { get; set; } = string.Empty;

    public Guid CategoryId { get; set; }
}
