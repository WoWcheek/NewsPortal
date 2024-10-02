using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using News.BLL.DTO;
using News.BLL.Interfaces;
using News.Presentation.Controllers;
using News.Presentation.Models.Requests;
using News.Presentation.Models.Responses;
using System.Security.Claims;
using System.Security.Principal;

namespace ArticlesTests;

public class ArticlesControllerTests
{
    private readonly Mock<IArticleService> _articleServiceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<UserManager<IdentityUser>> _userManagerMock;
    private readonly ArticlesController _controller;

    public ArticlesControllerTests()
    {
        _articleServiceMock = new Mock<IArticleService>();
        _mapperMock = new Mock<IMapper>();
        _userManagerMock = MockUserManager();
        _controller = new ArticlesController(_mapperMock.Object, _articleServiceMock.Object, _userManagerMock.Object);

        var authorName = "Test_user";

        var httpContext = new DefaultHttpContext()
        {
            User = new ClaimsPrincipal(new GenericIdentity(authorName))
        };
        var actionContext = new ActionContext(httpContext, new Microsoft.AspNetCore.Routing.RouteData(),
                                                           new Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor());
        _controller.ControllerContext = new ControllerContext(actionContext);
    }

    // Тест на получение всех статей
    [Fact]
    public async Task GetAll_ReturnsOkResult_WithListOfArticles()
    {
        // Arrange
        var articles = new List<ArticleDTO>
        {
            new ArticleDTO { Id = Guid.NewGuid(), AuthorId = "1" },
            new ArticleDTO { Id = Guid.NewGuid(), AuthorId = "2" }
        };

        var articleResponses = new List<ArticleResponse>
        {
            new ArticleResponse { Id = articles[0].Id, Author = "user1" },
            new ArticleResponse { Id = articles[1].Id, Author = "user2" }
        };

        _articleServiceMock.Setup(s => s.GetAllArticles()).ReturnsAsync(articles);
        _mapperMock.Setup(m => m.Map<List<ArticleResponse>>(articles)).Returns(articleResponses);

        _userManagerMock.Setup(um => um.FindByIdAsync("1")).ReturnsAsync(new IdentityUser { UserName = "user1" });
        _userManagerMock.Setup(um => um.FindByIdAsync("2")).ReturnsAsync(new IdentityUser { UserName = "user2" });

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<List<ArticleResponse>>(okResult.Value);
        Assert.Equal(2, returnValue.Count);
        Assert.Equal("user1", returnValue[0].Author);
        Assert.Equal("user2", returnValue[1].Author);
    }

    // Тест на получение одной статьи по Id
    [Fact]
    public async Task GetSingle_ReturnsOkResult_WithArticle()
    {
        // Arrange
        var article = new ArticleDTO { Id = Guid.NewGuid(), AuthorId = "1" };
        var articleResponse = new ArticleResponse { Id = article.Id, Author = "user1" };

        _articleServiceMock.Setup(s => s.GetArticleById(article.Id)).ReturnsAsync(article);
        _mapperMock.Setup(m => m.Map<ArticleResponse>(article)).Returns(articleResponse);
        _userManagerMock.Setup(um => um.FindByIdAsync("1")).ReturnsAsync(new IdentityUser { UserName = "user1" });

        // Act
        var result = await _controller.GetSingle(article.Id);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<ArticleResponse>(okResult.Value);
        Assert.Equal(article.Id, returnValue.Id);
        Assert.Equal("user1", returnValue.Author);
    }

    // Тест на добавление статьи
    [Fact]
    public async Task Add_ReturnsOkResult_WithCreatedArticle()
    {
        var categoryGuid = Guid.NewGuid();
        var articleId = Guid.NewGuid();
        var authorId = Guid.NewGuid().ToString();
        var authorName = "Test_user";

        var request = new AddArticleRequest
        {
            Title = "Test_title",
            Content = "Test_content",
            PictureUrl = "Test_url",
            CategoryId = categoryGuid
        };

        var dto = new ArticleDTO
        {
            Id = articleId,
            Title = request.Title,
            Content = request.Content,
            PictureUrl = request.PictureUrl,
            CreatedAt = DateTime.UtcNow,
            AuthorId = authorId
        };

        var response = new ArticleResponse
        {
            Id = articleId,
            Title = request.Title,
            Content = request.Content,
            PictureUrl = request.PictureUrl,
            CreatedAt = DateTime.UtcNow,
            Category = "Test_category",
            Author = authorName
        };

        var author = new IdentityUser
        {
            UserName = authorName,
            Id = authorId
        };

        _userManagerMock.Setup(m => m.FindByIdAsync(authorId)).ReturnsAsync(author);
        _userManagerMock.Setup(m => m.FindByNameAsync(authorName)).ReturnsAsync(author);

        _articleServiceMock.Setup(s => s.CreateArticle(dto)).ReturnsAsync(dto);

        _mapperMock.Setup(m => m.Map<ArticleDTO>(request)).Returns(dto);
        _mapperMock.Setup(m => m.Map<ArticleResponse>(dto)).Returns(response);

        var result = await _controller.Add(request);

        var okObjectResult = Assert.IsType<OkObjectResult>(result);
        var controllerResponse = Assert.IsType<ArticleResponse>(okObjectResult.Value);
        Assert.Equal(controllerResponse.Title, request.Title);
        Assert.Equal(controllerResponse.Content, request.Content);
        Assert.Equal(controllerResponse.PictureUrl, request.PictureUrl);
        Assert.Equal(controllerResponse.Author, authorName);
    }

    // Тест на обновление статьи
    [Fact]
    public async Task Update_ReturnsOkResult_WithUpdatedArticle()
    {
        var categoryGuid = Guid.NewGuid();
        var articleId = Guid.NewGuid();
        var authorId = Guid.NewGuid().ToString();
        var authorName = "Test_user";

        var request = new UpdateArticleRequest
        {
            Title = "Test_title",
            Content = "Test_content",
            PictureUrl = "Test_url",
            CategoryId = categoryGuid
        };

        var dto = new ArticleDTO
        {
            Id = articleId,
            Title = request.Title,
            Content = request.Content,
            PictureUrl = request.PictureUrl,
            CreatedAt = DateTime.UtcNow,
            AuthorId = authorId
        };

        var response = new ArticleResponse
        {
            Id = articleId,
            Title = request.Title,
            Content = request.Content,
            PictureUrl = request.PictureUrl,
            CreatedAt = DateTime.UtcNow,
            Category = "Test_category",
            Author = authorName
        };

        var author = new IdentityUser
        {
            UserName = authorName,
            Id = authorId
        };

        _userManagerMock.Setup(m => m.FindByIdAsync(authorId)).ReturnsAsync(author);
        _userManagerMock.Setup(m => m.FindByNameAsync(authorName)).ReturnsAsync(author);

        _articleServiceMock.Setup(s => s.UpdateArticle(dto)).ReturnsAsync(dto);

        _mapperMock.Setup(m => m.Map<ArticleDTO>(request)).Returns(dto);
        _mapperMock.Setup(m => m.Map<ArticleResponse>(dto)).Returns(response);

        var result = await _controller.Update(articleId, request);

        var okObjectResult = Assert.IsType<OkObjectResult>(result);
        var controllerResponse = Assert.IsType<ArticleResponse>(okObjectResult.Value);
        Assert.Equal(controllerResponse.Title, request.Title);
        Assert.Equal(controllerResponse.Content, request.Content);
        Assert.Equal(controllerResponse.PictureUrl, request.PictureUrl);
        Assert.Equal(controllerResponse.Author, authorName);
    }

    // Тест на удаление статьи
    [Fact]
    public async Task Delete_ReturnsOkResult_WithDeletedArticle()
    {
        // Arrange
        var articleDto = new ArticleDTO { Id = Guid.NewGuid(), AuthorId = "1" };
        var articleResponse = new ArticleResponse { Id = articleDto.Id, Author = "user1" };

        _articleServiceMock.Setup(s => s.DeleteArticle(articleDto.Id)).ReturnsAsync(articleDto);
        _mapperMock.Setup(m => m.Map<ArticleResponse>(articleDto)).Returns(articleResponse);
        _userManagerMock.Setup(um => um.FindByIdAsync("1")).ReturnsAsync(new IdentityUser { UserName = "user1" });

        // Act
        var result = await _controller.Delete(articleDto.Id);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<ArticleResponse>(okResult.Value);
        Assert.Equal(articleDto.Id, returnValue.Id);
        Assert.Equal("user1", returnValue.Author);
    }

    // Вспомогательный метод для мокирования UserManager
    private Mock<UserManager<IdentityUser>> MockUserManager()
    {
        var store = new Mock<IUserStore<IdentityUser>>();
        return new Mock<UserManager<IdentityUser>>(store.Object, null, null, null, null, null, null, null, null);
    }

    // Установка контекста для авторизованного пользователя
    private void SetUserContext(string userName)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, userName)
        };

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }
}
