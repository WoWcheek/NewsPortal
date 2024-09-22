using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using News.BLL.DTO;
using News.BLL.Interfaces;
using News.Presentation.Models.Requests;
using News.Presentation.Models.Responses;

namespace News.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : Controller
{
    private readonly IMapper _mapper;
    private readonly ICategoryService _categoryService;

    public CategoriesController(IMapper mapper, ICategoryService categoryService)
    {
        _mapper = mapper;
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryService.GetAllCategories();

        var response = _mapper.Map<List<CategoryResponse>>(categories);

        return Ok(response);
    }

    [HttpGet]
    [Route("{id:Guid}")]
    public async Task<IActionResult> GetSingle([FromRoute] Guid id)
    {
        var category = await _categoryService.GetCategoryById(id);

        var response = _mapper.Map<CategoryResponse>(category);

        return Ok(response);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Add([FromBody] AddCategoryRequest request)
    {
        var categoryDto = _mapper.Map<CategoryDTO>(request);

        try
        {
            categoryDto = await _categoryService.CreateCategory(categoryDto);

            var response = _mapper.Map<CategoryResponse>(categoryDto);

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    [Authorize]
    [Route("{id:Guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateArticleRequest request)
    {
        var categoryDto = _mapper.Map<CategoryDTO>(request);
        categoryDto.Id = id;

        try
        {
            categoryDto = await _categoryService.UpdateCategory(categoryDto);

            var response = _mapper.Map<CategoryResponse>(categoryDto);

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete]
    [Authorize]
    [Route("{id:Guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        try
        {
            var categoryDto = await _categoryService.DeleteCategory(id);

            var response = _mapper.Map<CategoryResponse>(categoryDto);

            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
