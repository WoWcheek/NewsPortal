namespace News.Presentation.Models.Responses;

public class TokenResponse
{
    public string Token { get; set; } = string.Empty;

    public DateTime ValidUntil { get; set; }
}
