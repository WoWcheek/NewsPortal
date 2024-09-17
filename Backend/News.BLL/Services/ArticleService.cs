using AutoMapper;
using Microsoft.AspNetCore.Identity;
using News.BLL.DTO;
using News.BLL.Interfaces;
using News.DAL.Entities;
using News.DAL.Interfaces;

namespace News.BLL.Services;
public class ArticleService : IArticleService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<IdentityUser> _userManager;

    public ArticleService(IMapper mapper, IUnitOfWork unitOfWork, UserManager<IdentityUser> userManager)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    public async Task<IEnumerable<ArticleDTO>> GetAllArticles()
    {
        var articles = await _unitOfWork
            .Articles
            .All();

        var articlesDto = _mapper
            .Map<List<ArticleDTO>>(articles);

        return articlesDto;
    }

    public async Task<ArticleDTO> GetArticleById(Guid id)
    {
        var article = await _unitOfWork
            .Articles
            .Find(id);

        var articleDto = _mapper
            .Map<ArticleDTO>(article);

        return articleDto;
    }

    public async Task<ArticleDTO> CreateArticle(ArticleDTO newArticle)
    {
        var listWithCategory = await _unitOfWork
            .Categories
            .Find(x => string.Compare(x.Name, newArticle.Category.Name, StringComparison.OrdinalIgnoreCase) == 0);

        var category = listWithCategory.Count() > 0
            ? listWithCategory.ElementAt(0)
            : null;

        if (category is null)
        {
            var categoryToAdd = _mapper
                .Map<Category>(newArticle.Category);

            try
            {
                var addedCategory = await _unitOfWork
                    .Categories
                    .Add(categoryToAdd);

                newArticle.CategoryId = addedCategory!.Id;
            }
            catch
            {
                throw;
            }
        }
        else
        {
            newArticle.CategoryId = category.Id;
        }

        var author = await _userManager
            .FindByIdAsync(newArticle.AuthorId);

        if (author is null)
        {
            throw new Exception("Author does not exist.");
        }

        var article = _mapper
            .Map<Article>(newArticle);

        var createdArticle = await _unitOfWork
            .Articles
            .Add(article);

        if (createdArticle is null)
        {
            throw new Exception($"Something went wrong while adding new article. Please check if provided values are valid.");
        }

        await _unitOfWork.CommitChanges();

        var createdArticleDto = _mapper
            .Map<ArticleDTO>(createdArticle);

        return createdArticleDto;
    }

    public async Task<ArticleDTO> UpdateArticle(ArticleDTO newArticle)
    {
        var listWithCategory = await _unitOfWork
            .Categories
            .Find(x => string.Compare(x.Name, newArticle.Category.Name, StringComparison.OrdinalIgnoreCase) == 0);

        var category = listWithCategory.Count() > 0
            ? listWithCategory.ElementAt(0)
            : null;

        if (category is null)
        {
            var categoryToAdd = _mapper
                .Map<Category>(newArticle.Category);

            try
            {
                var addedCategory = await _unitOfWork
                    .Categories
                    .Add(categoryToAdd);

                newArticle.CategoryId = addedCategory!.Id;
            }
            catch
            {
                throw;
            }
        }
        else
        {
            newArticle.CategoryId = category.Id;
        }

        var author = await _userManager
            .FindByIdAsync(newArticle.AuthorId);

        if (author is null)
        {
            throw new Exception("Author does not exist.");
        }

        var article = _mapper
            .Map<Article>(newArticle);

        var updatedArticle = await _unitOfWork
            .Articles
            .Update(article);

        if (updatedArticle is null)
        {
            throw new Exception($"Something went wrong while updating an article. Please check if provided values are valid.");
        }

        await _unitOfWork.CommitChanges();

        var updatedArticleDto = _mapper
            .Map<ArticleDTO>(updatedArticle);

        return updatedArticleDto;
    }

    public async Task<ArticleDTO> DeleteArticle(Guid id)
    {
        var deletedArticle = await _unitOfWork
            .Articles
            .Delete(id);

        if (deletedArticle is null)
        {
            throw new Exception("Article does not exist.");
        }

        await _unitOfWork.CommitChanges();

        var deletedArticleDto = _mapper
            .Map<ArticleDTO>(deletedArticle);

        return deletedArticleDto;
    }

    public void Dispose()
    {
        _unitOfWork.Dispose();
    }
}
