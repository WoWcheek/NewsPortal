using AutoMapper;
using News.BLL.DTO;
using News.BLL.Interfaces;
using News.DAL.Entities;
using News.DAL.Interfaces;

namespace News.BLL.Services;

public class CategoryService : ICategoryService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public CategoryService(IMapper mapper, IUnitOfWork unitOfWork)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CategoryDTO>> GetAllCategories()
    {
        var categories = await _unitOfWork
            .Categories
            .All();

        var categoriesDto = _mapper
            .Map<List<CategoryDTO>>(categories);

        return categoriesDto;
    }

    public async Task<CategoryDTO> GetCategoryById(Guid id)
    {
        var category = await _unitOfWork
            .Categories
            .Find(id);

        var categoryDto = _mapper
            .Map<CategoryDTO>(category);

        return categoryDto;
    }

    public async Task<CategoryDTO> CreateCategory(CategoryDTO newCategory)
    {
        var categoryExists = await _unitOfWork
            .Categories
            .Exists(x => string.Compare(x.Name, newCategory.Name, StringComparison.OrdinalIgnoreCase) == 0);

        if (categoryExists)
        {
            throw new Exception($"Category {newCategory.Name} already exists.");
        }

        newCategory.Name = newCategory.Name.ToLower();

        var category = _mapper
            .Map<Category>(newCategory);

        var createdCategory = await _unitOfWork
            .Categories
            .Add(category);

        if (createdCategory is null)
        {
            throw new Exception($"Something went wrong while adding new category. Please check if provided values are valid.");
        }

        await _unitOfWork.CommitChanges();

        var createdCategoryDto = _mapper
            .Map<CategoryDTO>(createdCategory);

        return createdCategoryDto;
    }

    public async Task<CategoryDTO> UpdateCategory(CategoryDTO newCategory)
    {
        var categoryExists = await _unitOfWork
                    .Categories
                    .Exists(x => string.Compare(x.Name, newCategory.Name, StringComparison.OrdinalIgnoreCase) == 0 && x.Id != newCategory.Id);

        if (categoryExists)
        {
            throw new Exception($"Category {newCategory.Name} already exists.");
        }

        newCategory.Name = newCategory.Name.ToLower();

        var category = _mapper
            .Map<Category>(newCategory);

        var updatedCategory = await _unitOfWork
            .Categories
            .Update(category);

        if (updatedCategory is null)
        {
            throw new Exception($"Something went wrong while updating category. Please check if provided values are valid.");
        }

        await _unitOfWork.CommitChanges();

        var updatedCategoryDto = _mapper
            .Map<CategoryDTO>(updatedCategory);

        return updatedCategoryDto;
    }

    public async Task<CategoryDTO> DeleteCategory(Guid id)
    {
        var deletedCategory = await _unitOfWork
            .Categories
            .Delete(id);

        if (deletedCategory is null)
        {
            throw new Exception("Category does not exist.");
        }

        await _unitOfWork.CommitChanges();

        var deletedCategoryDto = _mapper
            .Map<CategoryDTO>(deletedCategory);

        return deletedCategoryDto;
    }

    public void Dispose()
    {
        _unitOfWork.Dispose();
    }
}