using News.BLL.DTO;

namespace News.BLL.Interfaces;

public interface IArticleService : IDisposable
{
    Task<IEnumerable<ArticleDTO>> GetAllArticles();
    Task<ArticleDTO> GetArticleById(Guid id);
    Task<ArticleDTO> CreateArticle(ArticleDTO newArticle);
    Task<ArticleDTO> UpdateArticle(ArticleDTO newArticle);
    Task<ArticleDTO> DeleteArticle(Guid id);
}
