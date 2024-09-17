using AutoMapper;
using News.BLL.DTO;
using News.DAL.Entities;

namespace News.Presentation.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Category, CategoryDTO>().ReverseMap();

        CreateMap<ArticleDTO, Article>()
            .ForMember(x => x.Category, opt => opt.MapFrom(x => new Category { Id = x.Category.Id, Name = x.Category.Name }));
        CreateMap<Article, ArticleDTO>()
            .ForMember(x => x.Category, opt => opt.MapFrom(x => new CategoryDTO { Id = x.CategoryId, Name = x.Category.Name }));
    }
}
