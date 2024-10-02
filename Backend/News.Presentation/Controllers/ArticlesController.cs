using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using News.BLL.DTO;
using News.BLL.Interfaces;
using News.Presentation.Models.Requests;
using News.Presentation.Models.Responses;

namespace News.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : Controller
{
    private readonly IMapper _mapper;
    private readonly IArticleService _articleService;
    private readonly UserManager<IdentityUser> _userManager;

    public ArticlesController(IMapper mapper, IArticleService articleService, UserManager<IdentityUser> userManager)
    {
        _mapper = mapper;
        _articleService = articleService;
        _userManager = userManager;
    }

    /// <summary>
    /// Получить список всех новостей
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var articles = await _articleService.GetAllArticles();

        var response = _mapper.Map<List<ArticleResponse>>(articles);

        for (int i = 0; i < articles.Count(); i++)
        {
            var authorId = articles.ElementAt(i).AuthorId;
            response[i].Author = (await _userManager.FindByIdAsync(authorId))!.UserName!;
        }

        return Ok(response);
    }

    /// <summary>
    /// Получить новость по ее id
    /// </summary>
    [HttpGet]
    [Route("{id:Guid}")]
    public async Task<IActionResult> GetSingle([FromRoute] Guid id)
    {
        var article = await _articleService.GetArticleById(id);

        var response = _mapper.Map<ArticleResponse>(article);

        var authorId = article.AuthorId;
        response.Author = (await _userManager.FindByIdAsync(authorId))!.UserName!;

        return Ok(response);
    }

    /// <summary>
    /// Добавить новость
    /// </summary>
    /// <param name="request">
    /// Запрос, включающий в себя название новости, ее содержание, ссылку на картинку и id существующей категории, к которой следует отнести новость
    /// </param>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] AddArticleRequest request)
    {
        var articleDto = _mapper.Map<ArticleDTO>(request);

        var userName = User.Identity!.Name!;
        var auuthorId = (await _userManager.FindByNameAsync(userName))!.Id;

        articleDto.AuthorId = auuthorId;

        try
        {
            articleDto = await _articleService.CreateArticle(articleDto);

            var response = _mapper.Map<ArticleResponse>(articleDto);
            response.Author = (await _userManager.FindByIdAsync(auuthorId))!.UserName!;

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Обновить новость
    /// </summary>
    /// <param name="id">id новости, которую нужно обновить</param>
    /// <param name="request">
    /// Запрос, включающий в себя новое название новости, ее новое содержание, новую ссылку на картинку и новій id существующей категории, к которой следует отнести новость
    /// </param>
    [HttpPut]
    [Authorize]
    [Route("{id:Guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateArticleRequest request)
    {
        var articleDto = _mapper.Map<ArticleDTO>(request);
        articleDto.Id = id;

        try
        {
            articleDto = await _articleService.UpdateArticle(articleDto);

            var response = _mapper.Map<ArticleResponse>(articleDto);
            response.Author = (await _userManager.FindByIdAsync(articleDto.AuthorId))!.UserName!;

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Удалить новость
    /// </summary>
    /// <param name="id">id новости, которую нужно удалить
    /// </param>
    [HttpDelete]
    [Authorize]
    [Route("{id:Guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        try
        {
            var articleDto = await _articleService.DeleteArticle(id);

            var response = _mapper.Map<ArticleResponse>(articleDto);
            response.Author = (await _userManager.FindByIdAsync(articleDto.AuthorId))!.UserName!;

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
