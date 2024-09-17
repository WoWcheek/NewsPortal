using News.BLL.DTO;

namespace News.BLL.Interfaces;

public interface ICategoryService : IDisposable
{
    Task<IEnumerable<CategoryDTO>> GetAllCategories();
    Task<CategoryDTO> GetCategoryById(Guid id);
    Task<CategoryDTO> CreateCategory(CategoryDTO newCategory);
    Task<CategoryDTO> UpdateCategory(CategoryDTO newCategory);
    Task<CategoryDTO> DeleteCategory(Guid id);
}
