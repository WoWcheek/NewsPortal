using AutoMapper;
using News.BLL.DTO;
using News.DAL.Entities;
using News.Presentation.Models.Requests;
using News.Presentation.Models.Responses;

namespace News.Presentation.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Category, CategoryDTO>().ReverseMap();
        CreateMap<CategoryDTO, CategoryResponse>();
        CreateMap<AddCategoryRequest, CategoryDTO>();
        CreateMap<UpdateCategoryRequest, CategoryDTO>();

        CreateMap<ArticleDTO, Article>()
            .ForMember(x => x.Category, opt => opt.MapFrom(x => new Category { Id = x.Category.Id, Name = x.Category.Name }));
        CreateMap<Article, ArticleDTO>()
            .ForMember(x => x.Category, opt => opt.MapFrom(x => new CategoryDTO { Id = x.CategoryId, Name = x.Category.Name }));
        CreateMap<ArticleDTO, ArticleResponse>()
            .ForMember(x => x.Category, opt => opt.MapFrom(x => x.Category.Name));
        CreateMap<AddArticleRequest, ArticleDTO>();
        CreateMap<UpdateArticleRequest, ArticleDTO>();
    }
}
